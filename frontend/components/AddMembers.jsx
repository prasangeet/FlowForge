import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import React from "react";
import AddMembersDialog from "./AddMembersDialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

function AddMembers({ projectId, existingMembers }) {
  return (
    <>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-9 h-9 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <AddMembersDialog
        projectId={projectId}
        existingMembers={existingMembers}
      />
    </>
  );
}

export default AddMembers;
