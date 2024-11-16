import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import "./HeroSection.css";
import heroimg from "../../assets/taskmate.gif";

const HeroSection = () => {
  const navigate = useNavigate();

  const generateGlobePoints = (count) => {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    const radius = 50; // Globe radius in viewport percentage

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      // Convert 3D coordinates to screen position
      const scale = (z + 2) / 3; // Transform z coordinate to scale (0.33 to 1)
      const screenX = x * radius * scale + 50;
      const screenY = y * radius * scale + 50;

      points.push({
        x: screenX,
        y: screenY,
        scale,
        z: z * radius, // Store z for depth sorting
      });
    }

    // Sort points by z-index for proper overlay
    return points.sort((a, b) => a.z - b.z);
  };

  const points = generateGlobePoints(7);

  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 2 }}
      transition={{ duration: 3 }}
    >
      <div className="globe-container">
        <div className="globe">
          {/* Earth base sphere */}
          <div className="earth-sphere"/>
          <div className="land-pattern"/>
          <div className="earth-gloss"/>
          
          {/* Render points */}
          {points.map((point, index) => (
            <motion.div
              key={index}
              className="bubble-point"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.9 * point.scale,
                scale: 2 + point.scale * 1.2,
              }}
              transition={{
                duration: 2,
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 2,
              }}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                zIndex: Math.floor(point.z + 100),
              }}
            >
              <div className="bubble-inner">
                <img src={heroimg} alt="" />
                </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="hero-content">
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Find Trusted House Sitters
        </motion.h1>
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Secure your home while you're away. Trusted sitters, anytime, anywhere.
        </motion.p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/auth")}
        >
          Get Started
        </motion.button>
      </div>
    </motion.section>
  );
};

export default HeroSection;