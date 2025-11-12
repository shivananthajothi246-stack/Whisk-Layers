# Stripe Payment Integration Setup

## Installation Required

### Backend (Server)
```bash
cd server
npm install stripe
```

### Frontend (Client)
```bash
cd client
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Environment Variables

### Server (.env)
Add to `server/.env`:
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

### Client (.env)
Create `client/.env`:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Stripe Account Setup

1. Go to https://stripe.com and create an account
2. Get your test API keys from the Stripe Dashboard
3. Add the keys to your .env files as shown above

## Features Implemented

✅ **Stripe Card Payments** - Secure card processing via Stripe
✅ **Cash on Delivery** - Traditional COD option
✅ **UPI Payments** - UPI payment simulation
✅ **Payment Tracking** - Real-time payment status updates
✅ **Order Tracking** - Complete order status tracking
✅ **Search Functionality** - Search bakeries and products
✅ **Fixed Customization Flow** - Proper add to cart functionality

## Payment Flow

1. User adds items to cart
2. Goes to checkout
3. Selects payment method:
   - **Cash on Delivery** - No payment required upfront
   - **Pay Online** → **Card** - Uses Stripe for secure payment
   - **Pay Online** → **UPI** - UPI payment simulation
4. Order is placed and tracked

## Testing Stripe

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

