import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider 
} from "firebase/auth";
import { FaGoogle, FaGithub, FaFacebook, FaTwitter, FaYahoo, FaMicrosoft, FaGooglePlay } from 'react-icons/fa';
import './styles.css';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJrVrFp8OS0FI8AfzhABFj6Zq-bAQQ7ws",
  authDomain: "login-960e6.firebaseapp.com",
  databaseURL: "https://login-960e6-default-rtdb.firebaseio.com",
  projectId: "login-960e6",
  storageBucket: "login-960e6.firebasestorage.app",
  messagingSenderId: "986896206321",
  appId: "1:986896206321:web:73a51c1b0b982fae5f9c50",
  measurementId: "G-SG8TLVYEXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const providers = {
  google: new GoogleAuthProvider(),
  github: new GithubAuthProvider(),
  facebook: new FacebookAuthProvider(),
  twitter: new OAuthProvider('twitter.com'),
  yahoo: new OAuthProvider('yahoo.com'),
  microsoft: new OAuthProvider('microsoft.com'),
  playstore: new OAuthProvider('playstore'),
};

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { email, password } = data;

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get('https://login-960e6-default-rtdb.firebaseio.com/register.json');
      const users = response.data || {};

      const userExists = Object.values(users).find(
        (user) => user.email === email && user.password === password
      );

      if (userExists) {
        alert('Login successful');
        navigate('/dashboard');
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider) => {
    if (!providers[provider]) {
      alert("Unsupported provider!");
      return;
    }
    try {
      const result = await signInWithPopup(auth, providers[provider]);
      const user = result.user;

      await axios.post('https://login-960e6-default-rtdb.firebaseio.com/register.json', {
        uid: user.uid,
        fullname: user.displayName || "No Name Provided",
        email: user.email
      });

      alert(`Welcome, ${user.displayName || "User"}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during provider login:', error);
      alert('Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={submitHandler}>
        <h1 className="title">Login</h1>
        <input
          className="input-field"
          type="email"
          name="email"
          value={email}
          onChange={changeHandler}
          placeholder="Enter your email"
          required
        />
        <div className="password-wrapper">
          <input
            className="input-field"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={changeHandler}
            placeholder="Enter your password"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
        <div className="social-login">
          {[['google', FaGoogle], ['github', FaGithub], ['facebook', FaFacebook], ['twitter', FaTwitter], ['yahoo', FaYahoo], ['microsoft', FaMicrosoft], ['playstore', FaGooglePlay]].map(([provider, Icon]) => (
            <button key={provider} className="social-btn" onClick={() => handleProviderLogin(provider)}>
              <Icon className="icon" /> {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </button>
          ))}
        </div>
        <p className="register-link">
          Don't have an account? <Link to="/" className="link">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
