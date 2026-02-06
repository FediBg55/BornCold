require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'borncold_db',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send confirmation email in Arabic
const sendConfirmationEmail = async (toEmail, customerName, color, size) => {
    const mailOptions = {
        from: `"BornCold" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: '🧊 تأكيد الطلب المسبق - BornCold',
        html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #0d1b2a, #1b263b); border-radius: 16px; padding: 30px; border: 1px solid #00f2ff;">
                <h1 style="color: #00f2ff; font-size: 32px; margin-bottom: 10px;">BornCold</h1>
                <p style="color: #aaa; font-size: 14px; margin-bottom: 30px;">الحرارة تنخفض عندما نصل</p>
                
                <h2 style="color: #fff; font-size: 22px;">مرحباً ${customerName || 'بك'}! 🎉</h2>
                
                <p style="font-size: 16px; line-height: 1.8; color: #ddd;">
                    تم تأكيد طلبك المسبق بنجاح!<br/>
                    شكراً لانضمامك إلى عائلة BornCold.
                </p>
                
                <div style="background: rgba(0,242,255,0.1); border-radius: 10px; padding: 20px; margin: 25px 0; text-align: right;">
                    <h3 style="color: #00f2ff; margin-bottom: 15px;">تفاصيل طلبك:</h3>
                    <p style="margin: 8px 0;"><strong>اللون:</strong> ${color || 'غير محدد'}</p>
                    <p style="margin: 8px 0;"><strong>المقاس:</strong> ${size || 'غير محدد'}</p>
                </div>
                
                <p style="font-size: 14px; color: #888; margin-top: 30px;">
                    سنتواصل معك قريباً عند إطلاق المنتج.<br/>
                    ابقَ بارداً. ❄️
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
                    <p style="font-size: 12px; color: #555;">© 2026 BornCold. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to:', toEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Routes
app.post('/api/subscribe', (req, res) => {
    const { email, color, size, name, phone, address } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const query = 'INSERT INTO subscribers (email, color, size, full_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [email, color, size, name, phone, address], async (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Email already registered' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Send confirmation email
        await sendConfirmationEmail(email, name, color, size);

        res.status(201).json({ message: 'Subscribed successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
