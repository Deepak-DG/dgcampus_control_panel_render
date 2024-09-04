"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
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
import axiosInstance from "@/api/axiosInstance";
import { formatDate } from "@/app/lib/DateUtils/dateUtils";

export type OTP = {
  id: number;
  user: number; // Assuming 'user' is a reference to a User ID
  code: string;
  created_at: string;
  is_verified: boolean;
};

const ManageOTPs: React.FC = () => {
  const [otps, setOTPs] = useState<OTP[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);

  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    getOTPs();
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

  const getOTPs = async () => {
    if (!otps.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

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

    await axiosInstance
      .get(`otps?${query}`)
      .then((response) => {
        setOTPs(response.data.results);
        setRowCount(response.data.count);
        setIsError(false);
      })
      .catch((error) => setIsError(true));
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  const handleCreateOTP = async ({
    values,
    table,
  }: {
    values: OTP;
    table: MRT_TableInstance<OTP>;
  }) => {
    axiosInstance
      .post(`otps/`, {
        user: values.user,
        code: values.code,
        is_verified: values.is_verified,
      })
      .then((response) => {
        getOTPs();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditOTP = async ({
    values,
    table,
  }: {
    values: OTP;
    table: MRT_TableInstance<OTP>;
  }) => {
    axiosInstance
      .patch(`otps/${values.id}/`, {
        user: values.user,
        code: values.code,
        is_verified: values.is_verified,
      })
      .then((response) => {
        getOTPs();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<OTP>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "user",
        header: "User",
        size: 150,
      },
      {
        accessorKey: "code",
        header: "Code",
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
        accessorKey: "is_verified",
        header: "Is Verified",
        size: 150,
        Cell: ({ cell }) => <Box>{JSON.stringify(cell.getValue())}</Box>,
      },
    ],
    []
  );

  // DELETE action
  const openDeleteConfirmModal = (row: OTP) => {
    if (window.confirm("Are you sure you want to delete this OTP?")) {
      axiosInstance
        .delete(`otps/${row.id}/`)
        .then((response) => {
          getOTPs();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: otps,
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
    
    createDisplayMode: "modal",
    onCreatingRowSave: handleCreateOTP,
    enableEditing: true,
    onEditingRowSave: handleEditOTP,
    // optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New OTP</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    // optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit OTP</DialogTitle>
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
          <IconButton
            color="error"
            onClick={() => openDeleteConfirmModal(row.original)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Create New OTP
      </Button>
    ),
  });

  return (
    <div>
      {otps.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageOTPs;
