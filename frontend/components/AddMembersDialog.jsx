"use client";

import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, Loader2 } from 'lucide-react';
import toast from "react-hot-toast";
import { addMembers, searchMembers } from "@/app/utilities/projectUtils";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function AddMembersDialog({ projectId, existingMembers }) {
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const roles = ["admin", "user", "guest"];  

  const handleSearch = async (e) => {
    const value = e.target.value;
    setUsername(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const users = await searchMembers(value, existingMembers);
      setSearchResults(users);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Failed to search for users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleAddMember = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Please select a user and role.");
      return;
    }

    setIsAdding(true);
    try {
      await addMembers(projectId, selectedUser.username, selectedRole);
      toast.success("Member added successfully!");
      setSelectedUser(null);
      setSelectedRole("");
      setUsername("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error(error?.response?.data?.message || "Failed to add member");
    } finally {
      setIsAdding(false);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleAddMember();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Add Members</DialogTitle>
        <DialogDescription className="text-gray-500">
          Search for a user by username and assign a role.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="username"
                value={username}
                onChange={handleSearch}
                className="pr-10"
                placeholder="Search for username"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin text-gray-400" />
              )}
            </div>
          </div>

          {searchResults.length > 0 && (
            <ScrollArea className="h-[200px] rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Search Results</h4>
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={`flex items-center space-x-4 w-full p-2 rounded-lg transition-colors ${
                      selectedUser?.id === user.id
                        ? "bg-blue-100 text-blue-900"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profilePicture} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedRole || "Select Role"}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onSelect={() => handleRoleSelect(role)}
                    className="capitalize"
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!selectedUser || !selectedRole || isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Member"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default AddMembersDialog;

