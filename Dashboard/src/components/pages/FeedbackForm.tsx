import React, { useState } from 'react';
import { Send } from 'lucide-react';

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState({
    rating: '',
    category: '',
    feedback: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Feedback submitted:', formData);
    // Reset form
    setFormData({ rating: '', category: '', feedback: '' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Feedback</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Rating</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
            required
          >
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Star{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
            required
          >
            <option value="">Select a category</option>
            <option value="ui">User Interface</option>
            <option value="performance">Performance</option>
            <option value="features">Features</option>
            <option value="bugs">Bug Report</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Your Feedback</label>
          <textarea
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20 min-h-[150px]"
            placeholder="Please share your thoughts..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Send className="w-5 h-5" />
          <span>Submit Feedback</span>
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;