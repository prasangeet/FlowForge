"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function DeleteProjectDialog({ isOpen, setIsOpen, onDelete }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 text-lg"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 size={20} />
          Delete Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Are you sure you want to delete this project? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-8">
          <Button
            className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded-md transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md transition-colors duration-300"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          >
            Confirm Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteProjectDialog;
