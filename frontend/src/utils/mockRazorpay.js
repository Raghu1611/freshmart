// Mock Razorpay Payment Modal for Testing
// This simulates the Razorpay payment experience without needing actual credentials

export const openMockRazorpayModal = (options, onSuccess, onFailure) => {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 32px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;

    modal.innerHTML = `
        <style>
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .mock-payment-btn {
                width: 100%; padding: 14px; border: none; border-radius: 8px;
                font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 12px;
            }
            .mock-payment-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
            .success-btn { background: #10B981; color: white; }
            .fail-btn { background: #EF4444; color: white; }
            .cancel-btn { background: #E5E7EB; color: #374151; }
            .tab-container { display: flex; margin-bottom: 20px; border-bottom: 2px solid #E5E7EB; }
            .tab { flex: 1; padding: 10px; text-align: center; cursor: pointer; color: #6B7280; font-weight: 500; }
            .tab.active { color: #10B981; border-bottom: 2px solid #10B981; margin-bottom: -2px; }
            .qr-container { text-align: center; margin: 20px 0; display: none; }
            .qr-container.active { display: block; }
            .card-container { display: none; }
            .card-container.active { display: block; }
        </style>
        
        <div style="text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <img src="/logo.png" onerror="this.src='https://via.placeholder.com/40?text=FM'" style="height: 40px; margin-right: 10px;">
                <h2 style="margin: 0; font-size: 20px; color: #111827;">${options.name || 'FreshMart'}</h2>
            </div>
            
            <div style="background: #F3F4F6; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-size: 12px; color: #6B7280;">Amount to Pay</div>
                <div style="font-size: 24px; font-weight: bold; color: #111827;">₹${(options.amount / 100).toFixed(2)}</div>
            </div>

            <div class="tab-container">
                <div class="tab active" onclick="switchTab('qr')">UPI / QR</div>
                <div class="tab" onclick="switchTab('card')">Card</div>
            </div>

            <!-- QR Code Section -->
            <div id="qr-section" class="qr-container active">
                <div style="background: white; padding: 10px; display: inline-block; border: 1px solid #E5E7EB; border-radius: 8px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=test@razorpay&pn=FreshMart&am=${options.amount / 100}" alt="Payment QR">
                </div>
                <p style="font-size: 14px; color: #4B5563; margin-top: 10px;">Scan with any UPI App</p>
                <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
                    <span style="font-size: 20px;">📱</span>
                    <span style="font-size: 20px;">💳</span>
                    <span style="font-size: 20px;">🏦</span>
                </div>
            </div>

            <!-- Card Section -->
            <div id="card-section" class="card-container">
                <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; border: 1px solid #E5E7EB; text-align: left;">
                    <div style="height: 10px; background: #E5E7EB; border-radius: 4px; width: 60%; margin-bottom: 10px;"></div>
                    <div style="height: 10px; background: #E5E7EB; border-radius: 4px; width: 40%;"></div>
                </div>
                <p style="font-size: 14px; color: #6B7280; margin-top: 10px;">Test Card: 4111 1111 1111 1111</p>
            </div>

            <div style="margin-top: 20px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
                <div style="background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 6px; padding: 8px; margin-bottom: 15px; font-size: 12px; color: #92400E;">
                    🧪 <b>Test Mode:</b> Scan QR or Click Success to simulate payment
                </div>
                
                <button class="mock-payment-btn success-btn" id="mockPaySuccess">
                    ✅ Simulate Payment Received
                </button>
                <button class="mock-payment-btn fail-btn" id="mockPayFail">
                    ❌ Simulate Failure
                </button>
                <button class="mock-payment-btn cancel-btn" id="mockPayCancel">
                    Cancel Transaction
                </button>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Tab switching logic
    window.switchTab = (tab) => {
        const qrSection = document.getElementById('qr-section');
        const cardSection = document.getElementById('card-section');
        const tabs = document.querySelectorAll('.tab');

        if (tab === 'qr') {
            qrSection.classList.add('active');
            cardSection.classList.remove('active');
            tabs[0].classList.add('active');
            tabs[1].classList.remove('active');
        } else {
            qrSection.classList.remove('active');
            cardSection.classList.add('active');
            tabs[0].classList.remove('active');
            tabs[1].classList.add('active');
        }
    };

    // Handle success
    document.getElementById('mockPaySuccess').onclick = () => {
        document.body.removeChild(overlay);
        const mockResponse = {
            razorpay_order_id: options.order_id,
            razorpay_payment_id: `pay_mock_upi_${Date.now()}`,
            razorpay_signature: `mock_signature_${Date.now()}`
        };
        setTimeout(() => onSuccess(mockResponse), 500);
    };

    // Handle failure
    document.getElementById('mockPayFail').onclick = () => {
        document.body.removeChild(overlay);
        setTimeout(() => onFailure({ error: { description: 'Payment failed (simulated)' } }), 300);
    };

    // Handle cancel
    document.getElementById('mockPayCancel').onclick = () => {
        document.body.removeChild(overlay);
        if (options.modal && options.modal.ondismiss) {
            setTimeout(() => options.modal.ondismiss(), 300);
        }
    };

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            if (options.modal && options.modal.ondismiss) {
                setTimeout(() => options.modal.ondismiss(), 300);
            }
        }
    };

};
