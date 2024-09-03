import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { useState } from "react";
import { Button } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";

interface BulkUploadSlotProps {
  getSlots: () => void;
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

const BulkUploadSlot: React.FC<BulkUploadSlotProps> = ({ getSlots }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [test, setTest] = useState<any>(null);

  const fields: Field[] = [
    {
      label: "Date",
      key: "date",
      fieldType: {
        type: "input",
      },
      validations: [
        {
          rule: "required",
          errorMessage: "Date is required",
        },
        {
          rule: "date",
          errorMessage: "Invalid date format",
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
  ];

  const onClose = () => {
    setIsOpen(false);
  };

  const onSubmit = (data: { validData: any[] }, file: File) => {
    // Handle submitted data here
    axiosInstance
      .post(`slots/`, data.validData)
      .then((response) => {
        setTest(response.data);
        getSlots();
      })
      .catch((error) => {
        console.error(error);
        setTest(error);
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Bulk Upload Slot Data
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

export default BulkUploadSlot;
