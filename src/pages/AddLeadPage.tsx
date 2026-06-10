import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import LeadForm from '../components/LeadForm';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { Lead } from '../data/sampleData';

export default function AddLeadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    if (!user) {
      setError('You must be logged in to add a lead');
      return;
    }

    setError(null);
    setIsLoading(true);

    const { error: insertError } = await supabase
      .from('leads')
      .insert([{ ...leadData, user_id: user.id }]);

    setIsLoading(false);

    if (insertError) {
      setError(insertError.message || 'Failed to add lead. Please try again.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/leads');
    }, 1000);
  };

  return (
    <div>
      <Navbar title="Add New Lead" />

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Create New Lead</h1>
            <p className="text-gray-400">
              Fill in the details below to add a new lead to your pipeline.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-xl"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400">Lead added successfully! Redirecting...</p>
            </motion.div>
          )}

          <LeadForm
            onSubmit={handleAddLead}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}
