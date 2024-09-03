import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { useState } from "react";
import { Button } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

interface BulkUploadStaffProps {
  getStaff: () => void;
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

const BulkUploadStaff: React.FC<BulkUploadStaffProps> = ({ getStaff }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [test, setTest] = useState<any>(null);

  const fields: Field[] = [
    {
      label: "Staff ID",
      key: "staff_id",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Staff ID is required",
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
      label: "Role",
      key: "role",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Role is required",
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
  ];

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (data: { validData: any[] }, file: File) => {
    // Handle submitted data here
    axiosInstance
      .post(`bulk-add-staff/`, data.validData)
      .then((response) => {
        setTest(response.data);
        getStaff();
      })
      .catch((error) => {
        console.error(error);
        setTest(error);
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Bulk Upload Staff Data
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

export default BulkUploadStaff;