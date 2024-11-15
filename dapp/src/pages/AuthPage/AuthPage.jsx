import React, { useEffect } from 'react';
import { useWalletContext } from '../../context/WalletContext'; // Import the WalletContext hook
import './AuthPage.css';
import coinbaseSvg from "../../assets/coinbase.svg";
import metamaskSvg from "../../assets/metamask.svg";
import emailSvg from "../../assets/email.svg";
import loginBg from "../../assets/login.mp4";
import logoGif from "../../assets/taskmate.gif";

const Auth = () => {
  const { account, isLoading, error, connectWallet, disconnectWallet } = useWalletContext();

  useEffect(() => {
    if (account) {
      // Optionally, perform any additional actions when the user is already connected
      console.log(`Connected as: ${account}`);
    }
  }, [account]);

  return (
    <div className="auth-container">
      <video autoPlay loop muted className="background-video">
        <source src={loginBg} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      
      <div className="login-box">
        <div className="title-box">
          <h1>Connect to Taskmate</h1>
          <p>Choose your preferred login method</p>
        </div>

        <div className="task-mate-anim">
          <img src={logoGif} alt="taskMate" />
        </div>

        {error && <div className="error-message">{error}</div>}

        {account ? (
          <div className="account-info">
            <p>Connected as: {account}</p>
            <button className="auth-button" onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        ) : (
          <div className="buttons-box">
            <button
              className="auth-button metamask"
              onClick={() => connectWallet()}
              disabled={isLoading}
            >
              <img src={metamaskSvg} alt="MetaMask" className="icon" />
              Log in with MetaMask
            </button>
            <button
              className="auth-button coinbase"
              onClick={() => connectWallet()}
              disabled={isLoading}
            >
              <img src={coinbaseSvg} alt="Coinbase" className="icon" />
              Log in with Coinbase
            </button>
            <button
              className="auth-button email"
              disabled={isLoading}
            >
              <img src={emailSvg} alt="Email" className="icon" />
              Continue with Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;