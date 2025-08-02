export const getVerificationTemplate = (verificationLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Muscle X</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: #ffffff;
            text-align: center;
            padding: 40px;
        }
        .content {
            padding: 40px;
        }
        h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            color: #1a1a1a;
            font-size: 24px;
            margin-top: 0;
        }
        p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #333333;
        }
        .button-container {
            text-align: center;
            margin: 25px 0;
        }
        .button {
            display: inline-block;
            padding: 15px 35px;
            background-color: #ff0000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .features {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 8px;
            margin-top: 30px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
        }
        .feature-item {
            margin-bottom: 20px;
            padding-left: 30px;
            position: relative;
        }
        .feature-item:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #ff0000;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #666666;
            background-color: #f8f8f8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Muscle X</h1>
        </div>
        <div class="content">
            <h2>Verify Your Email</h2>
            <p>Dear Valued Customer,</p>
            <p>Welcome to Muscle X - your trusted source for premium quality supplements. Please verify your email address to access your account:</p>
            <div class="button-container">
                <a href="${verificationLink}" class="button">Verify Email Now</a>
            </div>
            <p>If you can't click the button, copy and paste this link in your browser: <br>${verificationLink}</p>
            <p>If you didn't create an account with Muscle X, please disregard this email.</p>
            
            <div class="features">
                <h3>What you can do after verification:</h3>
                <div class="feature-item">Shop for premium quality supplements</div>
                <div class="feature-item">Track your orders easily</div>
                <div class="feature-item">Receive exclusive offers and updates</div>
                <div class="feature-item">Manage your subscription preferences</div>
            </div>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Muscle X | Premium Health Supplements<br>
            This is an automated message. Please do not reply to this email.
        </div>
    </div>
</body>
</html>
`;

export const getDeleteTemplate = (deletionLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Request - Muscle X</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: #ffffff;
            text-align: center;
            padding: 40px;
        }
        .content {
            padding: 40px;
        }
        h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            color: #1a1a1a;
            font-size: 24px;
            margin-top: 0;
        }
        p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #333333;
        }
        .button {
            display: inline-block;
            padding: 15px 35px;
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: #ffffff;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .alternatives {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 8px;
            margin-top: 30px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
        }
        .alternative-item {
            margin-bottom: 20px;
            padding-left: 30px;
            position: relative;
        }
        .alternative-item:before {
            content: '➤';
            position: absolute;
            left: 0;
            color: #ff0000;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #666666;
            background-color: #f8f8f8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>We Value Your Fitness Journey</h1>
        </div>
        <div class="content">
            <h2>Account Deletion Request</h2>
            <p>Dear Valued Customer,</p>
            <p>We've received a request to delete your Muscle X account. Before proceeding, we want to ensure this is your intended action, as it will affect your access to supplements, order history, and fitness progress tracking.</p>
            <p>If you're certain about deleting your account, please click the button below:</p>
            <a href="${deletionLink}" class="button">Confirm Account Deletion</a>
            <div class="warning">
                <strong>Warning:</strong> This action is irreversible. Once deleted, all your order history, supplement preferences, and personal data will be permanently removed from our systems.
            </div>
            <div class="alternatives">
                <h3>Consider these alternatives:</h3>
                <div class="alternative-item">
                    Temporarily pause your supplement orders
                </div>
                <div class="alternative-item">
                    Update your preferences or subscription
                </div>
                <div class="alternative-item">
                    Contact our support team for assistance
                </div>
            </div>
            <p>If you didn't request this deletion, please contact our support team immediately at support@musclex.com.</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Muscle X | Premium Health Supplements<br>
            This is an automated message. Please do not reply to this email.
        </div>
    </div>
</body>
</html>
`;

