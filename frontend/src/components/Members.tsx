import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Search,
    Filter,
    Star,
    MapPin,
    Mail,
    Globe,
    Linkedin,
    User
} from 'lucide-react';
import { motion } from 'motion/react';

// Mock data - will be replaced with API calls
const mockMembers = [
    {
        id: '1',
        name: 'John Doe',
        bio: 'Full-stack developer with 5+ years experience',
        avatarUrl: null,
        availableForHire: true,
        isEndorsed: true,
        skills: [
            { name: 'React', rating: 8, endorsements: 5 },
            { name: 'TypeScript', rating: 7, endorsements: 3 },
            { name: 'Node.js', rating: 9, endorsements: 4 }
        ],
        contactInfo: {
            email: 'john@example.com',
            linkedin: 'https://linkedin.com/in/johndoe'
        }
    },
    {
        id: '2',
        name: 'Sarah Smith',
        bio: 'UI/UX Designer passionate about creating beautiful experiences',
        avatarUrl: null,
        availableForHire: false,
        isEndorsed: true,
        skills: [
            { name: 'Figma', rating: 9, endorsements: 8 },
            { name: 'React', rating: 6, endorsements: 2 },
            { name: 'CSS', rating: 8, endorsements: 6 }
        ],
        contactInfo: {
            email: 'sarah@example.com',
            website: 'https://sarahsmith.design'
        }
    },
    {
        id: '3',
        name: 'Mike Johnson',
        bio: 'Backend engineer specializing in microservices architecture',
        avatarUrl: null,
        availableForHire: true,
        isEndorsed: false,
        skills: [
            { name: 'Go', rating: 9, endorsements: 0 },
            { name: 'Docker', rating: 8, endorsements: 0 },
            { name: 'Kubernetes', rating: 7, endorsements: 0 }
        ],
        contactInfo: {
            email: 'mike@example.com'
        }
    }
];

const skillOptions = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Java',
    'Docker', 'Kubernetes', 'AWS', 'Figma', 'CSS', 'GraphQL'
];

export function Members() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
    const [minRating, setMinRating] = React.useState<number>(1);
    const [showAvailableOnly, setShowAvailableOnly] = React.useState(false);
    const [showEndorsedOnly, setShowEndorsedOnly] = React.useState(false);

    const filteredMembers = mockMembers.filter(member => {
        // Search term filter
        if (searchTerm && !member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !member.bio.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Availability filter
        if (showAvailableOnly && !member.availableForHire) {
            return false;
        }

        // Endorsed filter
        if (showEndorsedOnly && !member.isEndorsed) {
            return false;
        }

        // Skills filter
        if (selectedSkills.length > 0) {
            const memberSkills = member.skills.map(s => s.name);
            const hasRequiredSkills = selectedSkills.every(skill =>
                memberSkills.includes(skill) &&
                member.skills.find(s => s.name === skill)?.rating >= minRating
            );
            if (!hasRequiredSkills) {
                return false;
            }
        }

        return true;
    });

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
                                placeholder="Search by name or bio..."
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
                            onCheckedChange={setShowAvailableOnly}
                        />
                        <Label htmlFor="available" className="text-sm">
                            Available for hire only
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="endorsed"
                            checked={showEndorsedOnly}
                            onCheckedChange={setShowEndorsedOnly}
                        />
                        <Label htmlFor="endorsed" className="text-sm">
                            Endorsed members only
                        </Label>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member, index) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        {/* Member Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {member.isEndorsed && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <Star className="h-3 w-3 mr-1" />
                                                Endorsed
                                            </span>
                                        )}
                                        {member.availableForHire && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {member.bio}
                        </p>

                        {/* Skills */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                            <div className="space-y-1">
                                {member.skills.slice(0, 3).map((skill) => (
                                    <div key={skill.name} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{skill.name}</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm text-blue-600">{skill.rating}/10</span>
                                            {skill.endorsements > 0 && (
                                                <span className="text-xs text-gray-500">
                                                    ({skill.endorsements} endorsements)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {member.skills.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                        +{member.skills.length - 3} more skills
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {member.contactInfo.email && (
                                    <Button size="sm" variant="ghost" className="p-2">
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                )}
                                {member.contactInfo.linkedin && (
                                    <Button size="sm" variant="ghost" className="p-2">
                                        <Linkedin className="h-4 w-4" />
                                    </Button>
                                )}
                                {member.contactInfo.website && (
                                    <Button size="sm" variant="ghost" className="p-2">
                                        <Globe className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <Button size="sm" variant="outline">
                                View Profile
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* No Results */}
            {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
                    <p className="text-gray-600">
                        Try adjusting your search criteria or filters.
                    </p>
                </div>
            )}
        </div>
    );
}
