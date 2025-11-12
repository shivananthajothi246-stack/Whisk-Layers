import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api"; // Assuming you have this API instance

export default function PaymentSuccess() {
    // FIX: Use useParams to get the ID from the URL path (/order-status/:id)
    const { id } = useParams(); 
    
    // State to hold the fetched order details
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    // Fetch order details when the component mounts
    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                // Assuming you have an API endpoint to fetch a single order by ID
                const res = await API.get(`/orders/${id}`); 
                setOrderDetails(res.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
                // Set an empty object to handle missing data gracefully
                setOrderDetails({}); 
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <main className="page container" style={{ textAlign: 'center', padding: '100px 0' }}>
                <p>Loading order details...</p>
            </main>
        );
    }
    
    // Destructure payment details for display
    const paymentMode = orderDetails?.paymentMode || 'N/A';
    const paymentWay = orderDetails?.paymentWay || 'N/A';
    
    // FIX: Prioritize finalAmount (new field) or totalAmount (existing field)
    const finalAmount = orderDetails?.finalAmount || orderDetails?.totalAmount || 'N/A';


    return (
        <main className="page container">
            <div className="card" style={{ textAlign: 'center', maxWidth: 700, margin: '40px auto', padding: 30 }}>
                {/* 🎯 CHANGE HERE: Centering the image */}
                <img 
                    src="/images/success.png" 
                    alt="success" 
                    style={{ 
                        width: 120, 
                        marginBottom: 20, 
                        display: 'block', // Crucial for margin: auto to work
                        margin: '0 auto 20px auto' // Top/bottom margin + auto for left/right
                    }} 
                />
                <h2 style={{ color: "#8b1533" }}>Payment Successful 🎉</h2>
                
                <p style={{ fontSize: '1.1em', marginBottom: 10 }}>
                    Your order ID: <strong>{id}</strong>
                </p>

                {/* Display Payment Information */}
                <div style={{ 
                    marginTop: 20, 
                    padding: '15px', 
                    border: '1px dashed #e0c5cc', 
                    borderRadius: '8px',
                    textAlign: 'left',
                    display: 'inline-block',
                    minWidth: '300px'
                }}>
                    <h4 style={{ marginBottom: 10, color: '#8b1533' }}>Payment Details</h4>
                    <p>
                        <strong>Amount Paid:</strong> 
                        <span style={{ fontWeight: 700 }}>
                            {/* Check if the amount is a valid number before formatting */}
                            ₹{
                                isNaN(parseFloat(finalAmount)) 
                                ? 'N/A' 
                                : parseFloat(finalAmount).toFixed(2)
                            }
                        </span>
                    </p>
                    <p>
                        <strong>Mode of Payment:</strong> {paymentMode}
                    </p>
                    <p>
                        <strong>Way of Payment:</strong> {paymentWay}
                    </p>
                </div>

                <p style={{ marginTop: 20 }}>
                    Thank you for shopping with us!
                </p>

                <div style={{ marginTop: 24 }}>
                    <button className="btn" onClick={() => nav(`/order/${id}`)} style={{ padding: '12px 24px' }}>
                        Track Order
                    </button>
                    <button className="btn" style={{ marginLeft: 16, background: '#ff6f8e', padding: '12px 24px' }} onClick={() => nav('/')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </main>
    );
}