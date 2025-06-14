import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Plus,
  Building,
} from "lucide-react";
import { motion } from "motion/react";

// Mock data - will be replaced with API calls
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description:
      "We are looking for an experienced React developer to join our growing team. You will be responsible for building user-facing features and improving our web application.",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    isRemote: true,
    salaryRange: { min: 120000, max: 160000, currency: "USD" },
    requirements: [
      { skillName: "React", minimumRating: 8, required: true },
      { skillName: "TypeScript", minimumRating: 7, required: true },
      { skillName: "Node.js", minimumRating: 6, required: false },
    ],
    isActive: true,
    createdAt: "2024-01-15",
    author: { name: "John Smith", company: "TechCorp Inc." },
  },
  {
    id: "2",
    title: "UI/UX Designer",
    description:
      "Join our design team to create beautiful and intuitive user experiences. We are looking for someone passionate about user-centered design.",
    company: "Design Studio",
    location: "Remote",
    isRemote: true,
    salaryRange: { min: 80000, max: 120000, currency: "USD" },
    requirements: [
      { skillName: "Figma", minimumRating: 8, required: true },
      { skillName: "CSS", minimumRating: 7, required: true },
      { skillName: "React", minimumRating: 5, required: false },
    ],
    isActive: true,
    createdAt: "2024-01-14",
    author: { name: "Sarah Johnson", company: "Design Studio" },
  },
  {
    id: "3",
    title: "Backend Engineer",
    description:
      "We need a backend engineer to help us scale our microservices architecture. Experience with Go and Kubernetes is essential.",
    company: "CloudTech",
    location: "New York, NY",
    isRemote: false,
    salaryRange: { min: 130000, max: 180000, currency: "USD" },
    requirements: [
      { skillName: "Go", minimumRating: 8, required: true },
      { skillName: "Kubernetes", minimumRating: 7, required: true },
      { skillName: "Docker", minimumRating: 6, required: true },
    ],
    isActive: true,
    createdAt: "2024-01-13",
    author: { name: "Mike Davis", company: "CloudTech" },
  },
];

export function Jobs() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [showRemoteOnly, setShowRemoteOnly] = React.useState(false);
  const [minSalary, setMinSalary] = React.useState<number>(0);
  const [maxSalary, setMaxSalary] = React.useState<number>(300000);

  const skillOptions = [
    "React",
    "TypeScript",
    "Node.js",
    "Go",
    "Python",
    "Java",
    "Docker",
    "Kubernetes",
    "AWS",
    "Figma",
    "CSS",
    "GraphQL",
  ];

  const filteredJobs = mockJobs.filter((job) => {
    // Search term filter
    if (
      searchTerm &&
      !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !job.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !job.company.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Remote filter
    if (showRemoteOnly && !job.isRemote) {
      return false;
    }

    // Salary filter
    if (
      job.salaryRange &&
      (job.salaryRange.min > maxSalary || job.salaryRange.max < minSalary)
    ) {
      return false;
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      const jobSkills = job.requirements.map((r) => r.skillName);
      const hasRequiredSkills = selectedSkills.every((skill) =>
        jobSkills.includes(skill),
      );
      if (!hasRequiredSkills) {
        return false;
      }
    }

    return true;
  });

  // Check if user can apply to a job (mock function)
  const canApplyToJob = (job: {
    requirements: Array<{
      skillName: string;
      minimumRating: number;
      required: boolean;
    }>;
  }) => {
    // Mock: assume user has some skills with ratings
    // const userSkills: Record<string, number> = {
    //   React: 8,
    //   TypeScript: 7,
    //   "Node.js": 6,
    //   Figma: 9,
    //   CSS: 8,
    // };

    // return job.requirements
    //   .filter((req: { required: boolean }) => req.required)
    //   .every(
    //     (req: { skillName: string; minimumRating: number }) =>
    //       userSkills[req.skillName] >= req.minimumRating,
    //   );

    return job !== null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
          <p className="text-gray-600 mt-1">
            Discover opportunities that match your skills
          </p>
        </div>
        <Button className="self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Post a Job
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Label htmlFor="search">Search jobs</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by title, company, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <Label htmlFor="skills">Required Skills</Label>
            <Select
              onValueChange={(value) => {
                if (!selectedSkills.includes(value)) {
                  setSelectedSkills([...selectedSkills, value]);
                }
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Add skill filter" />
              </SelectTrigger>
              <SelectContent>
                {skillOptions
                  .filter((skill) => !selectedSkills.includes(skill))
                  .map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="minSalary">Minimum Salary</Label>
            <Input
              id="minSalary"
              type="number"
              placeholder="50000"
              value={minSalary || ""}
              onChange={(e) => setMinSalary(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxSalary">Maximum Salary</Label>
            <Input
              id="maxSalary"
              type="number"
              placeholder="200000"
              value={maxSalary || ""}
              onChange={(e) => setMaxSalary(parseInt(e.target.value) || 300000)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Selected Skills and Additional Filters */}
        <div className="mt-4 space-y-4">
          {selectedSkills.length > 0 && (
            <div>
              <Label>Selected Skills:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      onClick={() =>
                        setSelectedSkills(
                          selectedSkills.filter((s) => s !== skill),
                        )
                      }
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remote"
              checked={showRemoteOnly}
              onCheckedChange={(checked) => setShowRemoteOnly(checked === true)}
            />
            <Label htmlFor="remote" className="text-sm">
              Remote jobs only
            </Label>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Job Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {job.isRemote && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Remote
                      </span>
                    )}
                    {canApplyToJob(job) ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Skills needed
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />$
                      {job.salaryRange.min.toLocaleString()} - $
                      {job.salaryRange.max.toLocaleString()}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Requirements */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req) => (
                      <span
                        key={req.skillName}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          req.required
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {req.skillName} ({req.minimumRating}/10)
                        {req.required ? " *" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 lg:w-auto w-full">
                <Button
                  className="w-full lg:w-auto"
                  disabled={!canApplyToJob(job)}
                >
                  {canApplyToJob(job) ? "Apply Now" : "Skills Required"}
                </Button>
                <Button variant="outline" className="w-full lg:w-auto">
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {filteredJobs.length}
            </div>
            <div className="text-sm text-gray-600">Available Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {filteredJobs.filter((job) => canApplyToJob(job)).length}
            </div>
            <div className="text-sm text-gray-600">Jobs You Can Apply To</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {filteredJobs.filter((job) => job.isRemote).length}
            </div>
            <div className="text-sm text-gray-600">Remote Opportunities</div>
          </div>
        </div>
      </div>
    </div>
  );
}
