import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/auth/forgot-password', { email });
      setMessage('Password reset email sent');
    } catch (err) {
      setError('Failed to send password reset email');
    }
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleForgotPassword}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
