import express from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = process.env.SERVER_PORT || 3001;

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

// Create transporter with OAuth2
const createTransporter = async () => {
  try {
    console.log('Creating transporter with refresh token:', process.env.GMAIL_REFRESH_TOKEN?.slice(0, 10) + '...');
    
    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    // Get new access token
    console.log('Getting access token...');
    const { token } = await oauth2Client.getAccessToken();
    
    if (!token) {
      throw new Error('Failed to get access token');
    }
    console.log('Successfully got access token');

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: token
      }
    });

    // Verify transporter
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully');
    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      response: error.response?.data,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN ? 'Present' : 'Missing'
    });

    if (error.message === 'invalid_grant') {
      throw new Error('OAuth2 refresh token is invalid or expired. Please generate a new refresh token.');
    }
    throw error;
  }
};

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.post('/api/send-email', async (req, res) => {
  console.log('Received email request:', req.body);

  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ 
      error: 'Missing required fields' 
    });
  }

  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: {
        name: `${firstName} ${lastName}`,
        address: process.env.EMAIL_USER
      },
      to: 'alimorrisvogt@gmail.com',
      subject: `Contact from ${firstName} ${lastName}`,
      text: `
From: ${firstName} ${lastName}
Email: ${email}

Message:
${message}
      `,
      replyTo: email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    res.status(200).json({ 
      message: 'Email sent successfully',
      id: info.messageId 
    });
  } catch (error) {
    console.error('Error sending email:', {
      code: error.code,
      response: error.response,
      message: error.message,
      stack: error.stack
    });
    
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check server configuration.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Failed to connect to email server.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
});

// Start server
const startServer = async () => {
  try {
    // Start the server first
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('Environment variables:', {
        NODE_ENV: process.env.NODE_ENV || 'development',
        EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
        GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not set',
        GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
        GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not set'
      });
    });

    // Test email configuration after server is running
    console.log('Testing email configuration...');
    try {
      const transporter = await createTransporter();
      console.log('Email configuration is valid');
    } catch (emailError) {
      console.error('Email configuration failed, but server will continue running:', emailError);
    }

    // Handle server shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 