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

export type WhatsAppAPILog = {
  id: number;
  mobile: string;
  request_data: string;
  response_data: string;
  status_code: number;
  created_at: string;
};

const WhatsAppLogs: React.FC = () => {
  const [logs, setLogs] = useState<WhatsAppAPILog[]>([]);
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
      .get(`pack/whatsapp-logs?${query}`)
      .then((response) => {
        console.log(response.data);
        setLogs(response.data.results);
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

  const handleCreateLog = async ({
    values,
    table,
  }: {
    values: WhatsAppAPILog;
    table: MRT_TableInstance<WhatsAppAPILog>;
  }) => {
    axiosInstance
      .post(`pack/whatsapp-logs/`, {
        mobile: values.mobile,
        request_data: values.request_data,
        response_data: values.response_data,
        status_code: values.status_code,
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
    values: WhatsAppAPILog;
    table: MRT_TableInstance<WhatsAppAPILog>;
  }) => {
    axiosInstance
      .patch(`pack/whatsapp-logs/${values.id}/`, {
        mobile: values.mobile,
        request_data: values.request_data,
        response_data: values.response_data,
        status_code: values.status_code,
      })
      .then((response) => {
        getLogs();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<WhatsAppAPILog>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        size: 150,
      },
      {
        accessorKey: "request_data",
        header: "Request Data",
        size: 300,
      },
      {
        accessorKey: "response_data",
        header: "Response Data",
        size: 300,
      },
      {
        accessorKey: "status_code",
        header: "Status Code",
        size: 100,
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

  const openDeleteConfirmModal = (row: WhatsAppAPILog) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      console.log(row.id);
      axiosInstance
        .delete(`pack/whatsapp-logs/${row.id}/`)
        .then((response) => {
          console.log(JSON.stringify(response));
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
    positionToolbarAlertBanner: "bottom",

    createDisplayMode: "modal",
    onCreatingRowSave: handleCreateLog,
    enableEditing: true,
    onEditingRowSave: handleEditLog,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New WhatsApp API Log</DialogTitle>
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
        <DialogTitle variant="h3">Edit WhatsApp API Log</DialogTitle>
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
        Create New WhatsApp API Log
      </Button>
    ),
  });

  return (
    <div>{logs.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default WhatsAppLogs;
