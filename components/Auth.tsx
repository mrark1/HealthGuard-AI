
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Auth: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'verify_pending' | 'two_factor'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, signup, resetPassword, verify2FA } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 6) strength += 20;
    if (password.length > 10) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  }, [password]);

  const strengthColor = passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 80 ? 'bg-amber-500' : 'bg-emerald-500';
  const strengthLabel = passwordStrength < 40 ? 'Weak' : passwordStrength < 80 ? 'Medium' : 'Strong';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (view === 'login') {
        const result = await login(email, password, rememberMe);
        if (result.success) {
          if (result.requires2FA) setView('two_factor');
          else navigate('/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      } else if (view === 'signup') {
        const ok = await signup(name, email, password);
        if (ok) {
          setView('verify_pending');
        } else {
          setError('User with this email already exists');
        }
      } else if (view === 'forgot') {
        const ok = await resetPassword(email, password);
        if (ok) {
          setSuccess('Password reset successfully! You can now login.');
          setTimeout(() => setView('login'), 2000);
        } else {
          setError('Email not found');
        }
      } else if (view === 'two_factor') {
        const ok = await verify2FA(email, twoFACode);
        if (ok) navigate('/dashboard');
        else setError('Invalid 2FA code. Try 123456');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-8 text-center text-white">
          <div className="text-4xl mb-2">🛡️</div>
          <h2 className="text-2xl font-bold">
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join HealthGuard' : view === 'forgot' ? 'Reset Password' : view === 'two_factor' ? 'Security Check' : 'Verify Email'}
          </h2>
          <p className="text-emerald-100 text-sm mt-2">
            {view === 'login' ? 'Access your personalized health dashboard' : view === 'signup' ? 'Start your journey towards better health awareness' : view === 'two_factor' ? 'Enter the 6-digit code sent to your device' : 'Confirm your identity to proceed'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 text-center animate-shake">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm border border-emerald-100 text-center">{success}</div>}
          
          {view === 'verify_pending' ? (
            <div className="text-center space-y-6 py-4">
              <div className="text-6xl animate-bounce">📧</div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Check Your Inbox</h3>
                <p className="text-slate-500 text-sm">We've sent a verification link to <span className="font-bold text-slate-700">{email}</span>.</p>
              </div>
              
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <p className="text-xs text-slate-400 italic">In this demo, you can simulate clicking the email link below:</p>
                <Link 
                  to={`/verify/${encodeURIComponent(email)}`}
                  className="block w-full bg-emerald-50 text-emerald-700 py-4 rounded-xl text-sm font-bold border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center justify-center"
                >
                  <span className="mr-2">🔗</span> Open Verification Link
                </Link>
                <button 
                  type="button" 
                  onClick={() => setView('signup')}
                  className="text-slate-400 text-xs hover:text-emerald-600 font-medium"
                >
                  Entered wrong email? Go back
                </button>
              </div>
            </div>
          ) : view === 'two_factor' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Authentication Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-2xl tracking-widest font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="000000"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-2 text-center italic">Tip: Use code 123456 for demo</p>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition-all">
                Verify & Login
              </button>
            </div>
          ) : (
            <>
              {view === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="health@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{view === 'forgot' ? 'New Password' : 'Password'}</label>
                <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                
                {(view === 'signup' || view === 'forgot') && password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                      <span>Strength: {strengthLabel}</span>
                      <span>{passwordStrength}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`${strengthColor} h-full transition-all duration-300`} style={{ width: `${passwordStrength}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {view === 'login' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-500 font-medium">Remember me</label>
                </div>
              )}

              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 transform hover:-translate-y-0.5">
                {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Reset My Password'}
              </button>
            </>
          )}

          <div className="flex flex-col space-y-3 text-center pt-4">
            {view === 'login' && (
              <button type="button" onClick={() => setView('forgot')} className="text-slate-400 text-xs hover:text-emerald-600 font-medium">Forgot Password?</button>
            )}
            
            <button
              type="button"
              onClick={() => {
                setError('');
                setSuccess('');
                if (view === 'two_factor') setView('login');
                else setView(view === 'login' ? 'signup' : 'login');
              }}
              className="text-emerald-600 text-sm font-semibold hover:underline"
            >
              {view === 'login' ? "Don't have an account? Sign Up" : view === 'two_factor' ? 'Cancel 2FA Verification' : 'Back to Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
