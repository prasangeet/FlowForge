import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

const TaskDropdownMenu = ({ task, onView, onEdit, onDelete, isAdmin }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    setIsOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };

  const handleView = () => {
    onView(task);
    setIsOpen(false);
  };

  const handleEdit = () => {
    onEdit(task);
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            <span>View Task</span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Task</span>
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={handleDeleteClick}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Task</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        taskTitle={task.title}
      />
    </>
  );
};

export default TaskDropdownMenu;
