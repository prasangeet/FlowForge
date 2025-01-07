'use client'

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { fetchActivities } from "@/app/utilities/projectUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

function ActivityDialog({ isOpen, onClose, projectId, projectTitle }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadActivities = async () => {
      if (isOpen && projectId) {
        setLoading(true);
        try {
          const fetchedActivities = await fetchActivities(projectId);
          setActivities(fetchedActivities);
          
          // Process data for the chart
          const last7Days = processChartData(fetchedActivities);
          setChartData(last7Days);
        } catch (error) {
          console.error("Failed to fetch activities:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadActivities();
  }, [isOpen, projectId]);

  const processChartData = (activities) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    const countMap = activities.reduce((acc, activity) => {
      const activityDate = new Date(activity.createdAt._seconds * 1000);
      activityDate.setHours(0, 0, 0, 0);
      
      const matchingDay = last7Days.find(day => day.getTime() === activityDate.getTime());
      if (matchingDay) {
        const dateString = matchingDay.toISOString().split('T')[0];
        acc[dateString] = (acc[dateString] || 0) + 1;
      }
      return acc;
    }, {});

    return last7Days.map(date => ({
      date: date.toISOString().split('T')[0],
      activities: countMap[date.toISOString().split('T')[0]] || 0
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Activities for {projectTitle}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Activity Over Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="activities" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {activities.length > 0 ? (
              <ul className="space-y-2 mt-4 max-h-60 overflow-y-auto">
                {activities.map((activity, index) => (
                  <li
                    key={index}
                    className="p-3 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        activity.createdAt._seconds * 1000
                      ).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">User: {activity.user}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-4">
                No activities found for this project.
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ActivityDialog;

