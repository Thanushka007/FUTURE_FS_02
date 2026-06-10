import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, UserCircle, TrendingUp, Users, BarChart3, FileText, User, Phone, Building, Globe, FileText as FileTextIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { leadSources } from '../data/sampleData';

const featureCards = [
  { icon: Users, title: 'Lead Tracking', description: 'Track and manage all your leads in one place' },
  { icon: TrendingUp, title: 'Status Updates', description: 'Monitor lead progress through your pipeline' },
  { icon: FileText, title: 'Follow-Up Notes', description: 'Never miss important follow-up details' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Gain insights with powerful analytics' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    lead_source: 'Website',
    notes: '',
  });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/add-lead', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      const { error: signUpError } = await signUp(email, password);

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Account created! You can now sign in.');
      setIsSignUp(false);
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
      return;
    }

    navigate('/add-lead');
  };

  const validateLead = () => {
    const errs: Record<string, string> = {};
    if (!leadForm.full_name.trim()) errs.full_name = 'Full name is required';
    if (!leadForm.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email)) errs.email = 'Invalid email';
    if (!leadForm.phone.trim()) errs.phone = 'Phone is required';
    if (!leadForm.company_name.trim()) errs.company_name = 'Company name is required';
    setLeadErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLeadChange = (field: string, value: string) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
    if (leadErrors[field]) setLeadErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLead()) return;
    setLeadSubmitting(true);

    const { error } = await supabase.from('leads').insert([
      {
        ...leadForm,
        status: 'New',
        user_id: null,
      },
    ]);

    setLeadSubmitting(false);

    if (!error) {
      setLeadSuccess(true);
      setLeadForm({ full_name: '', email: '', phone: '', company_name: '', lead_source: 'Website', notes: '' });
      setTimeout(() => setLeadSuccess(false), 4000);
    } else {
      setLeadErrors({ submit: 'Failed to submit lead. Please try again.' });
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-3 bg-gray-800/50 border ${
      leadErrors[field] ? 'border-red-500' : 'border-gray-700'
    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`;

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-10 flex-col justify-between">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 blur-3xl"
          />
        </div>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CRM Pro</span>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl font-bold text-white mb-4">Client Lead Management System</h1>
            <p className="text-xl text-gray-400">Manage leads, track conversions, and grow your business efficiently.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="p-5 rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all group"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-500 text-sm">Powered by Modern Technology</div>
      </div>

      {/* Right Side - Auth + Lead Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-5xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <UserCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CRM Pro</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Auth Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1e293b]/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 lg:p-8 shadow-2xl"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="text-gray-400 text-sm">
                  {isSignUp ? 'Sign up to start managing your leads' : 'Sign in to your account to continue'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-400">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
                    >
                      {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isSignUp ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </motion.button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-700/50 text-center">
                <p className="text-gray-400 text-sm mb-3">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
                <p className="text-gray-500 text-xs">Demo: First-time users need to sign up with any email/password</p>
              </div>
            </motion.div>

            {/* Lead Capture Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[#1e293b]/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 lg:p-8 shadow-2xl"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Submit Your Lead</h2>
                <p className="text-gray-400 text-sm">Interested in our services? Send us your details and we will get back to you.</p>
              </div>

              <AnimatePresence>
                {leadSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-green-400 text-sm">Lead submitted successfully! We will contact you soon.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={leadForm.full_name}
                      onChange={(e) => handleLeadChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                      className={inputClass('full_name')}
                    />
                  </div>
                  {leadErrors.full_name && <p className="text-red-400 text-xs mt-1">{leadErrors.full_name}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => handleLeadChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className={inputClass('email')}
                    />
                  </div>
                  {leadErrors.email && <p className="text-red-400 text-xs mt-1">{leadErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) => handleLeadChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className={inputClass('phone')}
                    />
                  </div>
                  {leadErrors.phone && <p className="text-red-400 text-xs mt-1">{leadErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={leadForm.company_name}
                      onChange={(e) => handleLeadChange('company_name', e.target.value)}
                      placeholder="Enter your company name"
                      className={inputClass('company_name')}
                    />
                  </div>
                  {leadErrors.company_name && <p className="text-red-400 text-xs mt-1">{leadErrors.company_name}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Lead Source</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <select
                      value={leadForm.lead_source}
                      onChange={(e) => handleLeadChange('lead_source', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {leadSources.map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Notes</label>
                  <div className="relative">
                    <FileTextIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <textarea
                      value={leadForm.notes}
                      onChange={(e) => handleLeadChange('notes', e.target.value)}
                      placeholder="Any additional information..."
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {leadErrors.submit && <p className="text-red-400 text-sm">{leadErrors.submit}</p>}

                <motion.button
                  type="submit"
                  disabled={leadSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                >
                  {leadSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                  {leadSubmitting ? 'Submitting...' : 'Submit Lead'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
