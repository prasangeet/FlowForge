"use client";

import React, { useState } from "react";
import { Users, Trash2, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AddMembers from "@/components/AddMembers";
import ConfirmRemoveUserDialog from "@/components/ConfirmRemoveUserDialog";
import { removeUser } from "@/app/utilities/projectUtils";
import { fetchProjectById } from "@/app/utilities/projectUtils";

const TeamMembers = ({ 
  projectId, 
  projectDetails, 
  currentUserId, 
  refreshData,
  isAdmin
}) => {
  const [isRemoveUserDialogOpen, setIsRemoveUserDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  const handleRemoveUser = async (userId) => {
    setUserToRemove(projectDetails.users.find((user) => user.id === userId));
    setIsRemoveUserDialogOpen(true);
  };

  const confirmRemoveUser = async () => {
    try {
      const success = await removeUser(projectId, userToRemove.id);
      if (success) {
        refreshData();
        toast.success("User removed from the project successfully!");
        setIsRemoveUserDialogOpen(false);
      }
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user from the project.");
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "viewer":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between border-b p-4"
      >
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Team</h2>
        </div>
        {isAdmin && (
          <AddMembers
            projectId={projectId}
            existingMembers={projectDetails.users}
            onSuccess={refreshData}
          />
        )}
      </motion.div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          <AnimatePresence>
            {projectDetails.users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group"
              >
                <div className="flex items-center justify-between gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={user.profilePicture} alt={user.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        {user.fullName ? user.fullName[0].toUpperCase() : '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{user.fullName}</p>
                        {user.role === "admin" && (
                          <Shield className="h-3.5 w-3.5 text-purple-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                      {user.role}
                    </Badge>
                    
                    {isAdmin && currentUserId !== user.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {(!projectDetails.users || projectDetails.users.length === 0) && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Users className="h-10 w-10 mb-2" />
              <p>No team members found</p>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmRemoveUserDialog
        isOpen={isRemoveUserDialogOpen}
        setIsOpen={setIsRemoveUserDialogOpen}
        onConfirm={confirmRemoveUser}
        userName={userToRemove?.fullName || ""}
      />
    </div>
  );
};

export default TeamMembers;