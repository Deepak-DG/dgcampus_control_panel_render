"use client";

import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";

type SummaryData = {
  user_count: number;
  address_count: number;
  pincode_count: number;
  selected_pincode_count: number;
  service_count: number;
  selected_service_count: number;
  subscription_count: number;
  pickup_schedule_count: number;
  selected_subscription_count: number;
  confirm_subscription_count: number;
  payment_count: number;
};

const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get("pack/summary/");
        setSummary(response.data);
        setLoading(false);
      } catch (error) {
        console.log(JSON.stringify(error));
        setError("Failed to fetch summary data");
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Summary</h1>
      {summary && (
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl">{summary.user_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Addresses</h2>
            <p className="text-2xl">{summary.address_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Pincodes</h2>
            <p className="text-2xl">{summary.pincode_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Selected Pincodes</h2>
            <p className="text-2xl">{summary.selected_pincode_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Services</h2>
            <p className="text-2xl">{summary.service_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Selected Services</h2>
            <p className="text-2xl">{summary.selected_service_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Subscriptions</h2>
            <p className="text-2xl">{summary.subscription_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Pickup Schedules</h2>
            <p className="text-2xl">{summary.pickup_schedule_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              Total Selected Subscriptions
            </h2>
            <p className="text-2xl">{summary.selected_subscription_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              Total Confirm Subscriptions
            </h2>
            <p className="text-2xl">{summary.confirm_subscription_count}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Total Payments</h2>
            <p className="text-2xl">{summary.payment_count}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
