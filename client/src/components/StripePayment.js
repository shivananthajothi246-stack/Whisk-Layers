import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import API from "../api";

// Initialize Stripe - Replace with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51QKexample");

const CheckoutForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create payment intent
    API.post("/stripe/create-payment-intent", { amount })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Failed to create payment intent:", err);
        setError("Failed to initialize payment");
      });
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Customer",
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
          Card Details
        </label>
        <div style={{
          padding: "12px",
          border: "2px solid #f1e6e9",
          borderRadius: "8px",
          background: "white"
        }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div style={{
          color: "#d32f2f",
          marginBottom: "16px",
          padding: "12px",
          background: "#ffebee",
          borderRadius: "8px"
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "12px",
            background: "transparent",
            border: "2px solid #8b1533",
            color: "#8b1533",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          className="btn"
          style={{
            flex: 1,
            opacity: (!stripe || processing || !clientSecret) ? 0.6 : 1,
            cursor: (!stripe || processing || !clientSecret) ? "not-allowed" : "pointer"
          }}
        >
          {processing ? "Processing..." : `Pay ₹${amount}`}
        </button>
      </div>
    </form>
  );
};

const StripePayment = ({ amount, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};

export default StripePayment;

