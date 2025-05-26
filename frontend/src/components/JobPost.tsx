import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'motion/react';
import {
    Briefcase,
    Plus,
    X,
    MapPin,
    DollarSign,
    Star,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useCreateJob } from '../hooks/useJobs';
import { useProfile } from '../hooks/useUsers';
import { CreateJobData, JobRequirement } from '../types';

const skillOptions = [
    'React', 'TypeScript', 'Node.js', 'Go', 'Python', 'Java',
    'Docker', 'Kubernetes', 'AWS', 'Figma', 'CSS', 'GraphQL',
    'Vue.js', 'Angular', 'Express.js', 'PostgreSQL', 'MongoDB',
    'Redis', 'Elasticsearch', 'Jenkins', 'Terraform', 'Swift',
    'Kotlin', 'Flutter', 'React Native', 'C++', 'C#', '.NET',
    'Ruby', 'PHP', 'Laravel', 'Django', 'Sass', 'Less',
    'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Sketch',
    'Adobe XD', 'Photoshop', 'Illustrator'
];

interface JobRequirementForm {
    skillName: string;
    minimumRating: number;
    required: boolean;
}

export function JobPost() {
    const navigate = useNavigate();
    const { data: currentUser } = useProfile();
    const createJobMutation = useCreateJob();

    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        location: '',
        isRemote: false,
        companyName: '',
        contactEmail: currentUser?.email || '',
        contactPhone: '',
        salaryMin: '',
        salaryMax: '',
        currency: 'USD'
    });

    const [requirements, setRequirements] = React.useState<JobRequirementForm[]>([]);
    const [newRequirement, setNewRequirement] = React.useState<JobRequirementForm>({
        skillName: '',
        minimumRating: 5,
        required: true
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Form validation
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Job title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Job description is required';
        }
        if (!formData.contactEmail.trim()) {
            newErrors.contactEmail = 'Contact email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
        }
        if (requirements.length === 0) {
            newErrors.requirements = 'At least one skill requirement is needed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Add skill requirement
    const handleAddRequirement = () => {
        if (newRequirement.skillName &&
            !requirements.some(req => req.skillName === newRequirement.skillName)) {
            setRequirements([...requirements, { ...newRequirement }]);
            setNewRequirement({
                skillName: '',
                minimumRating: 5,
                required: true
            });
        }
    };

    // Remove skill requirement
    const handleRemoveRequirement = (index: number) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    // Submit job posting
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            setErrors({ general: 'You must be logged in to post a job' });
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            const jobData: CreateJobData = {
                title: formData.title,
                description: formData.description,
                requiredSkills: requirements.map((req) => ({
                    minRating: req.minimumRating,
                    skill: req.skillName,

                })) as JobRequirement[],
                contactInfo: {
                    email: formData.contactEmail,
                    phone: formData.contactPhone || undefined,
                    company: formData.companyName || undefined
                },
                location: formData.location || undefined,
                isRemote: formData.isRemote,
                salaryRange: formData.salaryMin && formData.salaryMax ? {
                    min: parseInt(formData.salaryMin),
                    max: parseInt(formData.salaryMax),
                    currency: formData.currency
                } : undefined
            };

            await createJobMutation.mutateAsync(jobData);

            // Navigate back to jobs page on success
            navigate('/jobs');
        } catch (error) {
            console.error('Error creating job:', error);
            setErrors({ general: 'Failed to create job. Please try again.' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate('/jobs')}
                    className="flex items-center gap-2"
                >
                    ← Back to Jobs
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
                    <p className="text-gray-600">Find the perfect candidate for your role</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Job Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="company">Company Name</Label>
                                <Input
                                    id="company"
                                    placeholder="e.g. TechCorp Inc."
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. San Francisco, CA"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <div>
                                <Label htmlFor="remote" className="text-base font-medium">
                                    Remote Work
                                </Label>
                                <p className="text-sm text-gray-600">
                                    This position can be done remotely
                                </p>
                            </div>
                            <Switch
                                id="remote"
                                checked={formData.isRemote}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRemote: checked }))}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="mt-1 min-h-[120px]"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Salary Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Compensation (Optional)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="salaryMin">Minimum Salary</Label>
                                <Input
                                    id="salaryMin"
                                    type="number"
                                    placeholder="80000"
                                    value={formData.salaryMin}
                                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="salaryMax">Maximum Salary</Label>
                                <Input
                                    id="salaryMax"
                                    type="number"
                                    placeholder="120000"
                                    value={formData.salaryMax}
                                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="CAD">CAD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skills Requirements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Skill Requirements *
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Add new requirement */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <Label className="text-sm font-medium mb-3 block">Add Skill Requirement</Label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div>
                                    <Select
                                        value={newRequirement.skillName}
                                        onValueChange={(value) => setNewRequirement(prev => ({ ...prev, skillName: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select skill" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {skillOptions
                                                .filter(skill => !requirements.some(req => req.skillName === skill))
                                                .map((skill) => (
                                                    <SelectItem key={skill} value={skill}>
                                                        {skill}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select
                                        value={newRequirement.minimumRating.toString()}
                                        onValueChange={(value) => setNewRequirement(prev => ({ ...prev, minimumRating: parseInt(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Min rating" />
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
                                <div>
                                    <Select
                                        value={newRequirement.required.toString()}
                                        onValueChange={(value) => setNewRequirement(prev => ({ ...prev, required: value === 'true' }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Required</SelectItem>
                                            <SelectItem value="false">Preferred</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddRequirement}
                                    disabled={!newRequirement.skillName}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* Current requirements */}
                        {requirements.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Current Requirements</Label>
                                <div className="space-y-2">
                                    {requirements.map((req, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between bg-white border rounded-lg p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium">{req.skillName}</span>
                                                <span className="text-sm text-gray-600">
                                                    Min: {req.minimumRating}/10
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${req.required
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {req.required ? 'Required' : 'Preferred'}
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveRequirement(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {requirements.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p>No skill requirements added yet</p>
                                <p className="text-sm">Add at least one skill requirement for your job posting</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="contactEmail">Contact Email *</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    placeholder="jobs@company.com"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                                    className="mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="contactPhone">Contact Phone</Label>
                                <Input
                                    id="contactPhone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex items-center justify-between pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/jobs')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={createJobMutation.isLoading || !formData.title || !formData.description || requirements.length === 0}
                        className="flex items-center gap-2"
                    >
                        {createJobMutation.isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Posting Job...
                            </>
                        ) : (
                            <>
                                <Briefcase className="h-4 w-4" />
                                Post Job
                            </>
                        )}
                    </Button>
                </div>

                {createJobMutation.error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <AlertCircle className="h-5 w-5" />
                        <span>Failed to create job. Please try again.</span>
                    </div>
                )}
            </form>
        </div>
    );
}
