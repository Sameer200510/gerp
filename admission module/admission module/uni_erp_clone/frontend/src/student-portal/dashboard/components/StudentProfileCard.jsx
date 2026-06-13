import React from "react";
import { UserCircle } from "lucide-react";

const StudentProfileCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col items-center">
        <UserCircle size={80} className="text-blue-500" />

        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          Student Name
        </h3>

        <p className="text-sm text-gray-500">STU001</p>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Course</span>

          <span className="font-medium">B.Tech CSE</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Semester</span>

          <span className="font-medium">5</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Section</span>

          <span className="font-medium">A</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>

          <span className="text-green-600 font-medium">Active</span>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;
