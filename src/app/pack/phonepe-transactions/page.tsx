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

export type PhonePeTransaction = {
  id: number;
  merchant_id: string;
  merchant_transaction_id: string;
  transaction_id: string;
  amount: string; // Using string to handle precise decimal values
  state: string;
  payment_instrument_type: string;
  payment_instrument_details: Record<string, any>; // JSON data
  response_code: string;
  success: boolean;
  message: string;
  created_at: string;
};

const PhonePeTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<PhonePeTransaction[]>([]);
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
    getTransactions();
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

  const getTransactions = async () => {
    if (!transactions.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    const apiPageIndex = pagination.pageIndex + 1;
    const filtersParams = buildFiltersString(columnFilters);
    const sortingQuery = buildSortingString(sorting);
    const pageSizeQuery = pagination.pageSize ? pagination.pageSize.toString() : "";
    const pageIndexQuery = pagination.pageIndex ? `${apiPageIndex}` : "";

    const queryParams = new URLSearchParams(filtersParams);
    if (sortingQuery) queryParams.append("ordering", sortingQuery);
    if (pageIndexQuery) queryParams.append("page", pageIndexQuery);
    if (pageSizeQuery) queryParams.append("page_size", pageSizeQuery);

    const query = queryParams.toString();

    await axiosInstance
      .get(`pack/phonepe-transactions?${query}`)
      .then((response) => {
        setTransactions(response.data.results);
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

  const handleCreateTransaction = async ({
    values,
    table,
  }: {
    values: PhonePeTransaction;
    table: MRT_TableInstance<PhonePeTransaction>;
  }) => {
    axiosInstance
      .post(`pack/phonepe-transactions/`, {
        merchant_id: values.merchant_id,
        merchant_transaction_id: values.merchant_transaction_id,
        transaction_id: values.transaction_id,
        amount: values.amount,
        state: values.state,
        payment_instrument_type: values.payment_instrument_type,
        payment_instrument_details: values.payment_instrument_details,
        response_code: values.response_code,
        success: values.success,
        message: values.message,
      })
      .then(() => {
        getTransactions();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditTransaction = async ({
    values,
    table,
  }: {
    values: PhonePeTransaction;
    table: MRT_TableInstance<PhonePeTransaction>;
  }) => {
    axiosInstance
      .patch(`pack/phonepe-transactions/${values.id}/`, {
        merchant_id: values.merchant_id,
        merchant_transaction_id: values.merchant_transaction_id,
        transaction_id: values.transaction_id,
        amount: values.amount,
        state: values.state,
        payment_instrument_type: values.payment_instrument_type,
        payment_instrument_details: values.payment_instrument_details,
        response_code: values.response_code,
        success: values.success,
        message: values.message,
      })
      .then(() => {
        getTransactions();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<PhonePeTransaction>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      enableEditing: false,
      size: 150,
    },
    {
      accessorKey: "merchant_id",
      header: "Merchant ID",
      size: 150,
    },
    {
      accessorKey: "merchant_transaction_id",
      header: "Merchant Transaction ID",
      size: 200,
    },
    {
      accessorKey: "transaction_id",
      header: "Transaction ID",
      size: 200,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      size: 100,
    },
    {
      accessorKey: "state",
      header: "State",
      size: 100,
    },
    {
      accessorKey: "payment_instrument_type",
      header: "Payment Instrument Type",
      size: 150,
    },
    {
      accessorKey: "response_code",
      header: "Response Code",
      size: 100,
    },
    {
      accessorKey: "success",
      header: "Success",
      Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
      size: 100,
    },
    {
      accessorKey: "message",
      header: "Message",
      size: 200,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      enableEditing: false,
      size: 200,
    },
  ], []);

  const openDeleteConfirmModal = (row: PhonePeTransaction) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      axiosInstance
        .delete(`pack/phonepe-transactions/${row.id}/`)
        .then(() => {
          getTransactions();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: transactions,
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
    onCreatingRowSave: handleCreateTransaction,
    enableEditing: true,
    onEditingRowSave: handleEditTransaction,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New PhonePe Transaction</DialogTitle>
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
        <DialogTitle variant="h3">Edit PhonePe Transaction</DialogTitle>
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
        Create New PhonePe Transaction
      </Button>
    ),
  });

  return (
    <div>{transactions.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default PhonePeTransactions;
