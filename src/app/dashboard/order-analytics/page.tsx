// src/app/dashboard/order-analytics/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import "chart.js/auto";

import axiosInstance from "@/api/axiosInstance";

interface OrderStatus {
  order_status: string;
  count: number;
}

interface OrdersByRoom {
  room__room_number: string;
  room__hostel__hostel_name: string;
  count: number;
}

interface OrdersByHostel {
  room__hostel__hostel_name: string;
  count: number;
}

interface OrdersData {
  status_distribution: OrderStatus[];
  orders_by_room: OrdersByRoom[];
  orders_by_hostel: OrdersByHostel[];
}

const OrdersPage = () => {
  const [data, setData] = useState<OrdersData | null>(null);
  const [deliveredCount, setDeliveredCount] = useState<number>(0);
  const [pickupNotDoneCount, setPickupNotDoneCount] = useState<number>(0);

  // Custom order for statuses
  const statusOrder = [
    "pre_booked",
    "picked_up",
    "washing_started",
    "folding_done",
    "ironing_done",
    "ready_to_deliver",
    "hold",
  ];

  useEffect(() => {
    axiosInstance
      .get<OrdersData>("analytics/orders/")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        // Separate out "Delivered" status
        const deliveredStatus = response.data.status_distribution.find(
          (status) => status.order_status === "delivered"
        );
        const pickupNotDoneStatus = response.data.status_distribution.find(
          (status) => status.order_status === "pickup_not_done"
        );

        if (deliveredStatus) {
          setDeliveredCount(deliveredStatus.count);
        }
        if (pickupNotDoneStatus) {
          setPickupNotDoneCount(pickupNotDoneStatus.count);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Filter out "Delivered" and sort by custom order
  const sortedStatusDistribution = data.status_distribution
    .filter(
      (status) =>
        status.order_status !== "delivered" &&
        status.order_status !== "pickup_not_done"
    )
    .sort(
      (a, b) =>
        statusOrder.indexOf(a.order_status) -
        statusOrder.indexOf(b.order_status)
    );

  // Chart data after sorting by custom order
  const statusDataWithoutDelivered: ChartData<"doughnut"> = {
    labels: sortedStatusDistribution.map((status) => status.order_status),
    datasets: [
      {
        label: "Order Status Count",
        data: sortedStatusDistribution.map((status) => status.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // DataGrid setup for Orders by Hostel
  const ordersByHostelColumns: GridColDef[] = [
    {
      field: "room__hostel__hostel_name",
      headerName: "Hostel Name",
      width: 200,
    },
    { field: "count", headerName: "Count", width: 100 },
  ];

  const ordersByHostelRows: GridRowsProp = data.orders_by_hostel.map(
    (hostel) => ({
      id: hostel.room__hostel__hostel_name,
      ...hostel,
    })
  );

  // DataGrid setup for Orders by Room
  const ordersByRoomColumns: GridColDef[] = [
    { field: "room__room_number", headerName: "Room Number", width: 150 },
    {
      field: "room__hostel__hostel_name",
      headerName: "Hostel Name",
      width: 150,
    },
    { field: "count", headerName: "Count", width: 100 },
  ];

  const ordersByRoomRows: GridRowsProp = data.orders_by_room.map((room) => ({
    id: room.room__room_number,
    ...room,
  }));

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Orders Dashboard
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* Order Status Distribution Chart */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6" align="center" gutterBottom>
              Order Status Distribution (Excluding Delivered)
            </Typography>
            <Box height={300}>
              <Doughnut data={statusDataWithoutDelivered} />
            </Box>
          </Paper>
        </Grid>

        {/* Delivered Status Count */}
        <Grid item xs={12} md={4}>
          <Grid
            container
            spacing={4}
            // justifyContent="center"
            // alignItems="flex-start"
          >
            {/* Orders by Hostel */}
            <Grid item xs={12} md={12}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h6" gutterBottom>
                  Delivered Orders
                </Typography>
                <Typography variant="h4" color="primary">
                  {deliveredCount}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
              <Paper
                elevation={3}
                style={{ padding: "20px", textAlign: "center" }}
              >
                <Typography variant="h6" gutterBottom>
                  Pickup Not Done Orders
                </Typography>
                <Typography variant="h4" color="primary">
                  {pickupNotDoneCount}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Orders by Hostel and Orders by Room in one row */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {/* Orders by Hostel */}
            <Grid item xs={12} md={5}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h6" align="center" gutterBottom>
                  Orders by Hostel
                </Typography>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={ordersByHostelRows}
                    columns={ordersByHostelColumns}
                    getRowId={
                      (row) =>
                        row.room__hostel__hostel_name || row.count
                          ? `${
                              row.room__hostel__hostel_name || "unknown-hostel"
                            }-${row.count || "0"}`
                          : `hostel-${Math.random()}` // Fallback using a random number if necessary
                    }
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    // disableSelectionOnClick
                  />
                </div>
              </Paper>
            </Grid>

            {/* Orders by Room */}
            <Grid item xs={12} md={7}>
              <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h6" align="center" gutterBottom>
                  Orders by Room
                </Typography>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={ordersByRoomRows}
                    columns={ordersByRoomColumns}
                    getRowId={
                      (row) =>
                        row.room__room_number || row.count
                          ? `${row.room__room_number || "unknown-room"}-${
                              row.count || "0"
                            }`
                          : `room-${Math.random()}` // Fallback using a random number if necessary
                    }
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    // disableSelectionOnClick
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrdersPage;
