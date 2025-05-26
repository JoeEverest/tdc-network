import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'motion/react';
import { User, Star, Briefcase, Check } from 'lucide-react';

const steps = [
    { id: 1, name: 'Basic Info', icon: User },
    { id: 2, name: 'Skills', icon: Star },
    { id: 3, name: 'Availability', icon: Briefcase },
];

const skillCategories = [
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Data Science',
    'DevOps',
    'Design',
    'Product Management',
    'Marketing',
    'Sales',
    'Other'
];

const popularSkills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
    'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'GraphQL',
    'Next.js', 'Vue.js', 'Angular', 'React Native', 'Flutter', 'Swift',
    'Kotlin', 'C++', 'C#', '.NET', 'Ruby', 'PHP', 'Laravel', 'Django'
];

export function ProfileSetup() {
    const { user } = useUser();
    const [currentStep, setCurrentStep] = React.useState(1);
    const [formData, setFormData] = React.useState({
        bio: '',
        contactEmail: user?.primaryEmailAddress?.emailAddress || '',
        phone: '',
        linkedin: '',
        website: '',
        availableForHire: false,
        skills: [] as { name: string; category: string; rating: number }[]
    });

    const [newSkill, setNewSkill] = React.useState({
        name: '',
        category: '',
        rating: 5
    });

    const handleAddSkill = () => {
        if (newSkill.name && newSkill.category) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, { ...newSkill }]
            }));
            setNewSkill({ name: '', category: '', rating: 5 });
        }
    };

    const handleRemoveSkill = (index: number) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = () => {
        // TODO: Submit to API
        console.log('Profile data:', formData);
        // Redirect to dashboard
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
                    <p className="text-gray-600 mt-2">
                        Let's set up your profile to start connecting with others.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {currentStep > step.id ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <step.icon className="h-5 w-5" />
                                    )}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                    {step.name}
                                </span>
                                {step.id < steps.length && (
                                    <div className="w-8 h-px bg-gray-300 ml-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {currentStep === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="mt-1"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Contact Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                                    <Input
                                        id="linkedin"
                                        placeholder="https://linkedin.com/in/..."
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="website">Website (Optional)</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://..."
                                        value={formData.website}
                                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Your Skills</h3>

                                {/* Add Skill Form */}
                                <div className="border rounded-lg p-4 mb-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="skillName">Skill</Label>
                                            <Select
                                                value={newSkill.name}
                                                onValueChange={(value) => setNewSkill(prev => ({ ...prev, name: value }))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select or type skill" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {popularSkills.map((skill) => (
                                                        <SelectItem key={skill} value={skill}>
                                                            {skill}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="skillCategory">Category</Label>
                                            <Select
                                                value={newSkill.category}
                                                onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {skillCategories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="skillRating">Self Rating (1-10)</Label>
                                            <Input
                                                id="skillRating"
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={newSkill.rating}
                                                onChange={(e) => setNewSkill(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={handleAddSkill} className="mt-4" size="sm">
                                        Add Skill
                                    </Button>
                                </div>

                                {/* Skills List */}
                                {formData.skills.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900">Your Skills</h4>
                                        {formData.skills.map((skill, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                                <div>
                                                    <span className="font-medium">{skill.name}</span>
                                                    <span className="text-gray-500 ml-2">({skill.category})</span>
                                                    <span className="text-blue-600 ml-2">Rating: {skill.rating}/10</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveSkill(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>

                                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                    <div>
                                        <Label htmlFor="availability" className="text-base font-medium">
                                            Available for hire
                                        </Label>
                                        <p className="text-sm text-gray-600">
                                            Let others know if you're open to new opportunities
                                        </p>
                                    </div>
                                    <Switch
                                        id="availability"
                                        checked={formData.availableForHire}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, availableForHire: checked }))}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">Profile Summary</h4>
                                <div className="text-sm text-blue-800 space-y-1">
                                    <p>Bio: {formData.bio || 'Not provided'}</p>
                                    <p>Skills: {formData.skills.length} added</p>
                                    <p>Available for hire: {formData.availableForHire ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            disabled={currentStep === 1}
                        >
                            Previous
                        </Button>

                        {currentStep < steps.length ? (
                            <Button
                                onClick={() => setCurrentStep(prev => prev + 1)}
                                disabled={currentStep === 2 && formData.skills.length === 0}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit}>
                                Complete Profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
