import React from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

function ProjectActivityCard({ title, description, projectId, onOpenDialog }) {
  return (
    <DialogTrigger asChild>
      <div
        className="w-full max-w-sm bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:scale-105 max-sm:max-w-full"
        onClick={() => onOpenDialog(projectId)}
      >
        {/* Project Header */}
        <div className="relative w-full h-36 sm:h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          <Image
            src="/projectImage.png"
            layout="fill"
            objectFit="cover"
            alt="Project activity cover"
            className="opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-2xl font-bold">{title}</h3>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-3">
          <p className="text-sm sm:text-base text-gray-700 truncate">
            {description}
          </p>
          <p className="text-xs sm:text-sm text-blue-500 font-medium">
            View activities &rarr;
          </p>
        </div>
      </div>
    </DialogTrigger>
  );
}

export default ProjectActivityCard;
