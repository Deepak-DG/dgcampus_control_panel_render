'use client';

import { loginSuperUser } from '@/app/lib/Auth/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginSuperUser(mobile, password);
      setMessage('Login successful!');
      console.log(data);
      // Save tokens and redirect to dashboard
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      router.push('/dashboard');
    } catch (error) {
      setMessage('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-red-500">{message}</p>
    </div>
  );
};

export default LoginForm;
