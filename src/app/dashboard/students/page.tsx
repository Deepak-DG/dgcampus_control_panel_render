"use client";

// ManageStudents.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here
import axiosInstance from "@/api/axiosInstance";
import CreateStudent from "@/app/lib/students/CreateStudent";
import BulkUploadStudent from "@/app/lib/students/BulkUploadStudent";
import { formatDate } from "@/app/lib/DateUtils/dateUtils";

export type Student = {
  id: number;
  registration_number: string;
  email: string;
  name: string;
  mobile_number: string;
  room_number: string;
  hostel_name: string;
  college_name: string;
  user: string;
  room: string;
  created_at: string;
  pin_set: string;
};

export type Hostel = {
  hostel_name: string;
};

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [test, setTest] = useState<Student | null>(null);
  const [hostels, setHostels] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);

  //table state
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    getStudents();
    getHostels();
  }, [columnFilters, pagination.pageIndex, pagination.pageSize, sorting]);

  // Helper function to build query string from filters
  const buildFiltersString = (filters: any[]) => {
    const params = new URLSearchParams();
    filters.forEach((filter) => {
      params.append(filter.id, filter.value);
    });
    return params.toString();
  };

  // Helper function to build sorting string
  const buildSortingString = (sorting: any[]) => {
    if (sorting.length === 0) return "";
    const { id, desc } = sorting[0];
    return desc ? `-${id}` : id;
  };

  const getStudents = async () => {
    if (!students.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    // console.log(sorting);
    const apiPageIndex = pagination.pageIndex + 1;
    const filtersParams = buildFiltersString(columnFilters);
    const sortingQuery = buildSortingString(sorting);
    const pageSizeQuery = pagination.pageSize
      ? pagination.pageSize.toString()
      : "";
    const pageIndexQuery = pagination.pageIndex ? `${apiPageIndex}` : "";

    const queryParams = new URLSearchParams(filtersParams);
    if (sortingQuery) queryParams.append("ordering", sortingQuery);
    if (pageIndexQuery) queryParams.append("page", pageIndexQuery);
    if (pageSizeQuery) queryParams.append("page_size", pageSizeQuery);

    const query = queryParams.toString();

    try {
      const response = await axiosInstance.get(`students?${query}`);
      setStudents(response.data.results);
      setRowCount(response.data.count);
      setIsError(false);
    } catch (error: any) {
      console.error(error);
      setIsError(true);
      // if (error.response.data.code === "token_not_valid") {
      //   onLogout();
      // }
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  const getHostels = async () => {
    await axiosInstance
      .get("hostels?page_size=100")
      .then((response) => {
        setHostels(
          response.data.results.map((item: Hostel) => item.hostel_name)
        );
      })
      .catch((error) => console.log(error));
  };

  const handleEditStudent = async ({ values, table }: any) => {
    setTest(values);
    try {
      const response = await axiosInstance.patch(`students/${values.id}/`, {
        registration_number: values.registration_number,
        email: values.email,
        name: values.name,
        room_number: values.room_number,
        hostel_name: values.hostel_name,
        college_name: values.college_name,
      });
      console.log(response);
      getStudents();
    } catch (error) {
      console.error(error);
    }

    table.setEditingRow(null);
  };
  // Add handler function for deleting student pin
  const handleDeleteStudentPin = async (studentId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete the PIN for this student?"
      )
    ) {
      try {
        const response = await axiosInstance.delete(
          `admin/delete-pin/${studentId}/`
        ); // Assuming you update the pin field to null
        console.log(response);
        getStudents();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "registration_number",
        header: "Registration Number",
        size: 100,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 100,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        accessorKey: "mobile_number",
        header: "Mobile Number",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "room_number",
        header: "Room Number",
        // enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "hostel_name",
        header: "Hostel Name",
        // enableEditing: false,
        size: 150,
        editVariant: "select",
        editSelectOptions: hostels,
      },
      {
        accessorKey: "college_name",
        header: "College Name",
        // enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "user",
        header: "User",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "room",
        header: "Room",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
      {
        accessorKey: "pin_set",
        header: "Delete Pin",
        enableEditing: false,
        size: 150,
        Cell: ({ row, cell }) => {
          const isPinSet = cell.getValue();
          return (
            <Box>
              {isPinSet ? (
                <Tooltip title="Delete Student Pin">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteStudentPin(row.original.id)}
                  >
                    <BackspaceOutlinedIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                "Pin not set"
              )}
            </Box>
          );
        },
      },
    ],
    [hostels]
  );

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<Student>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(students);
    download(csvConfig)(csv);
  };

  //DELETE action
  const openDeleteConfirmModal = (row: any) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axiosInstance
        .delete(`students/${row.original.id}/`)
        .then((response) => {
          getStudents();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: students,
    columns,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: rowCount,
    state: {
      columnFilters,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    enableEditing: true,
    onEditingRowSave: handleEditStudent,
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Student</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}
      >
        <CreateStudent getStudents={getStudents} />
        <BulkUploadStudent getStudents={getStudents} />
        <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return (
    <div>{students && hostels && <MaterialReactTable table={table} />}</div>
  );
};

export default Students;
