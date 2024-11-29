import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

interface CreateHostelOrderLimitProps {
  getHostelOrderLimits: () => void;
}

export type HostelOrderLimitData = {
  hostel_name: string;
  college_name: string;
  date: string;
  max_orders: string;
  current_order_count: string;
};

const CreateHostelOrderLimit: React.FC<CreateHostelOrderLimitProps> = ({
  getHostelOrderLimits,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newOrderLimitData, setNewOrderLimitData] = useState<HostelOrderLimitData>({
    hostel_name: "",
    college_name: "",
    date: "",
    max_orders: "",
    current_order_count: "",
  });

  const handleCreateHostelOrderLimit = async () => {
    try {
      await axiosInstance.post(`bulk-upload/hostel-order-limits/`, [newOrderLimitData]);
      setNewOrderLimitData({
        hostel_name: "",
        college_name: "",
        date: "",
        max_orders: "",
        current_order_count: "",
      });
      setShowCreateModal(false); // Close the modal after creating
      getHostelOrderLimits();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Button to open the create hostel order limit modal */}
      <Button variant="contained" onClick={() => setShowCreateModal(true)}>
        Create Hostel Order Limit
      </Button>

      {/* Create hostel order limit modal */}
      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Hostel Order Limit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextField
              label="Hostel Name"
              value={newOrderLimitData.hostel_name}
              onChange={(e) =>
                setNewOrderLimitData({
                  ...newOrderLimitData,
                  hostel_name: e.target.value,
                })
              }
              sx={{ marginTop: "1rem" }}
            />
            <TextField
              label="College Name"
              value={newOrderLimitData.college_name}
              onChange={(e) =>
                setNewOrderLimitData({
                  ...newOrderLimitData,
                  college_name: e.target.value,
                })
              }
            />
            <TextField
              label="Date"
              type="date"
              value={newOrderLimitData.date}
              onChange={(e) => {
                const inputDate = e.target.value;
                const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(inputDate); // Regex to ensure format yyyy-mm-dd
                if (isValidDate) {
                  setNewOrderLimitData({
                    ...newOrderLimitData,
                    date: inputDate,
                  });
                }
              }}
              InputLabelProps={{ shrink: true }}
              error={!/^\d{4}-\d{2}-\d{2}$/.test(newOrderLimitData.date)}
              helperText={
                !/^\d{4}-\d{2}-\d{2}$/.test(newOrderLimitData.date)
                  ? "Please enter a valid date (yyyy-mm-dd)."
                  : ""
              }
            />

            <TextField
              label="Max Orders"
              type="number"
              value={newOrderLimitData.max_orders}
              onChange={(e) =>
                setNewOrderLimitData({
                  ...newOrderLimitData,
                  max_orders: e.target.value,
                })
              }
            />
            <TextField
              label="Current Order Count"
              type="number"
              value={newOrderLimitData.current_order_count}
              onChange={(e) =>
                setNewOrderLimitData({
                  ...newOrderLimitData,
                  current_order_count: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateHostelOrderLimit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateHostelOrderLimit;
