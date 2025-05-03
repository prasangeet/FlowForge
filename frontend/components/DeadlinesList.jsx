import React from "react";
import DeadlineItem from "./DeadlineItem";

const DeadlinesList = ({ deadlines, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-600">Loading deadlines...</span>
      </div>
    );
  }

  if (!deadlines || deadlines.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
        <p className="text-gray-500">No deadlines found</p>
        <p className="text-sm text-gray-400 mt-1">
          Deadlines will appear here when they are created
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <ul className="space-y-2">
        {deadlines.map((deadline) => (
          <DeadlineItem key={deadline.id} deadline={deadline} />
        ))}
      </ul>
    </div>
  );
};

export default DeadlinesList;