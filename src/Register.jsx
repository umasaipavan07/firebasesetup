import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  updateProfile 
} from "firebase/auth";
import { FaGoogle, FaGithub, FaFacebook, FaTwitter, FaYahoo, FaMicrosoft, FaGooglePlay } from 'react-icons/fa';
import './AuthStyles.css'; // Import external CSS

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

const Register = () => {
  const [data, setData] = useState({ fullname: "", email: "", password: "", confirmpassword: "" });
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmpassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.fullname });
      await axios.post('https://login-960e6-default-rtdb.firebaseio.com/register.json', {
        uid: userCredential.user.uid,
        fullname: data.fullname,
        email: data.email
      });
      alert('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  const handleProviderLogin = async (provider) => {
    if (!providers[provider]) {
      alert("Unsupported provider!");
      return;
    }
    try {
      const result = await signInWithPopup(auth, providers[provider]);
      await axios.post('https://login-960e6-default-rtdb.firebaseio.com/register.json', {
        uid: result.user.uid,
        fullname: result.user.displayName || "No Name Provided",
        email: result.user.email
      });
      alert(`Welcome, ${result.user.displayName || "User"}!`);
      navigate('/dashboard');
    } catch (error) {
      alert("Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submitHandler}>
        <h1 className="auth-title">Create an Account</h1>
        <input className="auth-input" type="text" name="fullname" placeholder="Full Name" onChange={changeHandler} required />
        <input className="auth-input" type="email" name="email" placeholder="Email" onChange={changeHandler} required />
        <input className="auth-input" type="password" name="password" placeholder="Password" onChange={changeHandler} required />
        <input className="auth-input" type="password" name="confirmpassword" placeholder="Confirm Password" onChange={changeHandler} required />
        <button className="auth-btn" type="submit">Sign Up</button>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <div className="social-auth">
        {[['google', FaGoogle], ['github', FaGithub], ['microsoft', FaMicrosoft], ['facebook', FaFacebook]].map(([provider, Icon]) => (
          <button key={provider} className="social-btn" onClick={() => handleProviderLogin(provider)}>
            <Icon className="social-icon" /> Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </button>
        ))}
      </div>

      <p className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
