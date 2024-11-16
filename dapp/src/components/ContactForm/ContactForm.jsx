// ContactForm.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-header">
        <h2>Get in Touch</h2>
        <p>Have questions? We'd love to hear from you.</p>
      </div>
      
      <div className="contact-container">
        <motion.div 
          className="contact-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="contact-form">
            <h3>Contact Us</h3>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              />
            </div>
            <motion.button
              type="submit"
              className="submit-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
              <Send size={18} className="send-icon" />
            </motion.button>
            
            {status === 'success' && (
              <motion.div
                className="status-message success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Message sent successfully!
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div
                className="status-message error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Failed to send message. Please try again.
              </motion.div>
            )}
          </form>
        </motion.div>

        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="info-card">
            <h3>Contact Information</h3>
            <div className="info-items">
              <motion.div 
                className="contact-item"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="icon" />
                <div>
                  <h4>Email</h4>
                  <p>support@taskmate.com</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-item"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+1-800-123-4567</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="contact-item"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="icon" />
                <div>
                  <h4>Address</h4>
                  <p>123 TaskMate Lane<br />San Francisco, CA 94105</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;