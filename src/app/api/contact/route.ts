import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- Google Sheets Integration ---
    try {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
        // Handle newlines in private key securely
        const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

        const jwt = new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

        // Append the row. Assuming the sheet has headers: [Timestamp, Name, Email, Service, Message]
        await sheet.addRow({
          Timestamp: new Date().toISOString(),
          Name: name,
          Email: email,
          Service: service || 'Not specified',
          Message: message
        });
        console.log('Successfully appended lead to Google Sheet.');
      } else {
        console.warn('Google Sheets configuration missing in .env. Skipping sheets integration.');
      }
    } catch (sheetError) {
      console.error('Error writing to Google Sheets:', sheetError);
      // We log the error but don't fail the entire request, so emails still send
    }

    // --- Email Integration ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to Nilesh (Lead Notification)
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: 'nileshvijay2002@gmail.com',
      subject: `New Portfolio Lead: ${name}`,
      html: `
        <h2>New Lead from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Email to the User (Auto-reply)
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for getting in touch! I have received your message regarding your project.</p>
        <p>I will review your requirements and get back to you shortly to discuss how we can build something great together.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Nilesh Vijay</strong></p>
        <p>Software Engineer</p>
      `,
    };

    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);

    return NextResponse.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
