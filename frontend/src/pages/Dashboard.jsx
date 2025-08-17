import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { LogOut, User, Mail, Calendar, Shield, Github, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ApiService from "../services/api.js";

const Dashboard = () => {
  const { user, logout, isAuthenticated, refreshUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [githubVerifying, setGithubVerifying] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubVerification = async () => {
    setGithubVerifying(true);
    try {
      // Check if user already has GitHub linked
      const hasGithub = user.oauthAccounts?.some(account => account.provider === 'github');

      if (!hasGithub) {
        // Redirect to GitHub OAuth
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
        return;
      }

      // If GitHub is already linked, just verify it
      const response = await ApiService.request('/auth/verify-github', {
        method: 'POST'
      });

      if (response.success) {
        toast.success('GitHub verification completed!');
        await refreshUser(); // Refresh user data
      }
    } catch (error) {
      console.error('GitHub verification error:', error);
      toast.error(error.message || 'Failed to verify GitHub account');
    } finally {
      setGithubVerifying(false);
    }
  };

  const getAccountType = () => {
    if (!user) return "Unknown";

    const hasEmail = !!user.email;
    const hasPassword = !!user.password_hash;
    const hasOAuth = user.oauthAccounts && user.oauthAccounts.length > 0;

    if (hasEmail && hasOAuth) {
      const providers = user.oauthAccounts.map(acc => acc.provider);
      return `Hybrid (Email + ${providers.join(", ")})`;
    }

    if (hasOAuth) {
      const providers = user.oauthAccounts.map(acc => acc.provider);
      return `OAuth (${providers.join(", ")})`;
    }

    if (hasEmail || hasPassword) {
      return "Email";
    }

    return "Unknown";
  };


  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background`}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">DevCollab Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button */}
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="flex items-center"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>{loading ? "Signing out..." : "Sign Out"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Your account details and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{user.name || "No name provided"}</h3>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Account Type
                  </label>
                  <Badge variant="secondary" className="w-fit">
                    {getAccountType()}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email Verification
                  </label>
                  <div className="flex items-center space-x-2">
                    <Shield className={`h-4 w-4 ${user.emailVerified ? "text-green-500" : "text-yellow-500"}`} />
                    <Badge variant={user.emailVerified ? "default" : "secondary"}>
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    GitHub Verification
                  </label>
                  <div className="flex items-center space-x-2">
                    <Github className={`h-4 w-4 ${user.isGithubVerified ? "text-green-500" : "text-red-500"}`} />
                    <Badge variant={user.isGithubVerified ? "default" : "destructive"}>
                      {user.isGithubVerified ? "Verified" : "Required"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your account and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!user.isGithubVerified && (
                <Button
                  onClick={handleGithubVerification}
                  disabled={githubVerifying}
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                >
                  <Github className="h-4 w-4 mr-2" />
                  {githubVerifying ? "Verifying..." : "Verify GitHub Account"}
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Connected Accounts Card */}
          {user.oauthAccounts && user.oauthAccounts.length > 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="h-5 w-5" />
                  <span>Connected Accounts</span>
                </CardTitle>
                <CardDescription>
                  OAuth accounts linked to your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {user.oauthAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          {account.provider === "google" ? (
                            <span className="text-xs font-semibold text-primary">G</span>
                          ) : account.provider === "github" ? (
                            <Github className="h-4 w-4 text-primary" />
                          ) : (
                            <span className="text-xs font-semibold text-primary">
                              {account.provider[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{account.provider}</p>
                          <p className="text-xs text-muted-foreground">
                            Connected {account.linkedAt ? new Date(account.linkedAt).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">Connected</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
