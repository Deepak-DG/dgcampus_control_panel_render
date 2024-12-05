import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

interface EditRolesDialogProps {
  open: boolean;
  onClose: () => void;
  staffId: number;
  initialRoles: string[]; // Ensure this is always an array of strings
  rolesOptions: string[];
  onSave: () => void;
}

const EditRolesDialog: React.FC<EditRolesDialogProps> = ({
  open,
  onClose,
  staffId,
  initialRoles,
  rolesOptions,
  onSave,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles);

  React.useEffect(() => {
    setSelectedRoles(initialRoles);
  }, [initialRoles]);

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    try {
      await axiosInstance.patch(`staff/${staffId}/`, { roles: selectedRoles });
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Roles</DialogTitle>
      <DialogContent>
        {rolesOptions.map((role) => (
          <FormControlLabel
            key={role}
            control={
              <Checkbox
                checked={selectedRoles.includes(role)}
                onChange={() => handleRoleChange(role)}
              />
            }
            label={role}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRolesDialog;
