import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate         = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    const error  = params.get('error');

    if (error) {
      navigate('/?error=' + error);
      return;
    }

    if (token) {
      loginWithToken(token).then(() => {
        const onboardingDone = localStorage.getItem('onboardingDone');
        navigate(onboardingDone ? '/dashboard' : '/onboarding');
      });
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}