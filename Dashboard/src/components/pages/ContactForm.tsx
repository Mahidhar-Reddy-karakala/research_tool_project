import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Contact form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Contact Us</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20"
            placeholder="What's this about?"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400/20 min-h-[150px]"
            placeholder="Your message..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Send className="w-5 h-5" />
          <span>Send Message</span>
        </button>
      </form>
    </div>
  );
};

export default ContactForm;