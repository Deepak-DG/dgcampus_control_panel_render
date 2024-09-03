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

export type PickupSchedule = {
  id: number;
  user: number;
  pickup_day: string;
  first_pickup_date: string;
  created_at: string;
};

const PickupSchedules: React.FC = () => {
  const [pickupSchedules, setPickupSchedules] = useState<PickupSchedule[]>([]);
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
    getPickupSchedules();
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

  const getPickupSchedules = async () => {
    if (!pickupSchedules.length) {
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
      .get(`pack/pickup_schedule?${query}`)
      .then((response) => {
        console.log(response.data);
        setPickupSchedules(response.data.results);
        setRowCount(response.data.count);
        setIsError(false);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      });
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  const handleCreatePickupSchedule = async ({
    values,
    table,
  }: {
    values: PickupSchedule;
    table: MRT_TableInstance<PickupSchedule>;
  }) => {
    axiosInstance
      .post(`pack/pickup_schedule/`, {
        user: values.user,
        pickup_day: values.pickup_day,
        first_pickup_date: values.first_pickup_date,
      })
      .then((response) => {
        getPickupSchedules();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditPickupSchedule = async ({
    values,
    table,
  }: {
    values: PickupSchedule;
    table: MRT_TableInstance<PickupSchedule>;
  }) => {
    setTest(values);

    axiosInstance
      .patch(`pack/pickup_schedule/${values.id}/`, {
        user: values.user,
        pickup_day: values.pickup_day,
        first_pickup_date: values.first_pickup_date,
      })
      .then((response) => {
        getPickupSchedules();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<PickupSchedule>[]>(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
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
        accessorKey: "pickup_day",
        header: "Pickup Day",
        size: 150,
      },
      {
        accessorKey: "first_pickup_date",
        header: "First Pickup Date",
        size: 200,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableEditing: false,
        size: 200,
      },
    ],
    []
  );

  //DELETE action
  const openDeleteConfirmModal = (row: PickupSchedule) => {
    if (window.confirm("Are you sure you want to delete this pickup schedule?")) {
      console.log(row.id);
      axiosInstance
        .delete(`pack/pickup_schedule/${row.id}/`)
        .then((response) => {
          console.log(JSON.stringify(response));
          getPickupSchedules();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: pickupSchedules,
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
    onCreatingRowSave: handleCreatePickupSchedule,
    enableEditing: true,
    onEditingRowSave: handleEditPickupSchedule,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Pickup Schedule</DialogTitle>
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
        <DialogTitle variant="h3">Edit Pickup Schedule</DialogTitle>
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
        Create New Pickup Schedule
      </Button>
    ),
  });

  return (
    <div>{pickupSchedules.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default PickupSchedules;
