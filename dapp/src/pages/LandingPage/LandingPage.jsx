import React from 'react';
import './LandingPage.css';
import keygif from "../../assets/key.gif";
import { motion } from 'framer-motion';
import { Home, Shield, Globe, Clock, Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '../../components/ContactForm/ContactForm';
import HeroSection from '../../components/HeroSection/HeroSection';

const LandingPage = () => {
  

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <h1>TaskMate</h1>
        </div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="/auth">Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <HeroSection></HeroSection>

      {/* Features Section */}
      <section id="features" className="features">
  <motion.div
    className="feature"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <Shield size={48} className="feature-icon" />
    <h3>Verified Sitters</h3>
    <p>Every sitter is vetted and reviewed to ensure the highest level of trust.</p>
  </motion.div>
  <motion.div
    className="feature"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <Clock size={48} className="feature-icon" />
    <h3>24/7 Support</h3>
    <p>Get assistance whenever you need it with our around-the-clock service.</p>
  </motion.div>
  <motion.div
    className="feature"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
  >
    <Globe size={48} className="feature-icon" />
    <h3>Global Coverage</h3>
    <p>Connect with sitters across the globe for seamless solutions.</p>
  </motion.div>
</section>

      {/* About Section */}
      <section id="about" className="about">
        <h1>About Us</h1>
        <div className="about-content">
          <img
            src={keygif}
            alt="About us"
            className="about-image"
          />
          <div className="about-text">
            <p>
              TaskMate was founded with a simple mission: to connect homeowners with reliable house sitters. 
              Whether you’re traveling for business or pleasure, our platform ensures peace of mind while 
              you’re away from home.
            </p>
            <p>
              We’ve built a trusted community of sitters and homeowners by prioritizing security, transparency, 
              and convenience. Join thousands of satisfied customers who have experienced the TaskMate difference.
            </p>
          </div>
        </div>
      </section>
      <ContactForm></ContactForm>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 TaskMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;