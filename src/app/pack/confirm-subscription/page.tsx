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

export type ConfirmSubscription = {
  id: number;
  user: string; // Assuming user is a string, adjust if it is an object
  service: string;
  duration_months: number;
  pickups_per_month: number;
  price: number;
  merchant_transaction_id: string;
  created_at: string;
};

const ConfirmSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ConfirmSubscription[]>([]);
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
    getSubscriptions();
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

  const getSubscriptions = async () => {
    if (!subscriptions.length) {
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
      .get(`pack/confirm_subscription?${query}`)
      .then((response) => {
        console.log(response.data);
        setSubscriptions(response.data.results);
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

  const handleCreateSubscription = async ({
    values,
    table,
  }: {
    values: ConfirmSubscription;
    table: MRT_TableInstance<ConfirmSubscription>;
  }) => {
    axiosInstance
      .post(`pack/confirm_subscription/`, {
        user: values.user,
        service: values.service,
        duration_months: values.duration_months,
        pickups_per_month: values.pickups_per_month,
        price: values.price,
        merchant_transaction_id: values.merchant_transaction_id,
      })
      .then((response) => {
        getSubscriptions();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditSubscription = async ({
    values,
    table,
  }: {
    values: ConfirmSubscription;
    table: MRT_TableInstance<ConfirmSubscription>;
  }) => {
    axiosInstance
      .patch(`pack/confirm_subscription/${values.id}/`, {
        user: values.user,
        service: values.service,
        duration_months: values.duration_months,
        pickups_per_month: values.pickups_per_month,
        price: values.price,
        merchant_transaction_id: values.merchant_transaction_id,
      })
      .then((response) => {
        getSubscriptions();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<ConfirmSubscription>[]>(
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
        accessorKey: "service",
        header: "Service",
        size: 150,
      },
      {
        accessorKey: "duration_months",
        header: "Duration (Months)",
        size: 150,
      },
      {
        accessorKey: "pickups_per_month",
        header: "Pickups Per Month",
        size: 150,
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 150,
      },
      {
        accessorKey: "merchant_transaction_id",
        header: "Merchant Transaction ID",
        size: 150,
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
  const openDeleteConfirmModal = (row: ConfirmSubscription) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      axiosInstance
        .delete(`pack/confirm_subscription/${row.id}/`)
        .then((response) => {
          getSubscriptions();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: subscriptions,
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
    onCreatingRowSave: handleCreateSubscription,
    enableEditing: true,
    onEditingRowSave: handleEditSubscription,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Subscription</DialogTitle>
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
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Subscription</DialogTitle>
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
        Create New Subscription
      </Button>
    ),
  });

  return (
    <div>{subscriptions.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default ConfirmSubscriptions;
