import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";
import AddMembersDialog from "./AddMembersDialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";


function AddMembers({ projectId, existingMembers }) {
  return (
    <>
      <DialogTrigger>
        <div
          variant="outline"
          size="sm"
          onClick = {() => {}}
          className="border w-9 flex justify-center items-center h-9 hover:bg-gray-100 transition-colors duration-200 rounded-md"
        >
          <Plus className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <AddMembersDialog
        projectId={projectId}
        existingMembers={existingMembers}
      />
    </>
  );
}

export default AddMembers;
