import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Users,
  Briefcase,
  Star,
  Plus,
  TrendingUp,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useProfile,
  useUserEndorsements,
  useUserGivenEndorsements,
  useToggleAvailability,
} from "../hooks";
import { User } from "../types";
import { AddSkillModal } from "./AddSkillModal";

export function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  // Get user profile data
  const { data: profile, isLoading: profileLoading } = useProfile();
  const userProfile = profile as User | undefined;

  // Only fetch endorsements if we have a profile
  const { data: endorsements = [] } = useUserEndorsements(
    userProfile?._id || "",
  );
  const { data: givenEndorsements = [] } = useUserGivenEndorsements(
    userProfile?._id || "",
  );

  // Toggle availability mutation
  const toggleAvailability = useToggleAvailability();

  const availableForHire = userProfile?.availableForHire || false;

  const handleAvailabilityToggle = async () => {
    if (userProfile?._id) {
      toggleAvailability.mutate(userProfile._id);
    }
  };

  // Show loading state if profile is loading
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Calculate stats from real data
  const stats = [
    {
      label: "Skills Added",
      value: userProfile?.skills?.length?.toString() || "0",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      label: "Endorsements",
      value: endorsements.length.toString(),
      icon: Star,
      color: "text-yellow-600",
    },
    {
      label: "Profile Views",
      value: "0", // Will implement this when backend supports it
      icon: Users,
      color: "text-green-600",
    },
    {
      label: "Endorsements Given",
      value: givenEndorsements.length.toString(),
      icon: MessageSquare,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    { label: "Add Skills", icon: Plus, action: () => setShowAddSkillModal(true) },
    {
      label: "Browse Members",
      icon: Users,
      action: () => navigate("/members"),
    },
    { label: "View Jobs", icon: Briefcase, action: () => navigate("/jobs") },
    { label: "Post Job", icon: Plus, action: () => navigate("/jobs/new") },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your skills, connect with others, and find opportunities.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Label htmlFor="availability" className="text-sm font-medium">
              Available for hire
            </Label>
            <Switch
              id="availability"
              checked={availableForHire}
              onCheckedChange={handleAvailabilityToggle}
              disabled={toggleAvailability.isLoading}
            />
            {toggleAvailability.isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Tabs defaultValue="activity" className="bg-white rounded-lg shadow-sm">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="activity"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Recent Activity
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">John Doe</span> endorsed your
                  React skill
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  New job posted:{" "}
                  <span className="font-medium">Senior Frontend Developer</span>
                </p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Sarah Smith</span> viewed your
                  profile
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="p-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900">
                Complete your profile
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Add more skills and get endorsements to improve your visibility.
              </p>
              <Button size="sm" className="mt-2" onClick={() => setShowAddSkillModal(true)}>
                Add Skills
              </Button>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Connect with others</h3>
              <p className="text-sm text-gray-600 mt-1">
                Browse members with similar skills and start networking.
              </p>
              <Button size="sm" variant="outline" className="mt-2">
                Browse Members
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Skill Modal */}
      {userProfile?._id && (
        <AddSkillModal
          isOpen={showAddSkillModal}
          onClose={() => setShowAddSkillModal(false)}
          userId={userProfile._id}
        />
      )}
    </div>
  );
}
