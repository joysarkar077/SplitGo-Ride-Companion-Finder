"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Assuming you're using NextAuth for session management

interface User {
  id: number; // Updated from user_id to id
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

const UserProfile = () => {
  const { data: session } = useSession(); // Getting session data (which contains the user)
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session && session.user) {
        const res = await fetch(`/api/profile?user_id=${session.user.id}`);
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          setFormData({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            address: data.user.address || "",
          });
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (update profile)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (session && session.user) {
      const res = await fetch(`/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.user.id, // Using session.user.id instead of router query
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        alert("Profile updated successfully.");
        window.location.reload(); // Reload page to reflect changes
      } else {
        alert(data.message || "Error updating profile.");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div>
          {!isEditing ? (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
              <p><strong>Address:</strong> {user.address || "N/A"}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
