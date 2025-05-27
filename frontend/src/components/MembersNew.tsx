import React from 'react';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Search,
    Star,
    Mail,
    User,
    Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useSearchUsers } from '../hooks';
import { User as UserType, SearchFilters } from '../types';

const skillOptions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Java',
    'Docker', 'Kubernetes', 'AWS', 'Figma', 'CSS', 'GraphQL'
];

export function MembersNew() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
    const [minRating, setMinRating] = React.useState<number>(1);
    const [showAvailableOnly, setShowAvailableOnly] = React.useState(false);
    const [showEndorsedOnly, setShowEndorsedOnly] = React.useState(false);

    // Create search filters object
    const filters: SearchFilters = React.useMemo(() => ({
        skills: selectedSkills.length > 0 ? selectedSkills.map(skillName => ({
            skillId: skillName, // For now using skill name as ID
            minRating: minRating > 1 ? minRating : undefined,
        })) : undefined,
        availableForHire: showAvailableOnly ? true : undefined,
    }), [selectedSkills, minRating, showAvailableOnly]);

    // Use React Query hook to fetch users
    const { data: members = [], isLoading, error } = useSearchUsers(filters);

    const handleAvailabilityChange = (checked: boolean | "indeterminate") => {
        setShowAvailableOnly(checked === true);
    };

    const handleEndorsedChange = (checked: boolean | "indeterminate") => {
        setShowEndorsedOnly(checked === true);
    };

    // Filter members client-side for features not supported by backend filters
    const filteredMembers = React.useMemo(() => {
        return members.filter((member: UserType) => {
            // Search term filter (if not handled by backend)
            if (searchTerm && !member.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            // Endorsed filter (if not handled by backend)
            if (showEndorsedOnly) {
                const hasEndorsements = member.skills.some(skill =>
                    Array.isArray(skill.endorsements) ? skill.endorsements.length > 0 : false
                );
                if (!hasEndorsements) {
                    return false;
                }
            }

            return true;
        });
    }, [members, searchTerm, showEndorsedOnly]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Members Directory</h1>
                <p className="text-gray-600 mt-1">
                    Discover talented professionals and their skills
                </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <Label htmlFor="search">Search members</Label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="search"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Skills Filter */}
                    <div>
                        <Label htmlFor="skills">Required Skills</Label>
                        <Select onValueChange={(value) => {
                            if (!selectedSkills.includes(value)) {
                                setSelectedSkills([...selectedSkills, value]);
                            }
                        }}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Add skill filter" />
                            </SelectTrigger>
                            <SelectContent>
                                {skillOptions.filter(skill => !selectedSkills.includes(skill)).map((skill) => (
                                    <SelectItem key={skill} value={skill}>
                                        {skill}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Minimum Rating */}
                    <div>
                        <Label htmlFor="rating">Minimum Rating</Label>
                        <Select value={minRating.toString()} onValueChange={(value) => setMinRating(parseInt(value))}>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                                    <SelectItem key={rating} value={rating.toString()}>
                                        {rating}/10
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                    <div className="mt-4">
                        <Label>Selected Skills:</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {selectedSkills.map((skill) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {skill}
                                    <button
                                        onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Filters */}
                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="available"
                            checked={showAvailableOnly}
                            onCheckedChange={handleAvailabilityChange}
                        />
                        <Label htmlFor="available" className="text-sm">
                            Available for hire only
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="endorsed"
                            checked={showEndorsedOnly}
                            onCheckedChange={handleEndorsedChange}
                        />
                        <Label htmlFor="endorsed" className="text-sm">
                            Endorsed members only
                        </Label>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <p className="text-red-600">Error loading members. Please try again.</p>
                </div>
            )}

            {/* Results */}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member: UserType, index: number) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {member.email}
                                    </p>
                                    {member.availableForHire && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                            Available for hire
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {member.skills.slice(0, 4).map((userSkill, skillIndex) => {
                                        const skillName = typeof userSkill.skill === 'string'
                                            ? userSkill.skill
                                            : userSkill.skill?.name || 'Unknown';
                                        return (
                                            <span
                                                key={skillIndex}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {skillName}
                                                <span className="ml-1 text-blue-600">
                                                    {userSkill.rating}/10
                                                </span>
                                                {Array.isArray(userSkill.endorsements) && userSkill.endorsements.length > 0 && (
                                                    <Star className="ml-1 h-3 w-3 text-yellow-500 fill-current" />
                                                )}
                                            </span>
                                        );
                                    })}
                                    {member.skills.length > 4 && (
                                        <span className="text-xs text-gray-500">
                                            +{member.skills.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contact Actions */}
                            <div className="mt-4 flex gap-2">
                                {member.contactInfo?.email && (
                                    <Button size="sm" variant="outline" className="flex-1">
                                        <Mail className="h-4 w-4 mr-1" />
                                        Contact
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/profile/${member._id}`)}
                                >
                                    View Profile
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredMembers.length === 0 && (
                <div className="text-center py-12">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                    <p className="text-gray-600">
                        Try adjusting your filters to see more results.
                    </p>
                </div>
            )}
        </div>
    );
}
