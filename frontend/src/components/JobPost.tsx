import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateJob } from "../hooks/useJobs";
import { CreateJobData, JobRequirement } from "../types";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { ErrorMessage } from "./ui/error-message";

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

export function JobPost() {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);
  const [salaryCurrency, setSalaryCurrency] = useState("USD");
  const [requiredSkills, setRequiredSkills] = useState<JobRequirement[]>([]);

  const handleAddSkill = () => {
    setRequiredSkills([...requiredSkills, { skill: "", minRating: 5 }]);
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...requiredSkills];
    newSkills.splice(index, 1);
    setRequiredSkills(newSkills);
  };

  const handleSkillChange = (
    index: number,
    field: keyof JobRequirement,
    value: string | number,
  ) => {
    const newSkills = [...requiredSkills];
    if (field === "minRating") {
      newSkills[index][field] = Number(value);
    } else {
      newSkills[index][field] = value as string;
    }
    setRequiredSkills(newSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData: CreateJobData = {
      title,
      description,
      requiredSkills,
      contactInfo: {
        email: contactEmail,
        phone: contactPhone || undefined,
        company: company || undefined,
      },
      location: location || undefined,
      isRemote,
      salaryRange:
        minSalary && maxSalary
          ? {
              min: minSalary,
              max: maxSalary,
              currency: salaryCurrency,
            }
          : undefined,
    };

    try {
      await createJobMutation.mutateAsync(jobData);
      navigate("/jobs");
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1"
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="location">
            Location (e.g., &quot;San Francisco, CA&quot; or &quot;Remote&quot;)
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRemote"
            checked={isRemote}
            onCheckedChange={(checked) => setIsRemote(checked === true)}
          />
          <Label htmlFor="isRemote">This job is fully remote</Label>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-4 border-t mt-6">
          Contact Information
        </h2>
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
          <Input
            id="contactPhone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="mt-1"
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-4 border-t mt-6">
          Salary Range (Optional)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="minSalary">Min Salary</Label>
            <Input
              id="minSalary"
              type="number"
              placeholder="e.g., 50000"
              value={minSalary === undefined ? "" : minSalary}
              onChange={(e) =>
                setMinSalary(
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxSalary">Max Salary</Label>
            <Input
              id="maxSalary"
              type="number"
              placeholder="e.g., 120000"
              value={maxSalary === undefined ? "" : maxSalary}
              onChange={(e) =>
                setMaxSalary(
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="salaryCurrency">Currency</Label>
            <Select value={salaryCurrency} onValueChange={setSalaryCurrency}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 pt-4 border-t mt-6">
          Required Skills
        </h2>
        {requiredSkills.map((skillReq, index) => (
          <div key={index} className="space-y-2 p-3 border rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`skillName-${index}`}>Skill Name</Label>
                <Select
                  value={skillReq.skill}
                  onValueChange={(value) =>
                    handleSkillChange(index, "skill", value)
                  }
                >
                  <SelectTrigger id={`skillName-${index}`} className="mt-1">
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`minRating-${index}`}>
                  Minimum Rating (1-10)
                </Label>
                <Input
                  id={`minRating-${index}`}
                  type="number"
                  min="1"
                  max="10"
                  value={skillReq.minRating}
                  onChange={(e) =>
                    handleSkillChange(
                      index,
                      "minRating",
                      parseInt(e.target.value),
                    )
                  }
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveSkill(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove Skill
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={handleAddSkill}
          className="mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Required Skill
        </Button>

        {createJobMutation.error && (
          <ErrorMessage
            title="Failed to post job"
            message={
              (createJobMutation.error as Error)?.message ||
              "An unexpected error occurred."
            }
          />
        )}

        <div className="pt-6 border-t mt-6">
          <Button
            type="submit"
            disabled={createJobMutation.isLoading}
            className="w-full sm:w-auto"
          >
            {createJobMutation.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting Job...
              </>
            ) : (
              "Post Job"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
