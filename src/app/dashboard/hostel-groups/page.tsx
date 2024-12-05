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

export type HostelGroup = {
  id: number;
  hostel_group_name: string;
  max_orders: number;
  created_at: string;
};

const ManageHostelGroups: React.FC = () => {
  const [hostelGroups, setHostelGroups] = useState<HostelGroup[]>([]);
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
    getHostelGroups();
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

  const getHostelGroups = async () => {
    if (!hostelGroups.length) {
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
      .get(`hostel-groups?${query}`)
      .then((response) => {
        setHostelGroups(response.data.results);
        setRowCount(response.data.count);
        setIsError(false);
      })
      .catch(() => setIsError(true));
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  const handleCreateHostelGroup = async ({
    values,
    table,
  }: {
    values: HostelGroup;
    table: MRT_TableInstance<HostelGroup>;
  }) => {
    axiosInstance
      .post(`hostel-groups/`, {
        hostel_group_name: values.hostel_group_name,
        max_orders: values.max_orders,
      })
      .then(() => {
        getHostelGroups();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditHostelGroup = async ({
    values,
    table,
  }: {
    values: HostelGroup;
    table: MRT_TableInstance<HostelGroup>;
  }) => {
    axiosInstance
      .patch(`hostel-groups/${values.id}/`, {
        hostel_group_name: values.hostel_group_name,
        max_orders: values.max_orders,
      })
      .then(() => {
        getHostelGroups();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<HostelGroup>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "hostel_group_name",
        header: "Hostel Group Name",
        size: 250,
      },
      {
        accessorKey: "max_orders",
        header: "Max Orders",
        size: 150,
      },
      {
        accessorKey: "created_at", //normal accessorKey
        header: "Created At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => (
          <Box>{formatDate(cell.getValue() as string)}</Box>
        ),
      },
    ],
    []
  );

  const openDeleteConfirmModal = (row: HostelGroup) => {
    if (window.confirm("Are you sure you want to delete this hostel group?")) {
      axiosInstance
        .delete(`hostel-groups/${row.id}/`)
        .then(() => {
          getHostelGroups();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: hostelGroups,
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
    onCreatingRowSave: handleCreateHostelGroup,
    enableEditing: true,
    onEditingRowSave: handleEditHostelGroup,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Hostel Group</DialogTitle>
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
        <DialogTitle variant="h3">Edit Hostel Group</DialogTitle>
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
        Create New Hostel Group
      </Button>
    ),
  });

  return (
    <div>
      {hostelGroups.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageHostelGroups;
