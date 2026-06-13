import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, topic, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Career Insight Labs Support <support@careerinsightlabs.com>',
      to: ['support@careerinsightlabs.com'], // Route via Cloudflare so Gmail recognizes the "To" address for auto-reply matching
      subject: `New Contact Form Submission: ${topic || 'General Inquiry'}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>New Message from Career Insight Labs Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${topic || 'Not specified'}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
      replyTo: email, // Resend v3 camelCase for Reply-To header
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
