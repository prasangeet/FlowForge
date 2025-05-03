"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationDialog({open, onOpenChange}) {

  const dummyNotifications = [
    {
      title: "Project Update",
      body: "Your project proposal has been approved.",
      read: false,
    },
    {
      title: "New Task Assigned",
      body: "You have a new task in the Design Engineering project.",
      read: true,
    },
    {
      title: "Reminder",
      body: "Don’t forget to submit your report by tomorrow.",
      read: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>Latest updates for you</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-60 w-full pr-4">
          <div className="space-y-4">
            {dummyNotifications.map((notification, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg shadow-sm ${
                  notification.read ? "bg-white" : "bg-blue-50"
                }`}
              >
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.body}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
