// src/components/PaymentModal.js (New File)

import React, { useState } from 'react';

const PaymentModal = ({ finalAmount, onConfirmPayment, onCancel }) => {
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentWay, setPaymentWay] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Dynamic list of 'Ways' based on the selected 'Mode'
    const paymentWays = {
        'Card': ['Visa', 'Mastercard', 'American Express'],
        'UPI': ['Google Pay (GPay)', 'PhonePe', 'Paytm'],
        'Net Banking': ['ICICI Bank', 'HDFC Bank', 'SBI'],
        'Cash On Delivery': ['Exact Change', 'Change Needed']
    };

    const handleConfirm = () => {
        if (!paymentMode || !paymentWay) {
            alert("Please select both a Payment Mode and Way of Payment.");
            return;
        }
        setIsProcessing(true);
        
        // --- 🔒 SIMULATE PAYMENT GATEWAY INTERACTION 🔒 ---
        setTimeout(() => {
            setIsProcessing(false);
            // Pass the collected payment details back to the parent component
            onConfirmPayment({ paymentMode, paymentWay });
        }, 1500);
    };

    // Inline styles for a modern, functional modal appearance
    const modalStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', 
        alignItems: 'center', zIndex: 1000
    };
    const contentStyle = {
        backgroundColor: 'white', padding: '30px', borderRadius: '10px',
        width: '90%', maxWidth: '450px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
    };

    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                <h3 style={{ color: "#8b1533", marginBottom: '20px' }}>Complete Your Payment 💳</h3>
                
                <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                    Total: <span style={{ color: '#8b1533' }}>₹{finalAmount.toFixed(2)}</span>
                </p>

                {/* 1. Payment Mode Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mode of Payment:</label>
                    <select
                        value={paymentMode}
                        onChange={(e) => {
                            setPaymentMode(e.target.value);
                            setPaymentWay('');
                        }}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        disabled={isProcessing}
                    >
                        <option value="" disabled>Select Mode</option>
                        {Object.keys(paymentWays).map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                        ))}
                    </select>
                </div>

                {/* 2. Way of Payment Selection */}
                {paymentMode && (
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Way of Payment:</label>
                        <select
                            value={paymentWay}
                            onChange={(e) => setPaymentWay(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            disabled={isProcessing}
                        >
                            <option value="" disabled>Select Way ({paymentMode})</option>
                            {paymentWays[paymentMode].map(way => (
                                <option key={way} value={way}>{way}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button 
                        className="btn" 
                        onClick={handleConfirm}
                        disabled={!paymentMode || !paymentWay || isProcessing}
                        style={{ flex: 1, padding: '12px 20px', opacity: isProcessing ? 0.7 : 1 }}
                    >
                        {isProcessing ? 'Processing...' : 'Pay & Confirm Order'}
                    </button>
                    <button 
                        onClick={onCancel}
                        disabled={isProcessing}
                        style={{ 
                            background: 'transparent', 
                            border: '1px solid #ccc', 
                            color: '#6b6b6b', 
                            padding: '12px 20px', 
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;