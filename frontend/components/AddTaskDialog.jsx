"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

function AddTaskDialog({
  isOpen,
  setIsOpen,
  onAddTask,
  newTask,
  setNewTask,
  projectUsers,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDateSelect = (date) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setNewTask({ ...newTask, dueDate: formattedDate });
    } else {
      setNewTask({ ...newTask, dueDate: "" });
    }
    setIsDropdownOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Task Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter task title"
            />
          </div>

          {/* Task Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter task description"
            />
          </div>

          {/* Assignee Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right font-medium">
              Assignee
            </Label>
            <Select
              value={newTask.assignedTo}
              onValueChange={(value) =>
                setNewTask({ ...newTask, assignedTo: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {projectUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right font-medium">
              Status
            </Label>
            <Select
              value={newTask.status}
              onValueChange={(value) =>
                setNewTask({ ...newTask, status: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date Dropdown */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right font-medium">
              Due Date
            </Label>
            <div className="col-span-3">
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between text-left font-normal ${
                      !newTask.dueDate && "text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate
                        ? format(new Date(newTask.dueDate), "PPP")
                        : "Pick a date"}
                    </div>
                    <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto p-0 mt-2">
                  <Calendar
                    mode="single"
                    selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Dialog Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onAddTask}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskDialog;
