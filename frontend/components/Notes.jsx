// src/components/Notes.js
'use client'

import React, { useState } from "react";

function Notes() {
  const [note, setNote] = useState("");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  return (
    <div className="fixed bottom-8 right-8 w-80 bg-white shadow-lg p-4 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700">Notes</h3>
      <textarea
        value={note}
        onChange={handleNoteChange}
        placeholder="Write your note here..."
        className="w-full h-40 p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

export default Notes;
