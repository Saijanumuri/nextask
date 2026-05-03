import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, User, Calendar, Copy, Check } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export const AuthScreen = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [passkey, setPasskey] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [generatedPasskey, setGeneratedPasskey] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { login, register } = useAuthStore();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (passkey.length !== 6) {
      setError('Passkey must be 6 digits');
      return;
    }
    
    const success = await login(passkey);
    
    if (!success) {
      setError('Invalid passkey. Please try again.');
      setPasskey('');
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!dob) {
      setError('Please enter your date of birth');
      return;
    }
    
    const newPasskey = await register(name.trim(), dob);
    setGeneratedPasskey(newPasskey);
  };
  
  const copyPasskey = () => {
    navigator.clipboard.writeText(generatedPasskey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const resetRegistration = () => {
    setGeneratedPasskey('');
    setName('');
    setDob('');
    setMode('login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080a0f]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent mb-4"
          >
            NexTask
          </motion.h1>
          <p className="text-white/60 text-sm md:text-base">Hi-Tech Productivity App</p>
        </div>
        
        <AnimatePresence mode="wait">
          {generatedPasskey ? (
            <motion.div
              key="passkey-display"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6 md:p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Account Created!</h2>
                <p className="text-white/60 text-sm md:text-base">Save your passkey to login</p>
              </div>
              
              <div className="bg-black/30 rounded-xl p-4 md:p-6 mb-6">
                <p className="text-white/60 text-xs md:text-sm mb-2 text-center">Your Passkey</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-['JetBrains_Mono'] text-3xl md:text-4xl font-bold text-cyan-400 tracking-wider">
                    {generatedPasskey}
                  </span>
                  <button
                    onClick={copyPasskey}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Copy passkey"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/60" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                <p className="text-amber-400 text-xs md:text-sm">
                  ⚠️ <strong>Important:</strong> Save this passkey! You'll need it to login. There's no way to recover it if lost.
                </p>
              </div>
              
              <button
                onClick={resetRegistration}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm md:text-base"
              >
                Continue to Login
              </button>
            </motion.div>
          ) : mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Welcome Back</h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Enter Your Passkey
                  </label>
                  <input
                    type="text"
                    value={passkey}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPasskey(value);
                      setError('');
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors font-['JetBrains_Mono'] text-2xl text-center tracking-widest"
                    autoFocus
                  />
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  Login
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm mb-2">Don't have an account?</p>
                <button
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setPasskey('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-sm md:text-base"
                >
                  Create New Account
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/4 backdrop-blur-md border border-white/8 rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Create Account</h2>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors text-sm md:text-base"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      setError('');
                    }}
                    className="w-full px-4 py-3 bg-white/4 border border-white/8 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors text-sm md:text-base"
                  />
                </div>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-3 md:p-4">
                  <p className="text-cyan-400 text-xs md:text-sm">
                    ℹ️ You'll receive a unique 6-digit passkey after registration. Save it to login!
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  Create Account
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm mb-2">Already have an account?</p>
                <button
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setName('');
                    setDob('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-sm md:text-base"
                >
                  Login with Passkey
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-center text-white/40 text-xs mt-6">
          Your data is stored locally and encrypted
        </p>
      </motion.div>
    </div>
  );
};
