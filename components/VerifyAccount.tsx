
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyAccount: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const { verifyAccount } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const activate = async () => {
      if (email) {
        // Simulate a slight delay for the "processing" feel
        await new Promise(resolve => setTimeout(resolve, 1500));
        const ok = await verifyAccount(decodeURIComponent(email));
        if (ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      }
    };
    activate();
  }, [email, verifyAccount]);

  return (
    <div className="max-w-md mx-auto mt-20 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        {status === 'loading' && (
          <div className="space-y-6">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-bold text-slate-800">Verifying Your Account</h2>
            <p className="text-slate-500">Please wait while we confirm your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-slate-800">Email Verified!</h2>
            <p className="text-slate-500">Your account is now active. You can proceed to login and access your health dashboard.</p>
            <Link 
              to="/auth" 
              className="block w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-slate-500">We couldn't verify this email address. The link may be expired or invalid.</p>
            <Link 
              to="/auth" 
              className="block w-full bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Back to Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;
