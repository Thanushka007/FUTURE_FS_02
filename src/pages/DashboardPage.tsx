import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Phone, Trophy, Calendar, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { Lead } from '../data/sampleData';

const quickActions = [
  { title: 'Add Lead', description: 'Create new lead entry', icon: UserPlus, path: '/add-lead', color: 'bg-blue-500' },
  { title: 'View Analytics', description: 'Check performance', icon: Target, color: 'bg-purple-500' },
];

const recentActivity = [
  { action: 'New lead added', lead: 'John Smith', time: '2 minutes ago', type: 'add' },
  { action: 'Lead contacted', lead: 'Sarah Johnson', time: '15 minutes ago', type: 'contact' },
  { action: 'Lead converted', lead: 'Michael Chen', time: '1 hour ago', type: 'convert' },
  { action: 'Follow-up scheduled', lead: 'Emily Davis', time: '3 hours ago', type: 'followup' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    converted: leads.filter((l) => l.status === 'Converted').length,
  };

  return (
    <div>
      <Navbar title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your leads today.
            </p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
            <Calendar className="w-24 h-24 text-white/20" />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Leads"
            value={stats.total}
            icon={Users}
            color="blue"
            delay={0.1}
          />
          <StatsCard
            title="New Leads"
            value={stats.new}
            icon={UserPlus}
            color="purple"
            delay={0.2}
          />
          <StatsCard
            title="Contacted"
            value={stats.contacted}
            icon={Phone}
            color="yellow"
            delay={0.3}
          />
          <StatsCard
            title="Converted"
            value={stats.converted}
            icon={Trophy}
            color="green"
            delay={0.4}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Leads</h3>
            <div className="space-y-4">
              {leads.slice(0, 5).map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {lead.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{lead.full_name}</p>
                      <p className="text-gray-400 text-sm">{lead.company_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'Converted'
                          ? 'bg-green-500/20 text-green-400'
                          : lead.status === 'New'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {lead.status}
                    </span>
                    <p className="text-gray-500 text-xs mt-1">{lead.lead_source}</p>
                  </div>
                </motion.div>
              ))}
              {leads.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No leads yet. Add your first lead to get started.
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.title}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all text-left"
                  >
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{action.title}</p>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'convert'
                          ? 'bg-green-500'
                          : activity.type === 'add'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <div>
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.lead} - {activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
