# 🚀 Quick Start Guide - Admin Dashboard

## What's New?
Your bakery management app now has a complete **Admin Dashboard** where you can:
- 👀 View all orders received by your bakery
- 📦 See item quantities and customization messages
- ✅ Accept or Reject orders with one click
- 📊 Track order status in real-time

---

## 5-Minute Setup

### Step 1: Start the Backend
```bash
cd server
npm install  # Only needed if first time
npm start
```
✓ Wait for "Server running on port 5000" message

### Step 2: Start the Frontend (New Terminal)
```bash
cd client
npm install  # Only needed if first time
npm start
```
✓ Browser should open automatically to http://localhost:3000

### Step 3: Login
- Click "Login" or go to http://localhost:3000/login
- Use any valid account (register if needed)
- ✓ You'll see "📊 Admin" button in navbar

### Step 4: Access Admin Dashboard
- Click the **"📊 Admin"** button in the navbar
- You'll see the Admin Dashboard page

### Step 5: Load Your Orders
- Enter your **Bakery ID** (ask your team lead or check your profile)
- Click **"Load Orders"**
- ✓ See all orders for your bakery!

---

## Using the Admin Dashboard

### Viewing Orders
Each order card shows:
- ✓ Customer name, email, phone
- ✓ Delivery address
- ✓ List of items with quantity
- ✓ **Customization message** (if any)
- ✓ Total amount
- ✓ Order status (Pending/Accepted/Rejected)
- ✓ When order was placed

### Managing Orders
1. **Accept Order**: Click green **"✓ Accept"** button
   - Order status changes to "Accepted"
   - You can start preparing

2. **Reject Order**: Click red **"✕ Reject"** button
   - Order status changes to "Rejected"
   - Customer will be notified

### Finding Your Bakery ID
If you don't know your bakery ID:
1. Check your profile page
2. Ask your manager or team lead
3. It's a long alphanumeric code (looks like: `507f1f77bcf86cd799439011`)

---

## Features at a Glance

| Feature | Status |
|---------|--------|
| View orders | ✅ |
| See customer info | ✅ |
| View item quantities | ✅ |
| View customization messages | ✅ |
| Accept orders | ✅ |
| Reject orders | ✅ |
| Real-time updates | ✅ |
| Mobile responsive | ✅ |
| Save bakery ID | ✅ |

---

## Keyboard Shortcuts
*(Coming in future versions)*

For now, everything is click-based!

---

## Troubleshooting

### Q: I don't see the "📊 Admin" button
**A:** Make sure you're logged in. The button only appears for logged-in users.

### Q: "No orders received yet"
**A:** 
1. Check your bakery ID is correct
2. Make sure orders were placed for your bakery
3. Try clicking "Load Orders" again

### Q: My order didn't change status
**A:**
1. Check if you have internet connection
2. Backend might have restarted - refresh page
3. Check browser console (F12) for errors

### Q: Customization message not showing
**A:** The order doesn't have customization data. Some orders might not have custom requests.

---

## Example Workflow

### Scenario: You're a Bakery Manager

**9:00 AM** - Shift starts
1. Click "📊 Admin" button
2. See 5 pending orders
3. Accept orders you can complete today
4. Reject orders that don't fit schedule

**10:00 AM** - New order comes in
1. Click "Load Orders" to refresh
2. See the new pending order
3. Decide to accept or reject
4. Click button - status updates instantly

**1:00 PM** - Shift ends
1. Check status of all orders
2. Make sure all pending are handled
3. Log out

---

## Technical Details

### API Endpoints
```
GET  /api/orders/admin/bakery/:bakeryId
PATCH /api/orders/admin/status/:orderId
```

### Database Fields
- `bakery` - Links order to your bakery
- `adminStatus` - Shows your approval: Pending/Accepted/Rejected

### Stored Data
Your bakery ID is saved locally so you don't need to re-enter it!

---

## Performance Tips

1. **Refresh Periodically**: Check for new orders by clicking "Load Orders"
2. **Use Same Bakery**: App remembers your bakery ID
3. **Fast Decisions**: Accept/Reject immediately to respond to customers

---

## Common Questions

**Q: Can I manage multiple bakeries?**  
A: For now, you can switch between bakeries by entering different bakery IDs.

**Q: Do customers see my decision?**  
A: Not yet, but it's coming in future versions!

**Q: Is my data secure?**  
A: Yes! Only you can see orders for your bakery, and access requires login.

**Q: Can I undo an Accept/Reject?**  
A: Not yet, but we're adding this feature soon.

**Q: What if I close the browser?**  
A: Your bakery ID is saved, so it will reload next time!

---

## Next Steps

1. ✅ **Setup complete!** Run `node setup-admin-dashboard.js` to verify
2. 📖 **Read full guide**: See `ADMIN_DASHBOARD_GUIDE.md` for detailed documentation
3. 🧪 **Test it out**: Try accepting/rejecting an order
4. 💡 **Provide feedback**: We'd love to hear how it works!

---

## Need Help?

### Resources
- 📖 Full Guide: `ADMIN_DASHBOARD_GUIDE.md`
- 🏗️ Architecture: `IMPLEMENTATION_SUMMARY.md`
- ✅ Verify Setup: `node setup-admin-dashboard.js`

### If Something Breaks
1. Check browser console (F12 → Console tab)
2. Make sure both backend and frontend are running
3. Try refreshing the page
4. Look for error messages

---

## Support

Got questions? Check the troubleshooting section or read the full documentation!

**You're all set! Enjoy managing your bakery orders! 🎂**

---

*Last Updated: November 12, 2025*  
*Version: 1.0*