export const getResetTemplate = (resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Muscle X</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: #ffffff;
            text-align: center;
            padding: 40px;
        }
        .content {
            padding: 40px;
        }
        h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            color: #1a1a1a;
            font-size: 24px;
            margin-top: 0;
        }
        p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #333333;
        }
        .button {
            display: inline-block;
            padding: 15px 35px;
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: #ffffff;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #666666;
            background-color: #f8f8f8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>Dear Valued Customer,</p>
            <p>We received a request to reset the password for your Muscle X account. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you didn't request this password reset, please contact our support team immediately at support@musclex.com</p>
            <p>This link will expire in 15 minutes for security reasons.</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Muscle X | Premium Health Supplements<br>
            This is an automated message. Please do not reply to this email.
        </div>
    </div>
</body>
</html>
`;

export const getPaymentSuccessTemplate = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful - Muscle X</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: #ffffff;
            text-align: center;
            padding: 40px;
        }
        .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .content {
            padding: 40px;
        }
        .payment-details {
            background-color: #f0fdf4;
            border: 1px solid #dcfce7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dcfce7;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .amount {
            font-size: 24px;
            color: #16a34a;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✓</div>
            <h1>Payment Successful!</h1>
        </div>
        <div class="content">
            <p>Dear ${data.userName},</p>
            <p>Your payment for supplements has been successfully processed. Here are your transaction details:</p>
            
            <div class="payment-details">
                <div class="detail-row">
                    <strong>Amount Paid:</strong>
                    <span class="amount">₹${data.amount}</span>
                </div>
                <div class="detail-row">
                    <strong>Receipt Number:</strong>
                    <span>${data.receiptNumber}</span>
                </div>
                <div class="detail-row">
                    <strong>Payment ID:</strong>
                    <span>${data.paymentId}</span>
                </div>
                <div class="detail-row">
                    <strong>Date:</strong>
                    <span>${new Date(data.date).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span>
                </div>
                <div class="detail-row">
                    <strong>Order Type:</strong>
                    <span>${data.feeTitle || "Supplement Purchase"}</span>
                </div>
            </div>

            <p>Your payment receipt has been attached to this email for your records.</p>
            <p>Thank you for your purchase! We look forward to supporting your fitness journey.</p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Muscle X | Premium Health Supplements</p>
            <p>For any queries, please contact our support team at support@musclex.com</p>
        </div>
    </div>
</body>
</html>
`;

export const getPaymentFailureTemplate = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - Muscle X</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: #ffffff;
            text-align: center;
            padding: 40px;
        }
        .failed-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .content {
            padding: 40px;
        }
        .error-box {
            background-color: #fef2f2;
            border: 1px solid #fee2e2;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .retry-button {
            display: inline-block;
            background: #ef4444;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f8f8;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="failed-icon">✕</div>
            <h1>Payment Failed</h1>
        </div>
        <div class="content">
            <p>Dear ${data.userName},</p>
            <p>We're sorry, but your recent payment attempt for supplements was unsuccessful.</p>
            
            <div class="error-box">
                <h3>Transaction Details:</h3>
                <p><strong>Amount:</strong> ₹${data.amount}</p>
                <p><strong>Date:</strong> ${new Date(data.date).toLocaleString(
                  "en-IN"
                )}</p>
                <p><strong>Order Type:</strong> ${
                  data.feeTitle || "Supplement Purchase"
                }</p>
                <p><strong>Error:</strong> ${
                  data.error || "Transaction could not be completed"
                }</p>
            </div>

            <p>Possible reasons for payment failure:</p>
            <ul>
                <li>Insufficient funds in your account</li>
                <li>Bank server issues</li>
                <li>Network connectivity problems</li>
                <li>Transaction timeout</li>
            </ul>

            <p>Please try again or contact your bank if the issue persists.</p>
            
            <a href="${process.env.FRONTEND_URL}/cart" class="retry-button">
                Retry Payment
            </a>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Muscle X | Premium Health Supplements</p>
            <p>Need help? Contact our support team at support@musclex.com</p>
        </div>
    </div>
</body>
</html>
`;

export const getContactFormTemplate = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - Muscle X</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: #ffffff;
            text-align: center;
            padding: 30px;
        }
        .content {
            padding: 30px;
        }
        h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        h2 {
            color: #1a1a1a;
            font-size: 22px;
            margin-top: 0;
        }
        .message-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .contact-details {
            margin-top: 30px;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #666666;
            background-color: #f8f8f8;
        }
        .detail-row {
            margin-bottom: 10px;
        }
        .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 100px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Customer Inquiry</h1>
        </div>
        <div class="content">
            <h2>${data.subject || "Inquiry About Supplements"}</h2>
            
            <div class="message-box">
                <p>${data.message}</p>
            </div>
            
            <div class="contact-details">
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span>${data.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span>${data.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span>${data.phone}</span>
                </div>
            </div>
            
            <p>Please respond to this inquiry about our supplements at your earliest convenience.</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Muscle X | Premium Health Supplements<br>
            This is an automated message from your website contact form.
        </div>
    </div>
</body>
</html>
`;

export const getOrderConfirmationTemplate = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Muscle X</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: #ffffff;
            text-align: center;
            padding: 30px;
        }
        .content {
            padding: 30px;
        }
        h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        h2 {
            color: #1a1a1a;
            font-size: 22px;
            margin-top: 0;
        }
        .order-details {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .order-summary {
            margin-top: 30px;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #666666;
            background-color: #f8f8f8;
        }
        .detail-row {
            margin-bottom: 10px;
        }
        .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }
        .order-items {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .order-items th {
            background-color: #e9ecef;
            padding: 10px;
            text-align: left;
        }
        .order-items td {
            padding: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        .total-row {
            font-weight: bold;
            border-top: 2px solid #dee2e6;
        }
        .button-container {
            text-align: center;
            margin-top: 25px;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: #ff0000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <div class="content">
            <h2>Thank You For Your Order!</h2>
            <p>Dear ${data.userName},</p>
            <p>We've received your order and are working on it. Here's a summary of your purchase:</p>
            
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Order Number:</span>
                    <span>${data.orderNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Date:</span>
                    <span>${new Date(
                      data.orderDate
                    ).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span>${data.paymentMethod}</span>
                </div>
            </div>
            
            <table class="order-items">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items
                      .map(
                        (item) => `
                    <tr>
                        <td>${item.name} ${item.variant}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price}</td>
                    </tr>
                    `
                      )
                      .join("")}
                    <tr class="total-row">
                        <td colspan="2">Subtotal</td>
                        <td>₹${data.subtotal}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Shipping</td>
                        <td>₹${data.shipping}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Tax</td>
                        <td>₹${data.tax}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2">Total</td>
                        <td>₹${data.total}</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="order-summary">
                <h3>Shipping Address:</h3>
                <p>
                    ${data.shippingAddress.name}<br>
                    ${data.shippingAddress.street}<br>
                    ${data.shippingAddress.city}, ${
  data.shippingAddress.state
} ${data.shippingAddress.postalCode}<br>
                    ${data.shippingAddress.country}
                </p>
            </div>
            
            <p>You can track your order status in your account dashboard:</p>
            <div class="button-container">
                <a href="${
                  process.env.FRONTEND_URL
                }/account/orders" class="button">Track Your Order</a>
            </div>
            <p>If you can't click the button, copy and paste this link in your browser: <br>${
              process.env.FRONTEND_URL
            }/account/orders</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Muscle X | Premium Health Supplements<br>
            Questions? Contact our customer support at support@musclex.com
        </div>
    </div>
</body>
</html>
`;
