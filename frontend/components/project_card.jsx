import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

function ProjectCard({ title, description, projectId }) {
  const router = useRouter();

  const handleProjectClick = () => {
    router.push(`/dashboard/projects/${projectId}`);
  };
  

  return (
    <div 
      className="w-full max-w-sm bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1 max-sm:max-w-full"
      onClick={handleProjectClick}
    >
      <div className="relative w-full h-36 sm:h-48">
        <Image
          src="/projectImage.png"
          layout="fill"
          objectFit="cover"
          alt="Project cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <Image
            src="/project_logo.png"
            width={40}
            height={40}
            alt="Project logo"
            className="rounded-full border-2 border-gray-200 sm:w-12 sm:h-12"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;