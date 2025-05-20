

import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Building2, PenLine, Trash2, Edit } from 'lucide-react';
import axios from 'axios';

// Define locally to avoid circular imports
interface TimelineEntry {
  _id: string;
  company: string;
  note: string;
  date: string;
}

// Direct API calls for debugging
const API_URL = 'http://localhost:5000/api/timeline';

const Timeline: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCompanyDeleteConfirm, setShowCompanyDeleteConfirm] = useState<string | null>(null);
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [newEntry, setNewEntry] = useState<Omit<TimelineEntry, '_id'>>({
    company: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Direct API call function to debug
  const fetchTimelineAPI = async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch`, { withCredentials: true });
      console.log('Raw API Response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Raw API Error:', error.response || error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTimelineEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        // Direct API call for debugging
        const rawResponse = await fetchTimelineAPI();
        //console.log('Raw timeline data:', rawResponse);
        
        // Check the actual structure of the response
        let entriesData: TimelineEntry[] = [];
        
        if (rawResponse && rawResponse.success === true && Array.isArray(rawResponse.data)) {
          entriesData = rawResponse.data;
        } else if (rawResponse && Array.isArray(rawResponse.data)) {
          entriesData = rawResponse.data;
        } else if (Array.isArray(rawResponse)) {
          entriesData = rawResponse;
        } else {
          console.error('Unexpected response structure:', rawResponse);
          setError('Invalid data structure received from server');
        }
        
        console.log('Parsed entries data:', entriesData);
        setEntries(entriesData);
        
        if (entriesData.length === 0) {
          console.log('No entries found, but request was successful');
        }
      } catch (error: any) {
        console.error('Complete error object:', error);
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Failed to fetch timeline entries. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineEntries();
  }, []);

  // Direct API call functions for other operations
  const addEntryAPI = async (entry: Omit<TimelineEntry, '_id'>) => {
    try {
      const response = await axios.post(`${API_URL}/add`, entry, { withCredentials: true });
      console.log('Raw add entry response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Raw add entry error:', error.response || error);
      throw error;
    }
  };

  const updateEntryAPI = async (id: string, entry: Partial<TimelineEntry>) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, entry, { withCredentials: true });
      console.log('Raw update entry response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Raw update entry error:', error.response || error);
      throw error;
    }
  };

  const deleteEntryAPI = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, { withCredentials: true });
      console.log('Raw delete entry response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Raw delete entry error:', error.response || error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const result = await addEntryAPI(newEntry);
      console.log('Add entry result:', result);
      
      let addedEntry: TimelineEntry;
      if (result && result.success && result.data) {
        addedEntry = result.data;
      } else if (result && result.data) {
        addedEntry = result.data;
      } else {
        // Create a temporary entry with generated ID as fallback
        addedEntry = {
          ...newEntry,
          _id: 'temp-' + new Date().getTime()
        };
      }
      
      setEntries(prev => [...prev, addedEntry]);
      setNewEntry({
        company: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Complete add entry error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to add entry. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (entry: TimelineEntry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    setSubmitLoading(true);
    try {
      const result = await updateEntryAPI(editingEntry._id, editingEntry);
      console.log('Update entry result:', result);

      let updatedEntry: TimelineEntry;
      if (result && result.success && result.data) {
        updatedEntry = result.data;
      } else if (result && result.data) {
        updatedEntry = result.data;
      } else {
        // Use the local edited entry as fallback, but ensure it's not null
        updatedEntry = editingEntry;
      }

      setEntries(entries.map(entry =>
        entry._id === updatedEntry._id ? updatedEntry : entry
      ));
      setIsEditModalOpen(false);
      setEditingEntry(null);
    } catch (error: any) {
      console.error('Complete update entry error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update entry. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntryAPI(id);
      setEntries(entries.filter(entry => entry._id !== id));
      setShowDeleteConfirm(null);
    } catch (error: any) {
      console.error('Complete delete entry error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to delete entry. Please try again.';
      setError(errorMessage);
    }
  };

  const handleDeleteCompany = async (company: string) => {
    setEntries(entries.filter(entry => entry.company !== company));
    setShowCompanyDeleteConfirm(null);
  };

  // Group entries by company first, then by date
  const groupedByCompany = entries.reduce((companies, entry) => {
    if (!companies[entry.company]) {
      companies[entry.company] = {};
    }
    if (!companies[entry.company][entry.date]) {
      companies[entry.company][entry.date] = [];
    }
    companies[entry.company][entry.date].push(entry);
    return companies;
  }, {} as Record<string, Record<string, TimelineEntry[]>>);

  // Sort companies alphabetically
  const sortedCompanies = Object.keys(groupedByCompany).sort();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Timeline</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Entry</span>
        </button>
      </div>



      {/* Error Message Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedCompanies.length === 0 ? (
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 text-center">
          <p className="text-gray-400">No timeline entries yet. Create one to get started!</p>
        </div>
      ) : (
        /* Company Timeline Threads */
        <div className="space-y-12">
          {sortedCompanies.map((company) => {
            // Sort dates in descending order for each company
            const sortedDates = Object.keys(groupedByCompany[company]).sort((a, b) =>
              new Date(b).getTime() - new Date(a).getTime()
            );

            return (
              <div key={company} className="relative bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                {/* Company Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{company}</h2>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowCompanyDeleteConfirm(company)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700/50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Company Delete Confirmation */}
                    {showCompanyDeleteConfirm === company && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 z-10">
                        <p className="text-white mb-3">Delete all entries for {company}?</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setShowCompanyDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Timeline */}
                <div className="ml-6 space-y-8">
                  {sortedDates.map((date) => (
                    <div key={date} className="relative">
                      {/* Date Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>
                      </div>

                      {/* Date Entries */}
                      <div className="ml-4 space-y-3 border-l-2 border-gray-700 pl-6">
                        {groupedByCompany[company][date].map((entry) => (
                          <div
                            key={entry._id}
                            className="bg-gray-800 rounded-lg p-4 relative before:absolute before:left-[-1.85rem] before:top-6 before:w-4 before:h-[2px] before:bg-gray-700"
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-gray-200 flex-1">{entry.note}</p>
                              <div className="flex items-center space-x-2 ml-4">
                                <button
                                  onClick={() => handleEdit(entry)}
                                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors rounded hover:bg-gray-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(entry._id)}
                                  className="p-1 text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-gray-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Delete Confirmation */}
                            {showDeleteConfirm === entry._id && (
                              <div className="mt-2 p-3 bg-gray-800 rounded-lg border border-gray-600">
                                <p className="text-white text-sm mb-2">Delete this note?</p>
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleDelete(entry._id)}
                                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm  z-50 ">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">New Timeline Entry</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={newEntry.company}
                    onChange={(e) => setNewEntry({ ...newEntry, company: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Note</label>
                <div className="relative">
                  <PenLine className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={newEntry.note}
                    onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                    placeholder="Enter your note"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center justify-center"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  ) : (
                    'Create Entry'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Edit Timeline Entry</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingEntry(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={editingEntry.company}
                    onChange={(e) => setEditingEntry({ ...editingEntry, company: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Note</label>
                <div className="relative">
                  <PenLine className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={editingEntry.note}
                    onChange={(e) => setEditingEntry({ ...editingEntry, note: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                    placeholder="Enter your note"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={editingEntry.date}
                    onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center justify-center"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;