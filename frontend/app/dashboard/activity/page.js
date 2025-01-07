'use client'

import React, { useState, useEffect } from "react";
import { fetchProjectDetails } from "@/app/utilities/projectUtils"; // Ensure the path to your utility file is correct
import { Loader2 } from "lucide-react";
import ProjectActivityCard from "@/components/ProjectActivityCard";// Replace with your actual ProjectActivityCard component
import ActivityDialog from "@/components/ActivityDialog"; // Replace with your actual ActivityDialog component

function ActivityPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Function to fetch project details
  const getProjects = async () => {
    setLoading(true);
    try {
      const fetchedProjects = await fetchProjectDetails(); // Fetch project details
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for selected project
  const handleOpenDialog = (projectId, projectTitle) => {
    setSelectedProject({ id: projectId, title: projectTitle });
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProject(null);
  };

  // Fetch projects on component mount
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
        Projects Activity
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {projects.map((project) => (
            <ProjectActivityCard
              key={project.id}
              title={project.title}
              description={project.description}
              projectId={project.id}
              onOpenDialog={() => handleOpenDialog(project.id, project.title)}
            />
          ))}
        </div>
      )}
      {selectedProject && (
        <ActivityDialog
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  );
}

export default ActivityPage;
