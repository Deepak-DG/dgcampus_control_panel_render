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

export type User = {
  id: number;
  mobile_number: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
};

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [test, setTest] = useState<any>(null);
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
    getUsers();
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

  const getUsers = async () => {
    if (!users.length) {
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
      .get(`users?${query}`)
      .then((response) => {
        setUsers(response.data.results);
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

  const handleCreateUser = async ({
    values,
    table,
  }: {
    values: User;
    table: MRT_TableInstance<User>;
  }) => {
    axiosInstance
      .post(`users/`, {
        mobile_number: values.mobile_number,
        is_staff: values.is_staff,
        is_superuser: values.is_superuser,
        is_active: values.is_active,
        is_deleted: values.is_deleted,
      })
      .then((response) => {
        getUsers();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditUser = async ({
    values,
    table,
  }: {
    values: User;
    table: MRT_TableInstance<User>;
  }) => {
    setTest(values);

    axiosInstance
      .patch(`users/${values.id}/`, {
        mobile_number: values.mobile_number,
        is_staff: values.is_staff,
        is_superuser: values.is_superuser,
        is_active: values.is_active,
        is_deleted: values.is_deleted,
      })
      .then((response) => {
        getUsers();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
        header: "ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "mobile_number",
        header: "Mobile Number",
        size: 150,
      },
      {
        accessorKey: "is_staff",
        header: "Is Staff",
        size: 150,
        Cell: ({ cell }) => <Box>{JSON.stringify(cell.getValue())}</Box>,
      },
      {
        accessorKey: "is_superuser",
        header: "Is Superuser",
        size: 150,
        Cell: ({ cell }) => <Box>{JSON.stringify(cell.getValue())}</Box>,
      },
      {
        accessorKey: "is_active",
        header: "Is Active",
        size: 150,
        Cell: ({ cell }) => <Box>{JSON.stringify(cell.getValue())}</Box>,
      },
      {
        accessorKey: "is_deleted",
        header: "Is Deleted",
        size: 150,
        Cell: ({ cell }) => <Box>{JSON.stringify(cell.getValue())}</Box>,
      },
      {
        accessorKey: "created_at", //normal accessorKey
        header: "Created At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
    ],
    []
  );

  //DELETE action
  const openDeleteConfirmModal = (row: User) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axiosInstance
        .delete(`users/${row.id}/`)
        .then((response) => {
          getUsers();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: users,
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
    
    createDisplayMode: "modal",
    onCreatingRowSave: handleCreateUser,
    enableEditing:true,
    onEditingRowSave: handleEditUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New User</DialogTitle>
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
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit User</DialogTitle>
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
        Create New User
      </Button>
    ),
  });

  return (
    <div>
      {users.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageUsers;
