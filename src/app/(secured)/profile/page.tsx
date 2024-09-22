"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Assuming you're using NextAuth for session management
import bcrypt from 'bcryptjs';

interface User {
  id: number;
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
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false); // For toggling old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // For toggling new password visibility

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

  // Handle input change for profile form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle input change for password form
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
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
          user_id: session.user.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setMessage("Profile updated successfully.");
        window.setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
      } else {
        setMessage(data.message || "Error updating profile.");
      }
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hashing new password with bcryptjs
    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);

    const res = await fetch(`/api/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: session?.user?.id,
        oldPassword: passwordData.oldPassword, // Validation should be done in the backend
        newPassword: hashedPassword,
      }),
    });
    
    const data = await res.json();
    if (data.success) {
      setIsPasswordChanging(false);
      setMessage("Password changed successfully.");
    } else {
      setMessage(data.message || "Error changing password.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Side Panel with toggle button */}
      <aside className={`${sidePanelOpen ? 'w-64' : 'w-16'} bg-gray-800 text-white p-4 transition-all duration-300`}>
        <button
          className="text-gray-400 focus:outline-none"
          onClick={() => setSidePanelOpen(!sidePanelOpen)}
        >
          {sidePanelOpen ? '<<' : '>>'}
        </button>
        {sidePanelOpen && (
          <ul className="mt-4">
            <li
              className="mb-2 cursor-pointer hover:text-blue-400"
              onClick={() => setIsEditing(false)}
            >
              Profile
            </li>
            <li
              className="mb-2 cursor-pointer hover:text-blue-400"
              onClick={() => setIsPasswordChanging(true)}
            >
              Security
            </li>
          </ul>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          {isPasswordChanging ? "Change Password" : "User Profile"}
        </h1>

        {/* Message */}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        {!user ? (
          <p>Loading...</p>
        ) : isPasswordChanging ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-gray-700">Old Password:</label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded"
                required
              />
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={showOldPassword}
                    onChange={() => setShowOldPassword(!showOldPassword)}
                  />
                  <span className="ml-2">Show Old Password</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-gray-700">New Password:</label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded"
                required
              />
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={showNewPassword}
                    onChange={() => setShowNewPassword(!showNewPassword)}
                  />
                  <span className="ml-2">Show New Password</span>
                </label>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Password
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setIsPasswordChanging(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-lg">
            {!isEditing ? (
              <div>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {user.address || "N/A"}
                </p>
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
    </div>
  );
};

export default UserProfile;
