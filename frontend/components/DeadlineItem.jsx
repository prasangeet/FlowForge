"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart, CheckCircle, Clock, User, AlertTriangle } from "lucide-react";
import ProjectCard from "@/components/project_card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchProjectDetails } from "@/app/utilities/projectUtils";
import { fetchUserDetails } from "@/app/utilities/userUtils";
import { getRecentDeadlines } from "@/app/utilities/taskUtils";
import DeadlinesList from "./DeadlinesList";
import DashboardCard from "./DashboardCard";

function OverviewDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [note, setNote] = useState("");
  const [recentDeadlines, setRecentDeadlines] = useState([]);
  const [deadlinesLoading, setDeadlinesLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        setDeadlinesLoading(true);
        const data = await getRecentDeadlines();
        setRecentDeadlines(data);
      } catch (error) {
        console.error("Error fetching recent deadlines:", error);
      } finally {
        setDeadlinesLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        const fetchedProjects = await fetchProjectDetails();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const getUser = async () => {
      try {
        const userDetails = await fetchUserDetails();
        setUser(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUser();
    getProjects();
  }, []);

  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);
  const handleNoteChange = (e) => setNote(e.target.value);
  
  const saveNote = () => {
    console.log("Saving note:", note);
    setIsNotesOpen(false);
  };

  // Calculate statistics
  const pendingDeadlines = recentDeadlines.filter(d => d.status === "pending").length;
  const overdueDeadlines = recentDeadlines.filter(d => 
    d.status === "pending" && new Date(d.dueDate._seconds * 1000) < new Date()
  ).length;

  return (
    <div className="w-full space-y-8 p-6 mx-auto bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Welcome, {user ? user.fullName : "User"}
          </h1>
          <p className="text-gray-500">Here's an overview of your workspace</p>
        </div>
        <Button 
          onClick={toggleNotes} 
          className="transition-all duration-300 hover:bg-blue-700"
        >
          {isNotesOpen ? "Close Notes" : "Open Notes"}
        </Button>
      </div>

      {/* Notes Section (Conditional) */}
      {isNotesOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quick Notes</h2>
            <Button 
              onClick={saveNote} 
              className="bg-green-600 hover:bg-green-700 transition-colors duration-300"
            >
              Save Note
            </Button>
          </div>
          <textarea 
            value={note} 
            onChange={handleNoteChange}
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your notes here..."
          />
        </div>
      )}

      {/* Grid Layout for Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {/* Analytics Section */}
        <DashboardCard 
          title="Analytics" 
          icon={<BarChart className="w-5 h-5" />}
          iconColor="text-blue-600"
        >
          <div className="text-2xl font-bold mb-2">75%</div>
          <Progress value={75} className="w-full h-2 bg-blue-100" />
          <div className="text-sm text-gray-500 mt-2">Project Completion</div>
        </DashboardCard>

        {/* Projects Section */}
        <DashboardCard 
          title="Projects" 
          icon={<CheckCircle className="w-5 h-5" />}
          iconColor="text-green-600"
        >
          <div className="text-2xl font-bold">{projects.length}</div>
          <div className="text-sm text-gray-500">Active Projects</div>
          <div className="mt-2 text-xs">
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {Math.floor(Math.random() * 3) + 1} updates today
            </span>
          </div>
        </DashboardCard>

        {/* Deadlines Section */}
        <DashboardCard 
          title="Deadlines" 
          icon={<Clock className="w-5 h-5" />}
          iconColor="text-yellow-600"
        >
          <div className="text-2xl font-bold">{pendingDeadlines}</div>
          <div className="text-sm text-gray-500">Pending deadlines</div>
          {overdueDeadlines > 0 && (
            <div className="mt-2 text-xs">
              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {overdueDeadlines} overdue
              </span>
            </div>
          )}
        </DashboardCard>

        {/* Timeline Section */}
        <DashboardCard 
          title="Timeline" 
          icon={<Calendar className="w-5 h-5" />}
          iconColor="text-purple-600"
        >
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between items-center p-2 hover:bg-purple-50 rounded-md transition-colors duration-200">
              <span className="font-medium">Meeting</span>
              <span className="text-purple-600">10 AM, 19th Dec</span>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-purple-50 rounded-md transition-colors duration-200">
              <span className="font-medium">Review</span>
              <span className="text-purple-600">2 PM, 21st Dec</span>
            </li>
            <li className="flex justify-between items-center p-2 hover:bg-purple-50 rounded-md transition-colors duration-200">
              <span className="font-medium">Deadline</span>
              <span className="text-purple-600">5 PM, 22nd Dec</span>
            </li>
          </ul>
        </DashboardCard>
      </div>

      {/* Tabs for Projects and Deadlines */}
      <Tabs defaultValue="projects" className="mt-8">
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-white">
          <TabsTrigger 
            value="projects" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-3"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="deadlines" 
            className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 py-3"
          >
            Deadlines
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="w-full min-h-[400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
            {loading ? (
              <div className="col-span-full text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center py-10 border border-dashed rounded-lg">
                <p className="text-gray-500">No projects found</p>
              </div>
            ) : (
              projects.map((item) => (
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

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="w-full min-h-[400px] animate-fadeIn">
          <DeadlinesList deadlines={recentDeadlines} isLoading={deadlinesLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OverviewDashboard;