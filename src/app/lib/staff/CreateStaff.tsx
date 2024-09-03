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

interface CreateStaffProps {
  getStaff: () => void;
}

export type StaffData = {
  staff_id: string;
  mobile_number: string;
  name: string;
  role: string;
  college_name: string;
};

const CreateStaff: React.FC<CreateStaffProps> = ({ getStaff }) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newStaffData, setNewStaffData] = useState<StaffData>({
    staff_id: "",
    mobile_number: "",
    name: "",
    role: "",
    college_name: "",
  });

  const handleCreateStaff = async () => {
    try {
      await axiosInstance.post(`bulk-add-staff/`, [newStaffData]);
      setNewStaffData({
        staff_id: "",
        mobile_number: "",
        name: "",
        role: "",
        college_name: "",
      });
      setShowCreateModal(false); // Close the modal after creating staff
      getStaff();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Button to open the create staff modal */}
      <Button variant="contained" onClick={() => setShowCreateModal(true)}>
        Create New Staff
      </Button>

      {/* Create staff modal */}
      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Staff</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextField
              label="Staff ID"
              value={newStaffData.staff_id}
              onChange={(e) =>
                setNewStaffData({
                  ...newStaffData,
                  staff_id: e.target.value,
                })
              }
              sx={{ marginTop: "1rem" }}
            />
            <TextField
              label="Mobile Number"
              value={newStaffData.mobile_number}
              onChange={(e) =>
                setNewStaffData({
                  ...newStaffData,
                  mobile_number: e.target.value,
                })
              }
            />
            <TextField
              label="Name"
              value={newStaffData.name}
              onChange={(e) =>
                setNewStaffData({ ...newStaffData, name: e.target.value })
              }
            />
            <TextField
              label="Role"
              value={newStaffData.role}
              onChange={(e) =>
                setNewStaffData({
                  ...newStaffData,
                  role: e.target.value,
                })
              }
            />
            <TextField
              label="College Name"
              value={newStaffData.college_name}
              onChange={(e) =>
                setNewStaffData({
                  ...newStaffData,
                  college_name: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateStaff}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateStaff;
