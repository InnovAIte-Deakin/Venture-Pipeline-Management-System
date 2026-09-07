"use client";

import { useState, useEffect } from "react";
import { Save, Shield, Loader2 } from "lucide-react";

export default function SystemSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/backend/api/users", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.user) {
          setFormData((prev) => ({
            ...prev,
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/backend/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Profile updated successfully",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update profile",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setChangingPassword(true);
    setPasswordMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      setChangingPassword(false);
      return;
    }

    try {
      const res = await fetch("/backend/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMessage({
          type: "success",
          text: data.message || "Password changed successfully",
        });
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setPasswordMessage({
          type: "error",
          text: data.message || "Failed to change password",
        });
      }
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: "An error occurred while changing password",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and password</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-8">
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Card */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Profile Information
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Update your personal details.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"}`}
                >
                  {message.text}
                </div>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          {/* Password & Security Card */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Password & Security
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your account security settings.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                />
              </div>

              {passwordMessage && (
                <div
                  className={`p-3 rounded-lg text-sm ${passwordMessage.type === "success" ? "bg-success/10 text-success" : "bg-secondary/10 text-secondary"}`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {changingPassword ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
