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

interface CreateStudentProps {
  getStudents: () => void;
}

export type StudentData = {
  registration_number: string;
  mobile_number: string;
  name: string;
  room_number: string;
  hostel_name: string;
  college_name: string,
  email: string;
};

const CreateStudent: React.FC<CreateStudentProps> = ({ getStudents }) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newStudentData, setNewStudentData] = useState<StudentData>({
    registration_number: "",
    mobile_number: "",
    name: "",
    room_number: "",
    hostel_name: "",
    college_name: "",
    email: "",
  });

  const handleCreateStudent = async () => {
    try {
      await axiosInstance.post(`bulk-add-students/`, [newStudentData]);
      setNewStudentData({
        registration_number: "",
        mobile_number: "",
        name: "",
        room_number: "",
        hostel_name: "",
        college_name: "",
        email: "",
      });
      setShowCreateModal(false); // Close the modal after creating student
      getStudents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Button to open the create student modal */}
      <Button variant="contained" onClick={() => setShowCreateModal(true)}>
        Create New Student
      </Button>

      {/* Create student modal */}
      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Student</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextField
              label="Registration Number"
              value={newStudentData.registration_number}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  registration_number: e.target.value,
                })
              }
              sx={{ marginTop: "1rem" }}
            />
            <TextField
              label="Mobile Number"
              value={newStudentData.mobile_number}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  mobile_number: e.target.value,
                })
              }
            />
            <TextField
              label="Name"
              value={newStudentData.name}
              onChange={(e) =>
                setNewStudentData({ ...newStudentData, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              value={newStudentData.email}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  email: e.target.value,
                })
              }
            />
            <TextField
              label="Room Number"
              value={newStudentData.room_number}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  room_number: e.target.value,
                })
              }
            />
            <TextField
              label="Hostel Name"
              value={newStudentData.hostel_name}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  hostel_name: e.target.value,
                })
              }
            />
            <TextField
              label="College Name"
              value={newStudentData.college_name}
              onChange={(e) =>
                setNewStudentData({
                  ...newStudentData,
                  college_name: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateStudent}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateStudent;
