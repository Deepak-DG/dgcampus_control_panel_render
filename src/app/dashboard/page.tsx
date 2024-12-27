"use client";

import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";

import { mkConfig, generateCsv, download } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import StaffPerformance from "../lib/dashboard/StaffPerformance";
import HostelSlotCount from "../lib/dashboard/HostelSlotCount";
import HostelOrderLimit from "../lib/dashboard/HostelOrderLimit";

type SummaryData = {
  total_colleges: number;
  total_hostels: number;
  total_rooms: number;
  total_slots: number;
  total_users: number;
  total_students: number;
  total_otp: number;
  total_student_auth_whatsapp_log: number;
  total_staff: number;
  total_roles: number; // New field
  total_hostel_order_limit: number; // New field
  total_orders: number;
  total_whatsapp_message_logs: number;
  total_washing_details: number;
  total_folding_details: number;
  total_ironing_details: number;
  total_staff_errors: number; // New field
  total_order_ratings: number; // New field
  total_money_found_logs: number; // New field
  total_pre_booked_orders: number;
  total_picked_up_orders: number;
  total_pickup_not_done_orders: number;
  total_washing_started_orders: number;
  total_folding_done_orders: number;
  total_ready_to_deliver_orders: number;
  total_delivered_orders: number;
  total_hold_orders: number;
};

const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get("admin/summary/");
        setSummary(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching summary data:", error);
        setError(
          error.response?.data?.message || "Failed to fetch summary data"
        );
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);
  const fetchAndDownloadData = async () => {
    try {
      const response = await axiosInstance.get(
        "https://campus.dhobig.com/api/students-count-room-hostel/"
      );
      const data = response.data;

      // Configure CSV options
      const config = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true, // Use the object keys as headers in CSV
      });

      const csvContent = generateCsv(config)(data);
      download(config)(csvContent);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 ">Dashboard Summary</h1>
      {summary && (
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow ">
            <h2 className="text-lg font-semibold ">Total Colleges</h2>
            <p className="text-2xl">{summary.total_colleges}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Hostels</h2>
            <p className="text-2xl">{summary.total_hostels}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800  rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Rooms</h2>
            <p className="text-2xl">{summary.total_rooms}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Slots</h2>
            <p className="text-2xl">{summary.total_slots}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl">{summary.total_users}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Students</h2>
            <p className="text-2xl">{summary.total_students}</p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total OTP</h2>
            <p className="text-2xl">{summary.total_otp}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              Total Student Auth Whatsapp Log
            </h2>
            <p className="text-2xl">
              {summary.total_student_auth_whatsapp_log}
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Staff</h2>
            <p className="text-2xl">{summary.total_staff}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Roles</h2>
            <p className="text-2xl">{summary.total_roles}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Hostel Order Limit</h2>
            <p className="text-2xl">{summary.total_hostel_order_limit}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-2xl">{summary.total_orders}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              Total WhatsApp Message Logs
            </h2>
            <p className="text-2xl">{summary.total_whatsapp_message_logs}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Washing Details</h2>
            <p className="text-2xl">{summary.total_washing_details}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Folding Details</h2>
            <p className="text-2xl">{summary.total_folding_details}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Ironing Details</h2>
            <p className="text-2xl">{summary.total_ironing_details}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Staff Errors</h2>
            <p className="text-2xl">{summary.total_staff_errors}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Order Ratings</h2>
            <p className="text-2xl">{summary.total_order_ratings}</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Money Found Logs</h2>
            <p className="text-2xl">{summary.total_money_found_logs}</p>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold my-4 ">Orders</h1>

      {summary && (
        <div className="grid grid-cols-4 gap-4 dark:text-black">
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Pre-booked Orders</h2>
            <p className="text-2xl">{summary.total_pre_booked_orders}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Picked-up Orders</h2>
            <p className="text-2xl">{summary.total_picked_up_orders}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Pickup Not Done Orders</h2>
            <p className="text-2xl">{summary.total_pickup_not_done_orders}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Washing Started Orders</h2>
            <p className="text-2xl">{summary.total_washing_started_orders}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Folding Done Orders</h2>
            <p className="text-2xl">{summary.total_folding_done_orders}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Ready to Deliver Orders</h2>
            <p className="text-2xl">{summary.total_ready_to_deliver_orders}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Delivered Orders</h2>
            <p className="text-2xl">{summary.total_delivered_orders}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Hold Orders</h2>
            <p className="text-2xl">{summary.total_hold_orders}</p>
          </div>
        </div>
      )}
      <HostelSlotCount />

      <HostelOrderLimit />

      <div className="m-4">
        <Button
          onClick={fetchAndDownloadData}
          variant="contained"
          color="primary"
          startIcon={<FileDownloadIcon />}
        >
          Hostel Room˚ Occupancy
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
