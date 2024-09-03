import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { useState } from "react";
import { Button } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

interface BulkUploadStudentProps {
  getStudents: () => void;
}

export type Field = {
  label: string;
  key: string;
  fieldType: {
    type: string;
  };
  validations: {
    rule: string;
    errorMessage: string;
  }[];
}

const BulkUploadStudent: React.FC<BulkUploadStudentProps> = ({ getStudents }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [test, setTest] = useState<any>(null);

  const fields: Field[] = [
    {
      label: "Registration Number",
      key: "registration_number",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Registration Number is required",
        },
      ],
    },
    {
      label: "Mobile Number",
      key: "mobile_number",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Mobile Number is required",
        },
      ],
    },
    {
      label: "Name",
      key: "name",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Name is required",
        },
      ],
    },
    {
      label: "Room Number",
      key: "room_number",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Room Number is required",
        },
      ],
    },
    {
      label: "Hostel Name",
      key: "hostel_name",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Hostel Name is required",
        },
      ],
    },
    
    {
      label: "College Name",
      key: "college_name",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "College Name is required",
        },
      ],
    },
    {
      label: "Email",
      key: "email",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Email is required",
        },
        {
          rule: "email",
          errorMessage: "Invalid email format",
        },
      ],
    },
  ];

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (data: { validData: any[] }, file: File) => {
    // Handle submitted data here
    axiosInstance
      .post(`bulk-add-students/`, data.validData)
      .then((response) => {
        setTest(response.data);
        getStudents();
      })
      .catch((error) => {
        console.error(error);
        setTest(error);
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Bulk Upload Student Data
      </Button>
      <ReactSpreadsheetImport
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        fields={fields}
      />
    </div>
  );
}

export default BulkUploadStudent;
