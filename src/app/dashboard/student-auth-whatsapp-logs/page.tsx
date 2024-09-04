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

export type StudentAuthWhatsAppLog = {
  id: number;
  recipient_number: string;
  message: string;
  status_code: number;
  response_text: string;
  sent_at: string;
};

const ManageStudentAuthWhatsAppLogs: React.FC = () => {
  const [logs, setLogs] = useState<StudentAuthWhatsAppLog[]>([]);
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
    getLogs();
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

  const getLogs = async () => {
    if (!logs.length) {
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
      .get(`student-auth-whatsapp-logs?${query}`)
      .then((response) => {
        setLogs(response.data.results);
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

  const handleCreateLog = async ({
    values,
    table,
  }: {
    values: StudentAuthWhatsAppLog;
    table: MRT_TableInstance<StudentAuthWhatsAppLog>;
  }) => {
    axiosInstance
      .post(`student-auth-whatsapp-logs/`, {
        recipient_number: values.recipient_number,
        message: values.message,
        status_code: values.status_code,
        response_text: values.response_text,
        sent_at: values.sent_at,
      })
      .then((response) => {
        getLogs();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditLog = async ({
    values,
    table,
  }: {
    values: StudentAuthWhatsAppLog;
    table: MRT_TableInstance<StudentAuthWhatsAppLog>;
  }) => {
    axiosInstance
      .patch(`student-auth-whatsapp-logs/${values.id}/`, {
        recipient_number: values.recipient_number,
        message: values.message,
        status_code: values.status_code,
        response_text: values.response_text,
        sent_at: values.sent_at,
      })
      .then((response) => {
        getLogs();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<StudentAuthWhatsAppLog>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "recipient_number",
        header: "Recipient Number",
        size: 150,
      },
      {
        accessorKey: "message",
        header: "Message",
        size: 150,
      },
      {
        accessorKey: "status_code",
        header: "Status Code",
        size: 150,
      },
      {
        accessorKey: "response_text",
        header: "Response Text",
        size: 150,
      },
      {
        accessorKey: "sent_at",
        header: "Sent At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
    ],
    []
  );

  // DELETE action
  const openDeleteConfirmModal = (row: StudentAuthWhatsAppLog) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      axiosInstance
        .delete(`student-auth-whatsapp-logs/${row.id}/`)
        .then((response) => {
          getLogs();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: logs,
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
    onCreatingRowSave: handleCreateLog,
    enableEditing: true,
    onEditingRowSave: handleEditLog,
    // optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Log</DialogTitle>
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
        <DialogTitle variant="h3">Edit Log</DialogTitle>
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
        Create New Log
      </Button>
    ),
  });

  return (
    <div>
      {logs.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageStudentAuthWhatsAppLogs;
