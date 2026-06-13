import React from "react";
import DashboardStatsCard from "../components/DashboardStatsCard";
import StudentProfileCard from "../components/StudentProfileCard";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white shadow-md">
        <h2 className="text-3xl font-bold">Welcome Back, Student 👋</h2>

        <p className="mt-2 text-blue-100">University ERP Dashboard</p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatsCard title="Attendance" value="89%" color="green" />

        <DashboardStatsCard title="CGPA" value="8.65" color="blue" />

        <DashboardStatsCard title="Fee Due" value="₹0" color="amber" />

        <DashboardStatsCard title="Documents" value="6/6" color="purple" />
      </div>

      {/* Main Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudentProfileCard />

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Announcements</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Mid Semester Examination</h4>

              <p className="text-sm text-gray-500">
                Examination schedule will be released next week.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Placement Drive</h4>

              <p className="text-sm text-gray-500">
                TCS and Infosys campus drive registration open.
              </p>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-medium">Fee Submission</h4>

              <p className="text-sm text-gray-500">
                Last date for fee submission is 15th June.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Access</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Academic
          </button>

          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Fees
          </button>

          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Documents
          </button>

          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
