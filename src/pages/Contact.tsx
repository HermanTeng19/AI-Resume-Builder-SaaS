import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: `${formData.get('name')} ${formData.get('last_name')}`.trim(),
      email: formData.get('email'),
      topic: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again later.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0f172a' }}>Get in touch</h1>
        <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
          Have a question about bypassing ATS filters, or need help with your API key? We're here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        {/* Left Side: Contact Info & FAQ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={20} color="#3b82f6" /> Direct Support
            </h3>
            <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>
              Prefer email? Drop us a line directly. We aim to respond to all inquiries within 24 hours.
            </p>
            <a href="mailto:support@careerinsightlabs.com" style={{ color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none' }}>
              support@careerinsightlabs.com
            </a>
          </div>

          <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="#10b981" /> Partnerships
            </h3>
            <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>
              Interested in integrating our ATS scoring logic into your platform? Let's talk business.
            </p>
            <a href="mailto:partners@careerinsightlabs.com" style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'none' }}>
              partners@careerinsightlabs.com
            </a>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#0f172a' }}>Frequently Asked Questions</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>Where is my resume data stored?</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Nowhere! Our tool processes your PDF/Word documents 100% locally in your browser. We have Zero Data Retention.
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e293b' }}>Why do I need my own API Key?</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
                To keep the tool free and private, we use a BYOK (Bring Your Own Key) model. Your key is stored only in your local browser storage.
              </p>
            </div>
            
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div style={{ padding: '3rem', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', border: '1px solid #f1f5f9' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1rem' }}>Message Sent!</h3>
              <p style={{ color: '#475569', lineHeight: '1.6' }}>
                Thanks for reaching out. We've received your message and our team will get back to you shortly.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#0f172a' }}>Send a Message</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {errorMsg && (
                  <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.95rem' }}>
                    {errorMsg}
                  </div>
                )}
                
                <div className="contact-form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>First Name</label>
                    <input type="text" name="name" required placeholder="John" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Last Name</label>
                    <input type="text" name="last_name" placeholder="Doe" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Email Address</label>
                  <input type="email" name="email" required placeholder="john@example.com" style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem' }} />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>What can we help you with?</label>
                  <select name="subject" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', backgroundColor: '#fff' }} defaultValue="">
                    <option value="" disabled>Select an option...</option>
                    <option value="Bug Report">Report a Parsing Bug</option>
                    <option value="Feature Request">Suggest a Feature</option>
                    <option value="API Help">Help with BYOK / API Keys</option>
                    <option value="Partnership">Business Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Message</label>
                  <textarea name="message" required rows={5} placeholder="If reporting a bug, please include screenshots of the parsed output vs your original PDF..." style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-cohere" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
                  This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
