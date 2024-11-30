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

export type OrderRating = {
  id: number;
  order: string;
  overall_rating: number;
  pickup_rating: number;
  washing_rating: number;
  folding_rating: number;
  ironing_rating: number;
  delivery_rating: number;
  feedback: string;
  created_at: string;
  updated_at: string;
};

const ManageOrderRatings: React.FC = () => {
  const [orderRatings, setOrderRatings] = useState<OrderRating[]>([]);
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
    getOrderRatings();
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

  const getOrderRatings = async () => {
    if (!orderRatings.length) {
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
      .get(`order-ratings?${query}`)
      .then((response) => {
        setOrderRatings(response.data.results);
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

  const handleCreateOrderRating = async ({
    values,
    table,
  }: {
    values: OrderRating;
    table: MRT_TableInstance<OrderRating>;
  }) => {
    axiosInstance
      .post(`order-ratings/`, {
        order: values.order,
        overall_rating: values.overall_rating,
        pickup_rating: values.pickup_rating,
        washing_rating: values.washing_rating,
        folding_rating: values.folding_rating,
        ironing_rating: values.ironing_rating,
        delivery_rating: values.delivery_rating,
        feedback: values.feedback,
      })
      .then(() => {
        getOrderRatings();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditOrderRating = async ({
    values,
    table,
  }: {
    values: OrderRating;
    table: MRT_TableInstance<OrderRating>;
  }) => {
    axiosInstance
      .patch(`order-ratings/${values.id}/`, {
        order: values.order,
        overall_rating: values.overall_rating,
        pickup_rating: values.pickup_rating,
        washing_rating: values.washing_rating,
        folding_rating: values.folding_rating,
        ironing_rating: values.ironing_rating,
        delivery_rating: values.delivery_rating,
        feedback: values.feedback,
      })
      .then(() => {
        getOrderRatings();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<OrderRating>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      enableEditing: false,
      size: 100,
    },
    {
      accessorKey: "order",
      header: "Order",
      size: 150,
    },
    {
      accessorKey: "overall_rating",
      header: "Overall Rating",
      size: 150,
    },
    {
      accessorKey: "pickup_rating",
      header: "Pickup Rating",
      size: 150,
    },
    {
      accessorKey: "washing_rating",
      header: "Washing Rating",
      size: 150,
    },
    {
      accessorKey: "folding_rating",
      header: "Folding Rating",
      size: 150,
    },
    {
      accessorKey: "ironing_rating",
      header: "Ironing Rating",
      size: 150,
    },
    {
      accessorKey: "delivery_rating",
      header: "Delivery Rating",
      size: 150,
    },
    {
      accessorKey: "feedback",
      header: "Feedback",
      size: 200,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      enableEditing: false,
      size: 200,
      Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      enableEditing: false,
      size: 200,
      Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
    },
  ], []);

  // DELETE action
  const openDeleteConfirmModal = (row: OrderRating) => {
    if (window.confirm("Are you sure you want to delete this rating?")) {
      axiosInstance
        .delete(`order-ratings/${row.id}/`)
        .then(() => {
          getOrderRatings();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: orderRatings,
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
    onCreatingRowSave: handleCreateOrderRating,
    enableEditing: true,
    onEditingRowSave: handleEditOrderRating,

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Order Rating</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Order Rating</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row.original)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Create New Rating
      </Button>
    ),
  });

  return (
    <div>
      {orderRatings.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageOrderRatings;
