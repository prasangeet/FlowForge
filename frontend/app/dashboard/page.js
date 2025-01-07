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

function OverviewDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [note, setNote] = useState("");

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

  const toggleNotes = () => setIsNotesOpen(!isNotesOpen);

  const handleNoteChange = (e) => setNote(e.target.value);

  const saveNote = () => {
    // Here you would typically save the note to your backend
    console.log("Saving note:", note);
    // For now, we'll just close the notes
    setIsNotesOpen(false);
  };

  return (
    <div className="w-full  space-y-6 p-6 mx-auto">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user ? user.fullName : "User"}
        </h1>
        <Button onClick={toggleNotes}>
          {isNotesOpen ? "Close Notes" : "Open Notes"}
        </Button>
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
            <div className="text-2xl font-bold mb-2">75%</div>
            <Progress value={75} className="w-full" />
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
            <div className="text-2xl font-bold">{projects.length}</div>
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
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="font-medium">Project A</span>
                <span className="text-yellow-600">Due 20th Dec</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium">Project B</span>
                <span className="text-yellow-600">Due 25th Dec</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium">Task C</span>
                <span className="text-yellow-600">Due 30th Dec</span>
              </li>
            </ul>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
            {loading ? (
              <div className="col-span-full text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading projects...</p>
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

        <TabsContent value="deadlines" className="w-full min-h-[400px]">
          <Card className="w-full">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium">Task 1</p>
                    <p className="text-sm text-gray-500">Project A</p>
                  </div>
                  <span className="text-yellow-600 font-medium">
                    Due 20th Dec
                  </span>
                </li>
                <li className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium">Task 2</p>
                    <p className="text-sm text-gray-500">Project B</p>
                  </div>
                  <span className="text-yellow-600 font-medium">
                    Due 25th Dec
                  </span>
                </li>
                <li className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium">Task 3</p>
                    <p className="text-sm text-gray-500">Project C</p>
                  </div>
                  <span className="text-yellow-600 font-medium">
                    Due 30th Dec
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notes Floating Component */}
      {isNotesOpen && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg w-96 p-4 z-50">
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md"
            placeholder="Enter your notes..."
            value={note}
            onChange={handleNoteChange}
          />
          <div className="mt-3 flex justify-between">
            <Button variant="outline" onClick={toggleNotes}>
              Cancel
            </Button>
            <Button onClick={saveNote}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverviewDashboard;
