import React, { useState, useEffect } from "react";
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
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const EditTaskDialog = ({
  isOpen,
  setIsOpen,
  task,
  onUpdate,
  projectUsers,
}) => {
  const [editedTask, setEditedTask] = useState(task);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentAssigneeId, setCurrentAssigneeId] = useState(null); // To store the current assignee details

  useEffect(() => {
    setEditedTask(task);
    if (task?.assignedTo) {
        
      // Find the current assignee in the projectUsers list
      const assignee = projectUsers.find(
        (user) => user.username === task.assignedTo
      );
      setCurrentAssigneeId(assignee.id);
    }
  }, [task, projectUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setEditedTask((prev) => ({ ...prev, status: value }));
  };

  const handleAssignedToChange = (value) => {
    setEditedTask((prev) => ({ ...prev, assignedTo: value }));
    setCurrentAssigneeId(value)
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setEditedTask((prev) => ({ ...prev, dueDate: formattedDate }));
    } else {
      setEditedTask((prev) => ({ ...prev, dueDate: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedTask);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Task Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={editedTask?.title || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Task Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedTask?.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Assignee Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right font-medium">
                Assignee
              </Label>
              <Select
                onValueChange={handleAssignedToChange}
                value={currentAssigneeId ? currentAssigneeId : ""}

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
                onValueChange={handleStatusChange}
                value={editedTask?.status || ""}
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
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between text-left font-normal ${
                        !editedTask?.dueDate && "text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editedTask?.dueDate
                          ? format(new Date(editedTask.dueDate), "PPP")
                          : "Pick a date"}
                      </div>
                      <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto p-0 mt-2">
                    <Calendar
                      mode="single"
                      selected={
                        editedTask?.dueDate
                          ? new Date(editedTask.dueDate)
                          : undefined
                      }
                      onSelect={handleDateChange}
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
