import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, User, CalendarDays, MessageSquare } from 'lucide-react';
import toast from "react-hot-toast";
import { fetchUserDetails } from "@/app/utilities/userUtils";
import { fetchNotes, updateNote } from "@/app/utilities/taskUtils";

const TaskDetailsSheet = ({
  isOpen,
  setIsOpen,
  task,
  projectUsers,
  projectId,
}) => {
  const [updates, setUpdates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUpdate, setNewUpdate] = useState({
    note: "",
    userId: "",
    username: "",
  });

  const loadProfilePicture = useCallback((update) => {
    if (update?.addedBy?.userId) {
      const user = projectUsers?.find(
        (user) => user.id === update.addedBy.userId
      );
      return user?.profilePicture || null;
    }
    return null;
  }, [projectUsers]);

  const getUserDetails = useCallback(async () => {
    try {
      const user = await fetchUserDetails();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error("Failed to load user details");
    }
  }, []);

  const isAdmin = useCallback(() => {
    if (!currentUser || !projectUsers) return false;
    const currentUserInProject = projectUsers.find(
      (user) => user.id === currentUser.id
    );
    return currentUserInProject?.role === "admin" || false;
  }, [currentUser, projectUsers]);

  const loadUpdates = useCallback( async() => {
    if (!task) return;
    try {
      const fetchedUpdates = await fetchNotes(projectId, task.id)
      console.log(fetchedUpdates);
      setUpdates(fetchedUpdates);
    } catch (error) {
      console.error("Failed to load updates:", error);
      toast.error("Failed to load updates");
    }
  }, [task, projectId]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  useEffect(() => {
    if (isOpen && task) {
      loadUpdates();
      const intervalId = setInterval(loadUpdates, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isOpen, task, loadUpdates]);

  useEffect(() => {
    if (currentUser) {
      setNewUpdate(prev => ({
        ...prev,
        userId: currentUser.id || "",
        username: currentUser.username || "",
      }));
    }
  }, [currentUser]);

  const addUpdate = async () => {
    if (newUpdate.note.trim() === "") {
      toast.error("Notes cannot be empty");
      return;
    }

    try {
      const success = await updateNote(projectId, task?.id, newUpdate);
      if (success) {
        loadUpdates();
        setNewUpdate(prev => ({ ...prev, note: "" }));
        toast.success("Note added");
      }
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note");
    }
  };

  if (!task) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-2xl p-0">
        <ScrollArea className="h-full w-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold">
                Task Details
              </SheetTitle>
              <SheetDescription>View and update task details</SheetDescription>
            </SheetHeader>
            <div className="space-y-6">
              <Card className="border-2 border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {task.title || "No title"}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {task.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Label className="font-semibold">Status</Label>
                      <Badge variant="secondary" className="ml-auto">
                        {task.status || "No status"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <Label className="font-semibold">Assigned To</Label>
                      <span className="ml-auto">
                        {task.assignedTo || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <Label className="font-semibold">Due Date</Label>
                      <span className="ml-auto">
                        {task.dueDate
                          ? format(new Date(task.dueDate), "MMM dd, yyyy")
                          : "No due date"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Updates
                </h3>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4">
                  {updates.map((update, index) => (
                    <Card key={index} className="border border-primary/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar>
                            <AvatarImage
                              src={
                                loadProfilePicture(update) ||
                                `https://api.dicebear.com/6.x/initials/svg?seed=${
                                  update?.addedBy?.username || "User"
                                }`
                              }
                            />
                            <AvatarFallback>
                              {update?.addedBy?.username
                                ? update.addedBy.username
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {update?.addedBy?.username || "User"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {update.note}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {(currentUser?.id === task.assignedTo || isAdmin()) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Add New Update</h3>
                    <Textarea
                      placeholder="Write a new update..."
                      value={newUpdate.note}
                      onChange={(e) =>
                        setNewUpdate((prev) => ({ ...prev, note: e.target.value }))
                      }
                      className="min-h-[100px]"
                    />
                    <Button onClick={addUpdate} className="w-full">
                      Add Update
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;

