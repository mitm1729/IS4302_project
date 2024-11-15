import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import videoSrc from '../../assets/house_sitting.mp4';

const LandingPage = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const navigate = useNavigate();

  const handleScroll = (event) => {
    const deltaY = event.deltaY;
    const zoomChange = deltaY > 0 ? 0.1 : -0.1;

    setZoomLevel((prevZoomLevel) => {
      const newZoomLevel = Math.min(Math.max(prevZoomLevel + zoomChange, 1), 3);

      if (newZoomLevel === 3) {
        setTimeout(() => navigate('/auth'), 500); 
      }

      return newZoomLevel;
    });
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  return (
    <div
      className="landing-page"
      style={{
        transform: `scale(${zoomLevel})`,
        opacity: zoomLevel === 1 ? 1 : 1 - (zoomLevel - 1) / 2,
      }}
    >
      <video autoPlay loop muted className="background-video">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="banner">
        <h1 className="banner-title">TaskMate</h1>
        <p className="banner-description">Find trusted house sitters. Scroll to explore.</p>
      </div>

      <footer className="footer">
      <div className="footer">
          <span>TaskMate | © 2024 YourCompany </span>

          <span className="credits">
            Credits:
            <a
              href="https://www.freepik.com/free-video/woman-with-keys-new-house_2808915#fromView=search&page=1&position=31&uuid=1ee69492-c0dc-43ee-905b-b3a567762a0f"
              target="_blank"
              rel="noopener noreferrer"
            >
              Freepik
            </a>
            <span>|</span>
            <a href="https://iconscout.com/icons/metamask" target="_blank">
              MetaMask
            </a>
            <span>|</span>
            <a href="https://iconscout.com/contributors/icon-mafia" target="_blank">
              Icon Mafia
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;