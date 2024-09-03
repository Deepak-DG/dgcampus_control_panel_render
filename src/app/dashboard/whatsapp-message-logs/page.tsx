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

export type WhatsAppMessageLog = {
  id: number;
  order: string;
  recipient_number: string;
  template_name: string;
  params: string;
  sent_at: string;
  status: string;
  error_message: string;
};

const ManageWhatsAppMessageLog: React.FC = () => {
  const [messageLogs, setMessageLogs] = useState<WhatsAppMessageLog[]>([]);
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
    getMessageLogs();
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

  const getMessageLogs = async () => {
    if (!messageLogs.length) {
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
      .get(`whatsApp-message-log?${query}`)
      .then((response) => {
        setMessageLogs(response.data.results);
        setRowCount(response.data.count);
        setIsError(false);
      })
      .catch((error) => {
        setIsError(true);
      });
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  const handleCreateMessageLog = async ({
    values,
    table,
  }: {
    values: WhatsAppMessageLog;
    table: MRT_TableInstance<WhatsAppMessageLog>;
  }) => {
    axiosInstance
      .post(`whatsApp-message-log/`, {
        order: values.order,
        recipient_number: values.recipient_number,
        template_name: values.template_name,
        params: values.params,
        status: values.status,
        error_message: values.error_message,
      })
      .then((response) => {
        getMessageLogs();
      })
      .catch((error) => console.error(error));
    table.setCreatingRow(null);
  };

  const handleEditMessageLog = async ({
    values,
    table,
  }: {
    values: WhatsAppMessageLog;
    table: MRT_TableInstance<WhatsAppMessageLog>;
  }) => {
    axiosInstance
      .patch(`whatsApp-message-log/${values.id}/`, {
        order: values.order,
        recipient_number: values.recipient_number,
        template_name: values.template_name,
        params: values.params,
        status: values.status,
        error_message: values.error_message,
      })
      .then((response) => {
        getMessageLogs();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<WhatsAppMessageLog>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "order",
        header: "Order",
        size: 150,
      },
      {
        accessorKey: "recipient_number",
        header: "Recipient Number",
        size: 150,
      },
      {
        accessorKey: "template_name",
        header: "Template Name",
        size: 150,
      },
      {
        accessorKey: "params",
        header: "Parameters",
        size: 150,
      },
      {
        accessorKey: "sent_at",
        header: "Sent At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
      {
        accessorKey: "error_message",
        header: "Error Message",
        size: 150,
      },
    ],
    []
  );

  const openDeleteConfirmModal = (row: WhatsAppMessageLog) => {
    if (window.confirm("Are you sure you want to delete this message log?")) {
      axiosInstance
        .delete(`whatsApp-message-log/${row.id}/`)
        .then((response) => {
          getMessageLogs();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: messageLogs,
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
    onCreatingRowSave: handleCreateMessageLog,
    enableEditing: true,
    onEditingRowSave: handleEditMessageLog,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Message Log</DialogTitle>
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
        <DialogTitle variant="h3">Edit Message Log</DialogTitle>
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
        Create New Message Log
      </Button>
    ),
  });

  return (
    <div>
      {messageLogs.length >= 0 && (
        <MaterialReactTable table={table} />
      )}
    </div>
  );
};

export default ManageWhatsAppMessageLog;
