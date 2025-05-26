import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Star,
    Plus,
    User,
    Calendar,
    MessageSquare,
    Award,
    TrendingUp,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import {
    useUserEndorsements,
    useUserGivenEndorsements,
    useCreateEndorsement,
    useCanEndorse
} from '../hooks/useEndorsements';
import { useProfile, useSearchUsers } from '../hooks/useUsers';
import { User as UserType } from '../types';

const skillOptions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Java',
    'Docker', 'Kubernetes', 'AWS', 'Figma', 'CSS', 'GraphQL',
    'Vue.js', 'Angular', 'Express.js', 'PostgreSQL', 'MongoDB',
    'Redis', 'Elasticsearch', 'Jenkins', 'Terraform'
];

export function EndorsementsNew() {
    const [showEndorseForm, setShowEndorseForm] = React.useState(false);
    const [endorseForm, setEndorseForm] = React.useState({
        memberName: '',
        userId: '',
        skill: '',
        rating: 8,
        comment: ''
    });

    // Get current user profile
    const { data: currentUser } = useProfile();

    // Get endorsements received by current user
    const {
        data: userEndorsements = [],
        isLoading: endorsementsLoading,
        error: endorsementsError
    } = useUserEndorsements(currentUser?._id || '');

    // Get endorsements given by current user
    const {
        data: givenEndorsements = [],
        isLoading: givenEndorsementsLoading,
        error: givenEndorsementsError
    } = useUserGivenEndorsements(currentUser?._id || '');

    // Search for users when typing in member name
    const { data: searchResults = [] } = useSearchUsers(
        endorseForm.memberName ? { search: endorseForm.memberName } : undefined
    );

    // Check if current user can endorse the selected user and skill
    const { data: canEndorse } = useCanEndorse(
        currentUser?._id || '',
        endorseForm.userId,
        endorseForm.skill
    );

    // Create endorsement mutation
    const createEndorsementMutation = useCreateEndorsement();

    // Handle member selection
    const handleMemberSelect = (user: UserType) => {
        setEndorseForm(prev => ({
            ...prev,
            memberName: user.name,
            userId: user._id
        }));
    };

    // Handle endorsement submission
    const handleEndorse = async () => {
        if (!currentUser?._id || !endorseForm.userId || !endorseForm.skill) return;

        try {
            await createEndorsementMutation.mutateAsync({
                endorserId: currentUser._id,
                endorseeId: endorseForm.userId,
                skillId: endorseForm.skill, // In a real app, this would be a skill ID
            });

            // Reset form and close
            setEndorseForm({ memberName: '', userId: '', skill: '', rating: 8, comment: '' });
            setShowEndorseForm(false);
        } catch (error) {
            console.error('Error creating endorsement:', error);
        }
    };

    // Calculate skill statistics
    const getSkillStats = () => {
        if (!userEndorsements || userEndorsements.length === 0) return [];

        interface SkillData {
            count: number;
            ratings: number[];
        }

        const skillCounts = userEndorsements.reduce((acc: Record<string, SkillData>, endorsement: any) => { // TODO: Fix Endorsement type mismatch
            const skillName = typeof endorsement.skill === 'string'
                ? endorsement.skill
                : endorsement.skill?.name || 'Unknown';

            if (!acc[skillName]) {
                acc[skillName] = { count: 0, ratings: [] };
            }
            acc[skillName].count += 1;
            acc[skillName].ratings.push(endorsement.rating);
            return acc;
        }, {});

        return Object.entries(skillCounts).map(([skill, data]: [string, SkillData]) => ({
            skill,
            count: data.count,
            averageRating: data.ratings.reduce((a: number, b: number) => a + b, 0) / data.ratings.length
        }));
    };

    const skillStats = getSkillStats();

    // Loading state
    if (endorsementsLoading || givenEndorsementsLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading endorsements...</span>
            </div>
        );
    }

    // Error state
    if (endorsementsError || givenEndorsementsError) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading endorsements</h3>
                <p className="text-gray-600 mb-4">There was an error loading the endorsement data.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Endorsements</h1>
                    <p className="text-gray-600 mt-1">
                        Build trust through skill endorsements from your network
                    </p>
                </div>
                <Button onClick={() => setShowEndorseForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Endorse Someone
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Endorsement Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{userEndorsements.length}</div>
                        <div className="text-sm text-gray-600">Endorsements Received</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{givenEndorsements.length}</div>
                        <div className="text-sm text-gray-600">Endorsements Given</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{skillStats.length}</div>
                        <div className="text-sm text-gray-600">Skills Endorsed</div>
                    </div>
                </div>
            </div>

            {/* Skill Breakdown */}
            {skillStats.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Skill Breakdown</h2>
                    <div className="space-y-3">
                        {skillStats.map((stat) => (
                            <div key={stat.skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Award className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{stat.skill}</h3>
                                        <p className="text-sm text-gray-600">{stat.count} endorsements</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-gray-900">
                                        {stat.averageRating.toFixed(1)}/10
                                    </div>
                                    <div className="text-sm text-gray-600">Average rating</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Endorse Someone Form */}
            {showEndorseForm && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-sm border p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Endorse a Skill</h2>
                        <Button variant="ghost" onClick={() => setShowEndorseForm(false)}>
                            ×
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="memberName">Member Name</Label>
                            <Input
                                id="memberName"
                                placeholder="Enter member name..."
                                value={endorseForm.memberName}
                                onChange={(e) => setEndorseForm(prev => ({
                                    ...prev,
                                    memberName: e.target.value,
                                    userId: '' // Reset user ID when typing
                                }))}
                                className="mt-1"
                            />
                            {/* Search Results */}
                            {endorseForm.memberName && searchResults.length > 0 && !endorseForm.userId && (
                                <div className="mt-2 border rounded-md bg-white shadow-sm max-h-40 overflow-y-auto">
                                    {searchResults.slice(0, 5).map((user: UserType) => (
                                        <button
                                            key={user._id}
                                            onClick={() => handleMemberSelect(user)}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="h-3 w-3 text-gray-600" />
                                            </div>
                                            <span>{user.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="skill">Skill</Label>
                            <Select
                                value={endorseForm.skill}
                                onValueChange={(value) => setEndorseForm(prev => ({ ...prev, skill: value }))}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select skill" />
                                </SelectTrigger>
                                <SelectContent>
                                    {skillOptions.map((skill) => (
                                        <SelectItem key={skill} value={skill}>
                                            {skill}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="rating">Rating (1-10)</Label>
                        <Input
                            id="rating"
                            type="number"
                            min="1"
                            max="10"
                            value={endorseForm.rating}
                            onChange={(e) => setEndorseForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                            className="mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="comment">Comment (Optional)</Label>
                        <Textarea
                            id="comment"
                            placeholder="Share your experience working with this person..."
                            value={endorseForm.comment}
                            onChange={(e) => setEndorseForm(prev => ({ ...prev, comment: e.target.value }))}
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Endorsement eligibility check */}
                    {endorseForm.userId && endorseForm.skill && canEndorse === false && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-sm text-yellow-800">
                                You have already endorsed this skill for this user, or you cannot endorse yourself.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={handleEndorse}
                            disabled={
                                !endorseForm.userId ||
                                !endorseForm.skill ||
                                canEndorse === false ||
                                createEndorsementMutation.isLoading
                            }
                        >
                            {createEndorsementMutation.isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Endorsement'
                            )}
                        </Button>
                        <Button variant="outline" onClick={() => setShowEndorseForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Endorsement Lists */}
            <Tabs defaultValue="received" className="bg-white rounded-lg shadow-sm">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                        value="received"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                        Received ({userEndorsements.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="given"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                        Given ({givenEndorsements.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="received" className="p-6">
                    <div className="space-y-4">
                        {userEndorsements.map((endorsement: any, index: number) => ( // TODO: Fix Endorsement type
                            <motion.div
                                key={endorsement._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {typeof endorsement.endorser === 'object'
                                                    ? endorsement.endorser?.name
                                                    : 'Unknown User'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                endorsed your {typeof endorsement.skill === 'string'
                                                    ? endorsement.skill
                                                    : endorsement.skill?.name || 'Unknown Skill'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-gray-900 font-medium">{endorsement.rating}/10</span>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(endorsement.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {endorsement.comment && (
                                    <div className="flex gap-2">
                                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-gray-700 text-sm">{endorsement.comment}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {userEndorsements.length === 0 && (
                            <div className="text-center py-8">
                                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No endorsements yet</h3>
                                <p className="text-gray-600">
                                    Start networking and showcasing your skills to receive endorsements.
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="given" className="p-6">
                    <div className="space-y-4">
                        {givenEndorsements.map((endorsement: any, index: number) => ( // TODO: Fix Endorsement type
                            <motion.div
                                key={endorsement._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {typeof endorsement.user === 'object'
                                                    ? endorsement.user?.name
                                                    : 'Unknown User'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                you endorsed their {typeof endorsement.skill === 'string'
                                                    ? endorsement.skill
                                                    : endorsement.skill?.name || 'Unknown Skill'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-gray-900 font-medium">{endorsement.rating}/10</span>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(endorsement.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {endorsement.comment && (
                                    <div className="flex gap-2">
                                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-gray-700 text-sm">{endorsement.comment}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {givenEndorsements.length === 0 && (
                            <div className="text-center py-8">
                                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No endorsements given</h3>
                                <p className="text-gray-600">
                                    Help others by endorsing their skills and building the community.
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
