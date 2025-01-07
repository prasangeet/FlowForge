"use client";

import React, { useState, useEffect } from "react";
import { fetchProjectDetails } from "@/app/utilities/projectUtils";
import ProjectCard from "@/components/project_card";
import AddProject_card from "@/components/AddProject_card";
import { Loader2 } from 'lucide-react';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProjects = async () => {
    setLoading(true);
    try {
      const fetchedProjects = await fetchProjectDetails();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleProjectAdded = () => {
    getProjects();
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Projects</h1>
      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-6">
          {projects.map((item) => (
            <ProjectCard
              key={item.id}
              title={item.title}
              description={item.description}
              projectId={item.id}
            />
          ))}
          <AddProject_card onProjectAdded={handleProjectAdded} />
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;