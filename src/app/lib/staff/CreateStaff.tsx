import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  Autocomplete,
} from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

interface CreateStaffProps {
  getStaff: () => void;
}

export type StaffData = {
  staff_id: string;
  mobile_number: string;
  name: string;
  roles: string[]; // Array of roles
  college_name: string;
};

export type Role = {
  name: string;
};

const CreateStaff: React.FC<CreateStaffProps> = ({ getStaff }) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newStaffData, setNewStaffData] = useState<StaffData>({
    staff_id: "",
    mobile_number: "",
    name: "",
    roles: [], // Initialize as an empty array
    college_name: "",
  });
  const [availableRoles, setAvailableRoles] = useState<string[]>([]); // Store fetched roles

  // Function to fetch available roles
  const getRoles = async () => {
    try {
      const response = await axiosInstance.get("roles?page_size=100");
      setAvailableRoles(response.data.results.map((item: Role) => item.name));
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch roles on component mount
  useEffect(() => {
    getRoles();
  }, []);

  const handleCreateStaff = async () => {
    try {
      // Backend expects roles to be sent as an array, and the staff data in a list
      await axiosInstance.post(`bulk-add-staff/`, [newStaffData]);
      setNewStaffData({
        staff_id: "",
        mobile_number: "",
        name: "",
        roles: [],
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
            {/* Role selector */}
            <Autocomplete
              multiple
              options={availableRoles}
              getOptionLabel={(option) => option}
              value={newStaffData.roles}
              onChange={(event, newValue) => {
                setNewStaffData((prev) => ({
                  ...prev,
                  roles: newValue,
                }));
              }}
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })} // 'key' will be provided by getTagProps
                    color="primary"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Roles" />
              )}
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
