"use client";

import axiosInstance from "@/api/axiosInstance";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

type StaffPerformanceData = {
  name: string;
  role: string;
  orders_processed: number;
  total_clothes_washed?: number;
  total_clothes_folded?: number;
  total_clothes_ironed?: number;
  unique_days: number;
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StaffPerformance = () => {
  const [staffPerformance, setStaffPerformance] = useState<
    StaffPerformanceData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchStaffPerformance = async () => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);

        const response = await axiosInstance.get(
          `staff-performance/?${params.toString()}`
        );
        const data = response.data;

        if (Array.isArray(data)) {
          setStaffPerformance(data);
        } else {
          setError("Unexpected data format");
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching staff performance data:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch staff performance data"
        );
        setLoading(false);
      }
    };

    fetchStaffPerformance();
  }, [startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const washingStaff = staffPerformance.filter(
    (staff) => staff.role === "Washing"
  );
  const foldingStaff = staffPerformance.filter(
    (staff) => staff.role === "Folding"
  );
  const ironingStaff = staffPerformance.filter(
    (staff) => staff.role === "Ironing"
  );

  const generateChartData = (
    staff: StaffPerformanceData[],
    clothesType: string
  ) => {
    return {
      labels: staff.map((staff) => staff.name),
      datasets: [
        {
          label: `Orders Processed`,
          data: staff.map((staff) => staff.orders_processed),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: `Total Clothes ${clothesType}`,
          data: staff.map((staff) =>
            clothesType === "Washed"
              ? staff.total_clothes_washed ?? 0
              : clothesType === "Folded"
              ? staff.total_clothes_folded ?? 0
              : staff.total_clothes_ironed ?? 0
          ),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Performance</h1>

      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mr-4 p-2 border rounded"
        />

        <label className="mr-2 ">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Washing Section */}
      {washingStaff.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Washing Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:text-black">
            {washingStaff.map((staff) => (
              <div
                key={staff.name}
                className="p-4 bg-green-100 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold">{staff.name}</h3>
                <p className="text-2xl">
                  Orders Processed: {staff.orders_processed}
                </p>
                <p className="text-lg">
                  Total Clothes Washed: {staff.total_clothes_washed ?? 0}
                </p>
                <p className="text-lg">
                  Number of Days: {staff.unique_days ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Folding Section */}
      {foldingStaff.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Folding Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:text-black">
            {foldingStaff.map((staff) => (
              <div
                key={staff.name}
                className="p-4 bg-yellow-100 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold">{staff.name}</h3>
                <p className="text-2xl">
                  Orders Processed: {staff.orders_processed}
                </p>
                <p className="text-lg">
                  Total Clothes Folded: {staff.total_clothes_folded ?? 0}
                </p>
                <p className="text-lg">
                  Number of Days: {staff.unique_days ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ironing Section */}
      {ironingStaff.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Ironing Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:text-black">
            {ironingStaff.map((staff) => (
              <div
                key={staff.name}
                className="p-4 bg-blue-100 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold">{staff.name}</h3>
                <p className="text-2xl">
                  Orders Processed: {staff.orders_processed}
                </p>
                <p className="text-lg">
                  Total Clothes Ironed: {staff.total_clothes_ironed ?? 0}
                </p>
                <p className="text-lg">
                  Number of Days: {staff.unique_days ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Washing Section */}
      {washingStaff.length > 0 && (
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-2">Washing Staff</h2>
          <Bar data={generateChartData(washingStaff, "Washed")} />
        </div>
      )}

      {/* Folding Section */}
      {foldingStaff.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Folding Staff</h2>
          <Bar data={generateChartData(foldingStaff, "Folded")} />
        </div>
      )}

      {/* Ironing Section */}
      {ironingStaff.length >= 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Ironing Staff</h2>
          <Bar data={generateChartData(ironingStaff, "Ironed")} />
        </div>
      )}
    </div>
  );
};

export default StaffPerformance;
