import React from "react";
import { useNavigate } from "react-router";
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
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Plus,
  Building
} from "lucide-react";
import { motion } from "motion/react";
import { useJobs } from "../hooks/useJobs";

import {
  Job,
  JobRequirement,

  JobSearchFilters,
} from "../types";

export function JobsNew() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [showRemoteOnly, setShowRemoteOnly] = React.useState(false);
  const [minSalary, setMinSalary] = React.useState<number>(0);
  const [maxSalary, setMaxSalary] = React.useState<number>(300000);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  // Build search filters for the API
  const searchFilters: JobSearchFilters = React.useMemo(() => {
    const filters: JobSearchFilters = {};

    if (searchTerm) {
      filters.search = searchTerm;
    }

    if (selectedSkills.length > 0) {
      filters.skills = selectedSkills;
    }

    if (showRemoteOnly) {
      filters.isRemote = true;
    }

    if (minSalary > 0 || maxSalary < 300000) {
      filters.salaryRange = {
        min: minSalary,
        max: maxSalary,
      };
    }

    return filters;
  }, [searchTerm, selectedSkills, showRemoteOnly, minSalary, maxSalary]);

  // Fetch jobs with filters
  const {
    data: jobs = [],
    isLoading: jobsLoading,
    error: jobsError,
    refetch: refetchJobs,
  } = useJobs(searchFilters);


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
    "Vue.js",
    "Angular",
    "Express.js",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "Jenkins",
    "Terraform",
  ];

  // Check if user can apply to a job based on their skills
  const canApplyToJob = (job: Job) => {
    // if (!currentUser?.skills) return false;

    // // Get user's skills with ratings
    // const userSkills = currentUser.skills.reduce(
    //   (acc: Record<string, number>, skill: UserSkill) => {
    //     const skillName =
    //       typeof skill.skill === "string" ? skill.skill : skill.skill.name;
    //     acc[skillName] = skill.rating;
    //     return acc;
    //   },
    //   {},
    // );

    // // Check if user meets minimum requirements for all required skills
    // return job.requirements.every((req) => {
    //   const skillName = typeof req.skill === "string" ? req.skill : req.skill;
    //   return userSkills[skillName] && userSkills[skillName] >= req.minRating;
    // });
    return job !== null
  };

  // Loading state
  if (jobsLoading) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  // Error state
  if (jobsError) {
    return (
      <ErrorMessage
        title="Error loading jobs"
        message="There was an error loading the job listings."
        onRetry={() => refetchJobs()}
      />
    );
  }

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
        <Button
          className="self-start sm:self-auto"
          onClick={() => navigate("/jobs/new")}
        >
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
        {jobs.map((job: Job, index: number) => (
          <motion.div
            key={job._id || job.id}
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
                    {job?.company || job.contactInfo?.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />$
                      {job.salaryRange.min?.toLocaleString()} - $
                      {job.salaryRange.max?.toLocaleString()}
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
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map(
                        (req: JobRequirement, reqIndex: number) => (
                          <span
                            key={reqIndex}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {req.skill} ({req.minRating}/10)
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 lg:w-auto w-full">

                <Button
                  variant="outline"
                  className="w-full lg:w-auto"
                  onClick={() =>
                    canApplyToJob(job) ? setSelectedJob(job) : null
                  }
                  disabled={!canApplyToJob(job)}
                >
                  {canApplyToJob(job) ? "View Contact" : "Skills Required"}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {jobs.length === 0 && (
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

      {/* Contact Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Job: </span>
                <span className="text-sm text-gray-900">
                  {selectedJob.title}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Company:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {selectedJob.company || selectedJob.contactInfo?.company}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Email:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {selectedJob.contactInfo.email}
                </span>
              </div>
              {selectedJob.contactInfo.phone && (
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Phone:{" "}
                  </span>
                  <span className="text-sm text-gray-900">
                    {selectedJob.contactInfo.phone}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => setSelectedJob(null)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.location.href = `mailto:${selectedJob.contactInfo.email}?subject=Application for ${selectedJob.title}`;
                }}
                className="flex-1"
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {jobs.length}
            </div>
            <div className="text-sm text-gray-600">Available Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter((job: Job) => canApplyToJob(job)).length}
            </div>
            <div className="text-sm text-gray-600">Jobs You Can Apply To</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {jobs.filter((job: Job) => job.isRemote).length}
            </div>
            <div className="text-sm text-gray-600">Remote Opportunities</div>
          </div>
        </div>
      </div>
    </div>
  );
}
