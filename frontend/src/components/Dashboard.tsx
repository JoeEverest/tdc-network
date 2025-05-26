import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Users,
    Briefcase,
    Star,
    Plus,
    TrendingUp,
    MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
    const { user } = useUser();
    const [availableForHire, setAvailableForHire] = React.useState(false);

    const stats = [
        { label: 'Skills Added', value: '8', icon: TrendingUp, color: 'text-blue-600' },
        { label: 'Endorsements', value: '12', icon: Star, color: 'text-yellow-600' },
        { label: 'Profile Views', value: '34', icon: Users, color: 'text-green-600' },
        { label: 'Messages', value: '5', icon: MessageSquare, color: 'text-purple-600' },
    ];

    const quickActions = [
        { label: 'Add Skills', icon: Plus, href: '/profile/skills' },
        { label: 'Browse Members', icon: Users, href: '/members' },
        { label: 'View Jobs', icon: Briefcase, href: '/jobs' },
        { label: 'Post Job', icon: Plus, href: '/jobs/new' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user?.firstName || 'User'}!
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
                            onCheckedChange={setAvailableForHire}
                        />
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
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Button
                            key={action.label}
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            asChild
                        >
                            <a href={action.href}>
                                <action.icon className="h-6 w-6" />
                                <span className="text-sm font-medium">{action.label}</span>
                            </a>
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
                                    <span className="font-medium">John Doe</span> endorsed your React skill
                                </p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-900">
                                    New job posted: <span className="font-medium">Senior Frontend Developer</span>
                                </p>
                                <p className="text-xs text-gray-500">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-900">
                                    <span className="font-medium">Sarah Smith</span> viewed your profile
                                </p>
                                <p className="text-xs text-gray-500">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="recommendations" className="p-6">
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">Complete your profile</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Add more skills and get endorsements to improve your visibility.
                            </p>
                            <Button size="sm" className="mt-2">Add Skills</Button>
                        </div>
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">Connect with others</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Browse members with similar skills and start networking.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">Browse Members</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
