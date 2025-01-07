import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import axios from "axios";
import toast from "react-hot-toast";

function AddProjectDialog({ onProjectAdded, onClose }) {
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate project title length
    if (name === "projectTitle" && value.length > 20) {
      setError("Project title should not exceed 20 characters.");
      return;
    } else if (name === "projectTitle" && value.length < 5) {
      setError("Project title should should be atleast 5 characters");
    } else {
      setError(""); // Clear error if validation passes
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(30);

    // Final validation before submission
    if (formData.projectTitle.length > 20) {
      setError("Project title should not exceed 20 characters.");
      return;
    }
    if (formData.projectTitle.length < 5) {
      setError("Project title should be at least 5 characters long.");
      return;
    }
    if (formData.projectTitle.length == 0 || formData.description.length == 0) {
      setError("Project title and description is required.");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must log in to add a project!");
        setProgress(0);
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/projects/create",
        {
          title: formData.projectTitle,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentage);
          },
        }
      );

      setProgress(100);
      if(response)
        toast.success("Project added successfully!");
      onProjectAdded(); // Trigger the callback to update the project list
      onClose(); // Close the dialog box after successful submission
    } catch (error) {
      toast.error("Error adding project!");
      setProgress(0);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Enter the new project details. Click Add project when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectTitle" className="text-right">
                Project Title
              </Label>
              <div className="col-span-3">
                <Input
                  id="projectTitle"
                  name="projectTitle"
                  type="text"
                  onChange={handleInputChange}
                  value={formData.projectTitle}
                  placeholder="Enter the project Title"
                  className="col-span-3"
                />
                {error && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {error}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                type="text"
                onChange={handleInputChange}
                value={formData.description}
                placeholder="Enter the project Description here"
                className="col-span-3"
              />
            </div>
          </div>
          {isSubmitting && <Progress value={progress} />}
          <DialogFooter>
            <Button type="submit" className="mt-3" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </div>
  );
}

export default AddProjectDialog;
