"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchProjectById, removeUser } from "@/app/utilities/projectUtils";
import { Settings, Users, Clipboard, Info, Trash2, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUserDetails } from "@/app/utilities/userUtils";
import AddMembers from "@/components/AddMembers";
import { addTask, editTask, getAllTasks, deleteTask } from "@/app/utilities/taskUtils";
import DeleteProjectDialog from "@/components/DeleteProjectDialog";
import AddTaskDialog from "@/components/AddTaskDialog";
import TaskDetailsSheet from "@/components/TaskDetailsSheet";
import TaskDropdownMenu from "@/components/TaskDropdownMenu";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditTaskDialog from "@/components/EditTaskDialog";
import ConfirmRemoveUserDialog from "@/components/ConfirmRemoveUserDialog";

import dotenv from 'dotenv';

function ProjectPage() {
  dotenv.config();
  const { projectId } = useParams();
  const router = useRouter();
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending",
    dueDate: "",
  });
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [isRemoveUserDialogOpen, setIsRemoveUserDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  useEffect(() => {

    
    const getProjectDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectById(projectId);
        setProjectDetails(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load project details.");
        setLoading(false);
      }
    };

    const getUserId = async () => {
      try {
        const userData = await fetchUserDetails();
        setCurrentUserId(userData.id);
      } catch (error) {
        setError("failed to fetch userDetails.", error);
      }
    };

    const fetchAllTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks(projectId);
        if (fetchedTasks) {
          setTasks(fetchedTasks);
        }
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      }
    };

    getProjectDetails();
    getUserId();
    fetchAllTasks();
  }, [projectId]);

  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to access this page");
        return;
      }
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/delete/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Project deleted successfully!");
        router.push("/dashboard/projects");
      }
    } catch (error) {
      setError("Failed to delete the project.");
      toast.error("Failed to delete the project.");
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const success = await addTask(projectId, newTask);
      if (success) {
        toast.success("Task added successfully!");
        setIsAddTaskDialogOpen(false);
        setNewTask({
          title: "",
          description: "",
          assignedTo: "",
          status: "pending",
          dueDate: "",
        });
        // Refresh tasks
        const updatedTasks = await getAllTasks(projectId);
        setTasks(updatedTasks);
      } else {
        toast.error("Failed to add task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error adding task.");
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const success = await editTask(projectId, updatedTask.id, updatedTask);
      if (success) {
        toast.success("Task updated successfully!");
        const updatedTasks = await getAllTasks(projectId);
        setTasks(updatedTasks);
        setIsEditTaskDialogOpen(false);
      } else {
        toast.error("Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task.");
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const groupTasksByStatus = (tasks) => {
    if (!tasks || tasks.length === 0) return {};
    return tasks.reduce((acc, task) => {
      const status = task.status || "pending";
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});
  };

  const calculateProgress = () => {
    if (!tasks || tasks.length === 0) return { completed: 0, inProgress: 0, pending: 0 };
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const inProgress = tasks.filter(task => task.status === "in progress").length;
    const pending = total - completed - inProgress;
    return {
      completed: (completed / total) * 100,
      inProgress: (inProgress / total) * 100,
      pending: (pending / total) * 100
    };
  };

  const handleDeleteTask = async (taskId) => {
    const success = await deleteTask(projectId, taskId);
    if (success) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully!");
    }
  };

  const handleRemoveUser = async (userId) => {
    setUserToRemove(projectDetails.users.find(user => user.id === userId));
    setIsRemoveUserDialogOpen(true);
  };

  const confirmRemoveUser = async () => {
    try {
      const success = await removeUser(projectId, userToRemove.id);
      if (success) {
        const updatedProjectDetails = await fetchProjectById(projectId);
        setProjectDetails(updatedProjectDetails);
        toast.success("User removed from the project successfully!");
        setIsRemoveUserDialogOpen(false);
      }
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user from the project.");
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center font-semibold text-lg">
        {error}
      </div>
    );
  }


  const ProjectInfo = () => (
    <div className="flex h-full flex-col bg-white p-4 overflow-y-auto">
      <div className="flex items-center gap-2 pb-4 border-b">
        <Info className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Project Info</h2>
      </div>
      <div className="space-y-4 mt-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Title</h3>
          <p className="text-base">{projectDetails.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="text-sm text-gray-600">{projectDetails.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Progress</h3>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${calculateProgress().completed}%`, float: 'left' }}
            />
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${calculateProgress().inProgress}%`, float: 'left' }}
            />
            <div 
              className="h-full bg-yellow-500" 
              style={{ width: `${calculateProgress().pending}%`, float: 'left' }}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 mt-1">
            <span className="mb-1 sm:mb-0">Completed: {Math.round(calculateProgress().completed)}%</span>
            <span className="mb-1 sm:mb-0">In Progress: {Math.round(calculateProgress().inProgress)}%</span>
            <span>Pending: {Math.round(calculateProgress().pending)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const TaskList = () => (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Clipboard className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Tasks</h2>
        </div>
        {projectDetails.users.some(
          (user) => user.id === currentUserId && user.role === "admin"
        ) && (<Button
          onClick={() => setIsAddTaskDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>)}
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {Object.entries(groupTasksByStatus(tasks)).map(([status, statusTasks]) => (
          <Collapsible key={status} defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 w-full hover:bg-gray-50 p-2 rounded-lg">
              <Badge variant="outline" className={`px-2 py-1 ${getTaskStatusColor(status)}`}>
                {status.toUpperCase()} ({statusTasks.length})
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {statusTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="hover:shadow-md transition-shadow text-sm sm:text-base"
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center">
                        {task.title}
                        <Badge variant="outline" className={`ml-2 ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </Badge>
                      </CardTitle>
                      <TaskDropdownMenu
                        task={task}
                        onView={() => {
                          setSelectedTask(task);
                          setIsTaskDetailsOpen(true);
                        }}
                        onEdit={() => {
                          setSelectedTask(task);
                          setIsEditTaskDialogOpen(true);
                        }}
                        onDelete={() => handleDeleteTask(task.id)}
                        isAdmin={projectDetails.users.some(
                          (user) => user.id === currentUserId && user.role === "admin"
                        )}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {task.assignedTo}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );

  const TeamMembers = () => (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold">Team</h2>
        </div>
        {projectDetails.users.some(
          (user) => user.id === currentUserId && user.role === "admin"
        ) && (
          <AddMembers projectId={projectId} existingMembers={projectDetails.users}/>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {projectDetails.users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profilePicture} alt={user.fullName} />
                <AvatarFallback>
                  {user.fullName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
              {projectDetails.users.some(
                (u) => u.id === currentUserId && u.role === "admin"
              ) && currentUserId !== user.id && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveUser(user.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      {/* Mobile View */}
      <div className="md:hidden">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-4 h-[calc(100vh-8rem)] overflow-y-auto">
            <ProjectInfo />
          </TabsContent>
          <TabsContent value="tasks" className="mt-4 h-[calc(100vh-8rem)] overflow-y-auto">
            <TaskList />
          </TabsContent>
          <TabsContent value="team" className="mt-4 h-[calc(100vh-8rem)] overflow-y-auto">
            <TeamMembers />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
          <ResizablePanel defaultSize={25} minSize={20}>
            <ProjectInfo />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50}>
            <TaskList />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25} minSize={20}>
            <TeamMembers />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.push(`/dashboard/projects/${projectId}/settings`)}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>

        {projectDetails.users.some(
          (user) => user.id === currentUserId && user.role === "admin"
        ) && (
          <DeleteProjectDialog
            isOpen={isDeleteDialogOpen}
            setIsOpen={setIsDeleteDialogOpen}
            onDelete={handleDeleteProject}
          />
        )}
      </div>

      {/* Dialogs */}
      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        setIsOpen={setIsAddTaskDialogOpen}
        onAddTask={handleAddTask}
        newTask={newTask}
        setNewTask={setNewTask}
        projectUsers={projectDetails?.users || []}
      />
      <TaskDetailsSheet
        isOpen={isTaskDetailsOpen}
        setIsOpen={setIsTaskDetailsOpen}
        task={selectedTask}
        projectUsers={projectDetails?.users || []}
        projectId = {projectId}
      />
      <EditTaskDialog
        isOpen={isEditTaskDialogOpen}
        setIsOpen={setIsEditTaskDialogOpen}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        projectUsers={projectDetails?.users || []}
      />
      <ConfirmRemoveUserDialog
        isOpen={isRemoveUserDialogOpen}
        setIsOpen={setIsRemoveUserDialogOpen}
        onConfirm={confirmRemoveUser}
        userName={userToRemove?.fullName || ''}
      />
    </div>
  );
}

export default ProjectPage;

