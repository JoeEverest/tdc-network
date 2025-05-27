import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAddSkill } from "../hooks/useUsers";

// Popular skills list for the skill selector
const popularSkills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Rust",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "Next.js",
  "Vue.js",
  "Angular",
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "C++",
  "C#",
  ".NET",
  "Ruby",
  "PHP",
  "Laravel",
  "Django",
  "Figma",
  "Sketch",
  "Adobe XD",
  "Photoshop",
  "Illustrator",
  "CSS",
  "Sass",
  "Less",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
];

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSkillModal({ isOpen, onClose }: AddSkillModalProps) {
  const [skillName, setSkillName] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addSkillMutation = useAddSkill();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setIsSubmitting(true);
    try {
      await addSkillMutation.mutateAsync({
        skill: {
          skillName: skillName.trim(),
          rating,
        },
      });
      // Reset form and close modal
      setSkillName("");
      setRating(5);
      onClose();
    } catch (error) {
      console.error("Failed to add skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSkillName("");
    setRating(5);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Add New Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="skillName">Skill</Label>
                <Select value={skillName} onValueChange={setSkillName}>
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
                <Label htmlFor="rating">Self Rating (1-10)</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                        value <= rating
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !skillName.trim()}
                >
                  {isSubmitting ? "Adding..." : "Add Skill"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
