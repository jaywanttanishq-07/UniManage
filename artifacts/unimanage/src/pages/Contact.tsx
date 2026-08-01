import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="home-page">
      {/* Header */}
      <section className="home-hero" style={{ minHeight: '36vh' }}>
        <div className="home-hero-inner">
          <button className="home-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="home-badge">📬 Get In Touch</div>
          <h1 className="home-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
            Contact <span className="home-title-accent">Us</span>
          </h1>
          <p className="home-subtitle" style={{ maxWidth: 520 }}>
            Have a question, need support, or want to request a feature? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="home-features-section">
        <div className="home-section-inner">
          <div className="contact-grid">

            {/* Contact info */}
            <div className="contact-info-col">
              <h2 className="contact-info-title">Reach Us Directly</h2>
              <div className="contact-info-items">
                <div className="contact-info-item">
                  <div className="contact-info-icon"><Mail size={18} /></div>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <div className="contact-info-value">support@unimanage.edu</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><Phone size={18} /></div>
                  <div>
                    <div className="contact-info-label">Phone</div>
                    <div className="contact-info-value">+91 80 1234 5678</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><MapPin size={18} /></div>
                  <div>
                    <div className="contact-info-label">Address</div>
                    <div className="contact-info-value">123 University Road,<br />Bangalore, Karnataka 560001</div>
                  </div>
                </div>
              </div>

              <div className="contact-hours-box">
                <div className="contact-hours-title">Support Hours</div>
                <div className="contact-hours-row"><span>Monday – Friday</span><span>9 AM – 6 PM IST</span></div>
                <div className="contact-hours-row"><span>Saturday</span><span>10 AM – 2 PM IST</span></div>
                <div className="contact-hours-row"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-col">
              {sent ? (
                <div className="contact-success">
                  <CheckCircle size={48} color="var(--gold)" />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn-gold" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h3 className="contact-form-title">Send a Message</h3>
                  <div className="contact-form-row">
                    <div className="contact-form-field">
                      <label>Your Name</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" required />
                    </div>
                    <div className="contact-form-field">
                      <label>Email Address</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@example.com" required />
                    </div>
                  </div>
                  <div className="contact-form-field">
                    <label>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="">Select a topic…</option>
                      <option>Technical Support</option>
                      <option>Feature Request</option>
                      <option>Billing Inquiry</option>
                      <option>General Question</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="contact-form-field">
                    <label>Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Describe your question or issue…" required />
                  </div>
                  <button type="submit" className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' }}>
                    <Send size={15} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <div className="logo-mark" style={{ width: 36, height: 36, fontSize: 13 }}>UM</div>
            <span className="home-footer-name">UniManage</span>
          </div>
          <div className="home-footer-links">
            <button className="home-footer-link" onClick={() => navigate('/')}>Home</button>
            <button className="home-footer-link" onClick={() => navigate('/about')}>About Us</button>
            <button className="home-footer-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          </div>
          <span style={{ fontSize: 12, opacity: 0.4 }}>© {new Date().getFullYear()} UniManage</span>
        </div>
      </footer>
    </div>
  );
}
