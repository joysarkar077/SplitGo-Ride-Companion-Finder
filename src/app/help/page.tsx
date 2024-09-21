"use client"
import React, { useState } from 'react';

const HelpPage = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    request_id: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Submit complaint to server
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Complaint submitted successfully!');
        setFormData({
          user_id: '',
          request_id: '',
          description: '',
        });
      } else {
        alert('Failed to submit the complaint.');
      }
    } catch (error) {
      console.error('Error submitting the complaint:', error);
      alert('An error occurred while submitting the complaint.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Help Center</h1>

      <p className="text-lg text-gray-700 mb-4 max-w-2xl text-center">
        If you have any complaints or issues during your rides, feel free to let
        us know. We&apos;re here to help you!
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Submit a Complaint
        </h2>

        <div>
          <label className="block text-gray-700">User ID:</label>
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Request ID:</label>
          <input
            type="text"
            name="request_id"
            value={formData.request_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Complaint Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default HelpPage;
