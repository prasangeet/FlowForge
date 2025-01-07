'use client'

import { Dialog, DialogTrigger } from "./ui/dialog";
import AddProjectDialog from "./AddProjectDialog";
import { useState } from "react";
import { Plus } from 'lucide-react';
import { Card, CardContent } from "./ui/card";

function AddProject_card({ onProjectAdded }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="h-full cursor-pointer hover:bg-gray-50 transition-colors duration-300">
          <CardContent className="flex flex-col items-center justify-center h-full p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 sm:mb-4">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
            <span className="text-base sm:text-lg font-medium text-gray-700 text-center">Create Project</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <AddProjectDialog
        onProjectAdded={onProjectAdded}
        onClose={() => setIsDialogOpen(false)}
      />
    </Dialog>
  );
}

export default AddProject_card;