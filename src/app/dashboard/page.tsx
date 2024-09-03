"use client";

import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";

import { mkConfig, generateCsv, download } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import StaffPerformance from "../components/dashboard/StaffPerformance";
import HostelSlotCount from "../components/dashboard/HostelSlotCount";

type SummaryData = {
  total_colleges: number;
  total_hostels: number;
  total_rooms: number;
  total_slots: number;
  total_users: number;
  total_students: number;
  total_staff: number;
  total_orders: number;
  total_whatsapp_message_logs: number;
  total_washing_details: number;
  total_folding_details: number;
  total_ironing_details: number;
  total_pre_booked_orders: number; // Add these lines
  total_picked_up_orders: number; // Add these lines
  total_pickup_not_done_orders: number; // Add these lines
  total_washing_started_orders: number; // Add these lines
  total_folding_done_orders: number; // Add these lines
  total_ready_to_deliver_orders: number; // Add these lines
  total_delivered_orders: number; // Add these lines
  total_hold_orders: number; // Add these lines
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
            <h2 className="text-lg font-semibold">Total Staff</h2>
            <p className="text-2xl">{summary.total_staff}</p>
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

      <div className="m-4">
        <Button
          onClick={fetchAndDownloadData}
          variant="contained"
          color="primary"
          startIcon={<FileDownloadIcon />}
        >
          Hostel Room Occupancy
        </Button>
      </div>
      {/* <button
        onClick={fetchAndDownloadData}
        style={{
          backgroundColor: "#1976d2", // MUI primary color
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <FileDownloadIcon style={{ marginRight: "8px" }} />
        Hostel Room Occupancy
      </button> */}
    </div>
  );
};

export default Dashboard;
