// src/Login.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [pass, setPass] = useState('');
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(pass !== import.meta.env.VITE_PASSWORD) return;
        try {
            await axios.get('/api/v1/users', {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true
            });
        } catch (err) {
            console.log(err);
        } finally {
            nav('/');
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Samaira Fashion</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border rounded bg-gray-50"
              value={pass}
              onChange={(e) => setPass(e.currentTarget.value)}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
