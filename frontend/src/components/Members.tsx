import React from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Star, Mail, User, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useUsers } from "../hooks";
import { User as UserType, UserSkill } from "../types";

const skillOptions = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Go",
  "Java",
  "Docker",
  "Kubernetes",
  "AWS",
  "Figma",
  "CSS",
  "GraphQL",
];

export function Members() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);
  const [minRating, setMinRating] = React.useState<number>(1);
  const [showAvailableOnly, setShowAvailableOnly] = React.useState(false);
  const [showEndorsedOnly, setShowEndorsedOnly] = React.useState(false);

  // Create search filters object
  // const filters: SearchFilters = React.useMemo(() => ({
  //     skills: selectedSkills.length > 0 ? selectedSkills.map(skillName => ({
  //         skillId: skillName, // For now using skill name as ID
  //         minRating: minRating > 1 ? minRating : undefined,
  //     })) : undefined,
  //     availableForHire: showAvailableOnly ? true : undefined,
  // }), [selectedSkills, minRating, showAvailableOnly]);

  // Use React Query hook to fetch users
  const { data: members = [], isLoading, error } = useUsers();

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
      if (
        searchTerm &&
        !member.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Endorsed filter (if not handled by backend)
      if (showEndorsedOnly) {
        const hasEndorsements = member.skills.some(
          (userSkill: UserSkill) =>
            userSkill.endorsements && userSkill.endorsements.length > 0,
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

          {/* Minimum Rating */}
          <div>
            <Label htmlFor="rating">Minimum Rating</Label>
            <Select
              value={minRating.toString()}
              onValueChange={(value) => setMinRating(parseInt(value))}
            >
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
          <p className="text-red-600">
            Error loading members. Please try again.
          </p>
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
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              {/* Member Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {member.skills.some(
                        (skill) => skill.endorsements.length > 0,
                      ) && (
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

              {/* Email */}
              <p className="text-gray-600 text-sm mb-4">{member.email}</p>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Skills
                </h4>
                <div className="space-y-1">
                  {member.skills.slice(0, 3).map((userSkill, skillIndex) => {
                    const skillName =
                      typeof userSkill.skill === "string"
                        ? userSkill.skill
                        : userSkill.skill.name;
                    return (
                      <div
                        key={`${member._id}-skill-${skillIndex}`}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700">
                          {skillName}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-blue-600">
                            {userSkill.rating}/10
                          </span>
                          {userSkill.endorsements.length > 0 && (
                            <span className="text-xs text-gray-500">
                              ({userSkill.endorsements.length} endorsements)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                  {member.contactInfo?.email && (
                    <Button size="sm" variant="ghost" className="p-2">
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  {member.contactInfo?.phone && (
                    <Button size="sm" variant="ghost" className="p-2">
                      <span className="h-4 w-4">📞</span>
                    </Button>
                  )}
                </div>
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

      {/* No Results */}
      {!isLoading && !error && filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No members found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}
