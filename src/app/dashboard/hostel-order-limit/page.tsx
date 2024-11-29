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
import CreateHostelOrderLimit from "@/app/lib/hostel-order-limit/CreateHostelOrderLimit";

export type HostelOrderLimit = {
  id: number;
  hostel_name: string;
  college_name: string;
  date: string;
  max_orders: number;
  current_order_count: number;
  created_at: string;
};

const ManageHostelOrderLimits: React.FC = () => {
  const [orderLimits, setOrderLimits] = useState<HostelOrderLimit[]>([]);
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
    getOrderLimits();
  }, [columnFilters, pagination.pageIndex, pagination.pageSize, sorting]);

  const buildFiltersString = (filters: any[]) => {
    const params = new URLSearchParams();
    filters.forEach((filter) => {
      params.append(filter.id, filter.value);
    });
    return params.toString();
  };

  const buildSortingString = (sorting: any[]) => {
    if (sorting.length === 0) return "";
    const { id, desc } = sorting[0];
    return desc ? `-${id}` : id;
  };

  const getOrderLimits = async () => {
    if (!orderLimits.length) {
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
      .get(`hostel-order-limits?${query}`)
      .then((response) => {
        setOrderLimits(response.data.results);
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

  const handleEditOrderLimit = async ({
    values,
    table,
  }: {
    values: HostelOrderLimit;
    table: MRT_TableInstance<HostelOrderLimit>;
  }) => {
    axiosInstance
      .patch(`hostel-order-limits/${values.id}/`, {
        hostel_name: values.hostel_name,
        college_name: values.college_name,
        date: values.date,
        max_orders: values.max_orders,
        current_order_count: values.current_order_count,
      })
      .then(() => {
        getOrderLimits();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<HostelOrderLimit>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "hostel_name",
        header: "Hostel Name",
        size: 200,
      },
      {
        accessorKey: "college_name",
        header: "College Name",
        size: 200,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 200,
      },
      {
        accessorKey: "max_orders",
        header: "Max Orders",
        size: 150,
      },
      {
        accessorKey: "current_order_count",
        header: "Current Order Count",
        size: 150,
      },

      {
        accessorKey: "created_at", // New column
        header: "Created At",
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>, // Format the date
        enableEditing: false, // Typically, this field is not editable
      },
    ],
    []
  );

  const openDeleteConfirmModal = (row: HostelOrderLimit) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axiosInstance
        .delete(`hostel-order-limits/${row.id}/`)
        .then(() => {
          getOrderLimits();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: orderLimits,
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
    onEditingRowSave: handleEditOrderLimit,
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Order Limit</DialogTitle>
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
      <Box
        sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}
      >
        <CreateHostelOrderLimit getHostelOrderLimits={getOrderLimits} />
      </Box>
    ),
  });

  return (
    <div>{orderLimits.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default ManageHostelOrderLimits;
