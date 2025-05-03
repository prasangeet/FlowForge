"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart, CheckCircle, Clock, User, X } from "lucide-react";
import ProjectCard from "@/components/project_card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchProjectDetails } from "../utilities/projectUtils";
import { fetchUserDetails } from "../utilities/userUtils";
import {
  getAllTasksForUser,
  getRecentDeadlines,
  updateExpiredTasks,
} from "../utilities/taskUtils";

function OverviewDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [note, setNote] = useState("");
  const [recentDealines, setRecentDealines] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const data = await getRecentDeadlines();
        setRecentDealines(data);
        console.log("Recent deadlines:", data);
      } catch (error) {
        console.error("Error fetching recent deadlines:", error);
      }
    };

    const fetchAllTasks = async () => {
      try {
        const data = await getAllTasksForUser();
        setAllTasks(data);
        console.log("All tasks:", data);
      } catch (error) {
        console.error("Error fetching all tasks:", error);
      }
    };

    const fetchAndUpdateExpiredTasks = async () => {
      try {
        const data = await updateExpiredTasks();
        console.log("Expired tasks updated:", data);
      } catch (error) {
        console.error("Error updating expired tasks:", error);
      }
    };
    fetchDeadlines();
    fetchAllTasks();
    fetchAndUpdateExpiredTasks();
  }, []);

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      const fetchedProjects = await fetchProjectDetails();
      setProjects(fetchedProjects);
      setLoading(false);
    };

    const getUser = async () => {
      const userDetails = await fetchUserDetails();
      setUser(userDetails);
    };

    getUser();
    getProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateProgress = (tasks) => {
    if (!tasks) return 0; // Avoid division by zero
    const totalTasks = tasks?.length;
    if (totalTasks === 0) return 0; // Avoid division by zero
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const progress = (completedTasks / totalTasks) * 100;
    return Math.round(progress);
  };

  // const toggleNotes = () => setIsNotesOpen(!isNotesOpen);

  // const handleNoteChange = (e) => setNote(e.target.value);

  // const saveNote = () => {
  //   // Here you would typically save the note to your backend
  //   console.log("Saving note:", note);
  //   // For now, we'll just close the notes
  //   setIsNotesOpen(false);
  // };

  return (
    <div className="w-full  space-y-6 p-6 mx-auto">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user ? user.fullName : "User"}
        </h1>
        {/* <Button onClick={toggleNotes}>
          {isNotesOpen ? "Close Notes" : "Open Notes"}
        </Button> */}
      </div>

      {/* Grid Layout for Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        {/* Analytics Section */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <BarChart className="w-5 h-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {calculateProgress(allTasks) ? calculateProgress(allTasks) : 0}%
            </div>
            <Progress value={calculateProgress(allTasks)} className="w-full" />
            <div className="text-sm text-gray-500 mt-2">Project Completion</div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length}</div>
            <div className="text-sm text-gray-500">Active Projects</div>
          </CardContent>
        </Card>

        {/* Recent Deadlines Section */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="w-5 h-5" />
              Recent Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentDealines?.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No recent deadlines
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                {recentDealines?.slice(0, 3).map((deadline) => (
                  <li
                    key={deadline.id}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium">{deadline.title}</span>
                    <span className="text-yellow-600">
                      {new Date(
                        deadline.dueDate._seconds * 1000
                      ).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Timeline Section */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Calendar className="w-5 h-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="font-medium">Meeting</span>
                <span className="text-purple-600">10 AM, 19th Dec</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium">Review</span>
                <span className="text-purple-600">2 PM, 21st Dec</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium">Deadline</span>
                <span className="text-purple-600">5 PM, 22nd Dec</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Projects and Deadlines */}
      <Tabs defaultValue="projects" className="mt-6 max-w-screen-2xl w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="projects" className="w-full">
            Projects
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="w-full">
            Deadlines
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="w-full min-h-[400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
            {loading ? (
              <div className="col-span-full text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading projects...</p>
              </div>
            ) : (
              projects?.map((item) => (
                <ProjectCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  projectId={item.id}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="deadlines" className="w-full min-h-[400px]">
          <Card className="w-full">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {recentDealines?.length === 0 ? (
                  <li className="flex flex-col items-center justify-center text-gray-500 py-12">
                    <Clock className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-sm">No recent deadlines</span>
                  </li>
                ) : (
                  recentDealines?.map((deadline) => (
                    <li
                      key={deadline.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
                    >
                      <span className="font-medium text-gray-800">
                        {deadline.title}
                      </span>
                      <span className="font-medium text-gray-800 border-l-2 pl-2">
                        <span
                          className={`text-sm p-1 pr-2 pl-2 border rounded-lg ${getStatusColor(
                            deadline.status
                          )}`}
                        >
                          {deadline.status}
                        </span>
                      </span>
                      <span className="text-sm text-yellow-600">
                        {new Date(
                          deadline.dueDate._seconds * 1000
                        ).toLocaleDateString()}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OverviewDashboard;
