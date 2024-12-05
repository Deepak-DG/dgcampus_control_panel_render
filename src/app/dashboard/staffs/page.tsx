"use client";

// ManageStaff.tsx
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
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here
import axiosInstance from "@/api/axiosInstance";
import CreateStaff from "@/app/lib/staff/CreateStaff";
import BulkUploadStaff from "@/app/lib/staff/BulkUplodStaff";
import { formatDate } from "@/app/lib/DateUtils/dateUtils";
import EditRolesDialog from "@/app/lib/staff/EditRolesDialog";

export type Staff = {
  id: number;
  staff_id: string;
  user: string;
  mobile_number: string;
  name: string;
  roles_display: string;
  college: string;
  college_name: string;
  created_at: string;
  pin_set: string;
};

export type Role = {
  name: string;
};

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [test, setTest] = useState<Staff | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
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

  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleEditRolesClick = (staffId: number) => {
    setSelectedStaffId(staffId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedStaffId(null);
  };

  const handleRolesSave = () => {
    getStaff(); // Reload staff data
  };

  const getInitialRoles = (staffId: number) => {
    const staffMember = staff.find((s) => s.id === staffId);
    if (!staffMember) return [];
    const rolesDisplay = staffMember.roles_display;
    if (Array.isArray(rolesDisplay)) return rolesDisplay;
    if (typeof rolesDisplay === "string")
      return rolesDisplay.split(",").map((role) => role.trim());
    return [];
  };

  useEffect(() => {
    getStaff();
    getRoles();
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

  const getRoles = async () => {
    await axiosInstance
      .get("roles?page_size=100")
      .then((response) => {
        setRoles(response.data.results.map((item: Role) => item.name));
      })
      .catch((error) => console.log(error));
  };

  const getStaff = async () => {
    if (!staff.length) {
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
      const response = await axiosInstance.get(`staff?${query}`);
      setStaff(response.data.results);
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

  const handleEditStaff = async ({ values, table }: any) => {
    setTest(values);
    console.log(values.roles_display);
    try {
      await axiosInstance.patch(`staff/${values.id}/`, {
        staff_id: values.staff_id,
        user: values.user,
        name: values.name,
        // roles: [values.roles_display],
        college: values.college,
      });
      getStaff();
    } catch (error) {
      console.error(error);
    }

    table.setEditingRow(null);
  };

  // Add handler function for deleting student pin
  const handleDeleteStaffPin = async (staffId: number) => {
    if (
      window.confirm("Are you sure you want to delete the PIN for this staff?")
    ) {
      try {
        const response = await axiosInstance.delete(
          `admin/delete-staff-pin/${staffId}/`
        ); // Assuming you update the pin field to null
        console.log(response);
        getStaff();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<Staff>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "staff_id",
        header: "User Name",
        size: 100,
      },

      {
        accessorKey: "mobile_number",
        header: "Mobile Number",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "roles_display",
        header: "Roles",
        size: 150,
        enableEditing: false,
        Cell: ({ cell }) => {
          const value = cell.getValue() as string | string[]; // Type assertion
          const rolesArray = Array.isArray(value)
            ? value
            : value.split(",").map((role) => role.trim());
          return <Box>{rolesArray.join(", ")}</Box>;
        },
      },
      {
        id: "editRoles",
        header: "Edit Roles",
        Cell: ({ row }) => (
          <Tooltip title="Edit Roles">
            <IconButton onClick={() => handleEditRolesClick(row.original.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        ),
        size: 100,
      },
      {
        accessorKey: "college_name",
        header: "College Name",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "college",
        header: "College",
        size: 150,
      },
      {
        accessorKey: "user",
        header: "User",
        size: 100,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableEditing: false,
        size: 150,
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
                    onClick={() => handleDeleteStaffPin(row.original.id)}
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
    [roles]
  );

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<Staff>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(staff);
    download(csvConfig)(csv);
  };

  //DELETE action
  const openDeleteConfirmModal = (row: any) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      axiosInstance
        .delete(`staff/${row.original.id}/`)
        .then((response) => {
          getStaff();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: staff,
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
    onEditingRowSave: handleEditStaff,
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Staff</DialogTitle>
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
        <CreateStaff getStaff={getStaff} />
        <BulkUploadStaff getStaff={getStaff} />
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
    <div>
      {staff && <MaterialReactTable table={table} />}
      <EditRolesDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        staffId={selectedStaffId ?? 0}
        initialRoles={
          selectedStaffId !== null ? getInitialRoles(selectedStaffId) : []
        }
        rolesOptions={roles}
        onSave={handleRolesSave}
      />
    </div>
  );
};

export default Staff;
