import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import LeadTable from '../components/LeadTable';
import LeadForm from '../components/LeadForm';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { Lead, leadSources, statusOptions } from '../data/sampleData';

export default function LeadsManagementPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

  const handleEditLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    if (!editingLead) return;

    const { error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', editingLead.id);

    if (!error) {
      setEditingLead(null);
      fetchLeads();
    }
  };

  const handleDeleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchLeads();
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSource = !sourceFilter || lead.lead_source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setSourceFilter('');
  };

  return (
    <div>
      <Navbar title="Lead Management" />

      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search leads by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1e293b]/80 backdrop-blur-xl border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              showFilters || statusFilter || sourceFilter
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-[#1e293b]/80 border-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {(statusFilter || sourceFilter) && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {[statusFilter, sourceFilter].filter(Boolean).length}
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* Filter Dropdowns */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col md:flex-row gap-4 overflow-hidden"
            >
              <div className="relative flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1e293b]/80 border border-gray-700/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative flex-1">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1e293b]/80 border border-gray-700/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  {leadSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {(statusFilter || sourceFilter) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-700/50 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lead Table - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LeadTable
            leads={filteredLeads}
            onView={(lead) => setSelectedLead(lead)}
            onEdit={(lead) => setEditingLead(lead)}
            onDelete={handleDeleteLead}
          />
        </motion.div>

        {/* View Modal */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLead(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1e293b] rounded-2xl border border-gray-700/50 p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Lead Details</h3>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl text-white font-bold">
                        {selectedLead.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">{selectedLead.full_name}</p>
                      <p className="text-gray-400">{selectedLead.company_name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{selectedLead.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white">{selectedLead.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Source</p>
                      <p className="text-white">{selectedLead.lead_source}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                        {selectedLead.status}
                      </span>
                    </div>
                  </div>

                  {selectedLead.notes && (
                    <div className="pt-4 border-t border-gray-700/50">
                      <p className="text-gray-400 text-sm mb-2">Notes</p>
                      <p className="text-white">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingLead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setEditingLead(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                <LeadForm
                  initialData={editingLead}
                  onSubmit={handleEditLead}
                  onCancel={() => setEditingLead(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
