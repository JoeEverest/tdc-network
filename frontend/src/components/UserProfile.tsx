import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Star,
    Mail,
    Phone,
    Award,
    ThumbsUp,
    MessageCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { getUserById } from '../lib/userService';
import { createEndorsement } from '../lib/endorsementService';
import { User, UserSkill } from '../types';
import { useAuth } from '@clerk/clerk-react';
import { useProfile } from '../hooks/useUsers';

interface EndorseSkillFormProps {
    userSkill: UserSkill;
    userId: string;
    currentUser: User;
    onSuccess: () => void;
    onCancel: () => void;
}

function EndorseSkillForm({ userSkill, userId, currentUser, onSuccess, onCancel }: EndorseSkillFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const skillId = typeof userSkill.skill === 'string' ? userSkill.skill : userSkill.skill._id;
            await createEndorsement({
                endorserId: currentUser._id, // Use the current user's actual database ID
                endorseeId: userId,
                skillId,
                rating,
                comment: comment.trim() || undefined
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to create endorsement:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const skillName = typeof userSkill.skill === 'string' ? userSkill.skill : userSkill.skill.name;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Endorse {skillName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="rating">Rating (1-10)</Label>
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setRating(value)}
                                        className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${value <= rating
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="comment">Comment (optional)</Label>
                            <Textarea
                                id="comment"
                                placeholder="Share your experience working with this person..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Endorsement'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function UserProfile() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { userId: currentUserId } = useAuth();
    const [endorsingSkill, setEndorsingSkill] = useState<UserSkill | null>(null);

    const { data: user, isLoading, error, refetch } = useQuery<User>(
        ['user', userId],
        () => getUserById(userId!),
        {
            enabled: !!userId,
            retry: false
        }
    );

    // Get current user profile using the useProfile hook
    const { data: currentUser } = useProfile();

    const handleEndorseSuccess = () => {
        setEndorsingSkill(null);
        refetch();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-4">The user profile you&apos;re looking for doesn&apos;t exist.</p>
                    <Button onClick={() => navigate('/members')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Members
                    </Button>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUserId === user.clerkId;
    const averageRating = user.skills.length > 0
        ? user.skills.reduce((sum, skill) => sum + skill.rating, 0) / user.skills.length
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/members')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Members
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                        {user.availableForHire && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                                Available for Hire
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Profile Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Skills</p>
                                        <p className="text-2xl font-bold text-gray-900">{user.skills.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Average Rating</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {averageRating.toFixed(1)}
                                            </p>
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Endorsements</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {user.skills.reduce((sum, skill) => sum + skill.endorsements.length, 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Member Since</p>
                                        <p className="text-lg font-medium text-gray-900">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    Skills & Endorsements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.skills.length === 0 ? (
                                    <p className="text-gray-600 text-center py-8">No skills listed yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {user.skills.map((userSkill, index) => {
                                            const skillName = typeof userSkill.skill === 'string'
                                                ? userSkill.skill
                                                : userSkill.skill.name;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="border rounded-lg p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-medium text-gray-900">{skillName}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-sm font-medium">{userSkill.rating}/10</span>
                                                            </div>
                                                            {!isOwnProfile && currentUser && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setEndorsingSkill(userSkill)}
                                                                >
                                                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                                                    Endorse
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <ThumbsUp className="h-4 w-4" />
                                                        <span>{userSkill.endorsements.length} endorsements</span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                {user.contactInfo?.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{user.contactInfo.phone}</span>
                                    </div>
                                )}
                                {user.contactInfo?.email && user.contactInfo.email !== user.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{user.contactInfo.email}</span>
                                    </div>
                                )}

                                {!isOwnProfile && (
                                    <div className="pt-3 border-t">
                                        <Button className="w-full" size="sm">
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Send Message
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Profile Created</span>
                                    <span className="text-sm font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Last Updated</span>
                                    <span className="text-sm font-medium">
                                        {new Date(user.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Hiring Status</span>
                                    <Badge variant={user.availableForHire ? "default" : "secondary"}>
                                        {user.availableForHire ? "Available" : "Not Available"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Endorsement Modal */}
            {endorsingSkill && currentUser && (
                <EndorseSkillForm
                    userSkill={endorsingSkill}
                    userId={user._id}
                    currentUser={currentUser}
                    onSuccess={handleEndorseSuccess}
                    onCancel={() => setEndorsingSkill(null)}
                />
            )}
        </div>
    );
}
