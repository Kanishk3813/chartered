// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LoanApplication {
  id: string;
  type: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "in_review";
  appliedDate: string;
  lastUpdated: string;
}

export default function Dashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    setTimeout(() => {
      setApplications([
        {
          id: "LOAN2025031701",
          type: "personal",
          amount: 250000,
          status: "in_review",
          appliedDate: "2025-03-12",
          lastUpdated: "2025-03-15",
        },
        {
          id: "LOAN2025022801",
          type: "home",
          amount: 3500000,
          status: "approved",
          appliedDate: "2025-02-28",
          lastUpdated: "2025-03-10",
        },
        {
          id: "LOAN2025010502",
          type: "education",
          amount: 800000,
          status: "rejected",
          appliedDate: "2025-01-05",
          lastUpdated: "2025-01-10",
        },
      ]);
      setUserName("Rahul Singh");
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "in_review":
        return "In Review";
      default:
        return "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="bg-blue-600 text-white rounded-xl p-6 mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">
                      Welcome back, {userName}
                    </h1>
                    <p className="text-blue-100">
                      Here's an overview of your loan applications
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link
                      href="/loan-application"
                      className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      Apply for New Loan
                    </Link>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Your Applications</h2>

              {applications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    You don't have any loan applications yet.
                  </p>
                  <Link
                    href="/loan-application"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Apply for a Loan
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Application ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loan Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount (₹)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applied Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((application) => (
                          <tr key={application.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {application.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                              {application.type} Loan
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              ₹{application.amount.toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  application.status
                                )}`}
                              >
                                {getStatusText(application.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(
                                application.appliedDate
                              ).toLocaleDateString("en-IN")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/eligibility-result/${application.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-3">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Document verification completed
                        </p>
                        <p className="text-xs text-gray-500">March 15, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Home loan approved
                        </p>
                        <p className="text-xs text-gray-500">March 10, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Additional verification required
                        </p>
                        <p className="text-xs text-gray-500">March 5, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/loan-application"
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600 mb-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        New Application
                      </span>
                    </Link>
                    <Link
                      href="/documents"
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600 mb-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        Upload Documents
                      </span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600 mb-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        Update Profile
                      </span>
                    </Link>
                    <Link
                      href="/support"
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-600 mb-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        Contact Support
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Loan Eligibility Status
                </h3>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={`status-${application.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {application.type.charAt(0).toUpperCase() +
                            application.type.slice(1)}{" "}
                          Loan
                        </p>
                        <p className="text-sm text-gray-600">
                          Application ID: {application.id}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <div
                          className={`h-2 w-24 rounded-full ${
                            application.status === "approved"
                              ? "bg-green-500"
                              : application.status === "rejected"
                              ? "bg-red-500"
                              : application.status === "in_review"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {application.status === "approved"
                            ? "100%"
                            : application.status === "rejected"
                            ? "0%"
                            : application.status === "in_review"
                            ? "75%"
                            : "25%"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
