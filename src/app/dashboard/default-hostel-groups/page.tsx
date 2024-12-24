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

export type DefaultHostelGroup = {
  id: number;
  date: string;
  group: string;
  created_at: string;
};

const ManageDefaultHostelGroups: React.FC = () => {
  const [groups, setGroups] = useState<DefaultHostelGroup[]>([]);
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
    getGroups();
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

  const getGroups = async () => {
    if (!groups.length) {
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
      .get(`default-hostel-groups?${query}`)
      .then((response) => {
        setGroups(response.data.results);
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

  const handleCreateGroup = async ({
    values,
    table,
  }: {
    values: DefaultHostelGroup;
    table: MRT_TableInstance<DefaultHostelGroup>;
  }) => {
    axiosInstance
      .post(`default-hostel-groups/`, {
        date: values.date,
        group: values.group,
      })
      .then(() => {
        getGroups();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditGroup = async ({
    values,
    table,
  }: {
    values: DefaultHostelGroup;
    table: MRT_TableInstance<DefaultHostelGroup>;
  }) => {
    axiosInstance
      .patch(`default-hostel-groups/${values.id}/`, {
        date: values.date,
        group: values.group,
      })
      .then(() => {
        getGroups();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<DefaultHostelGroup>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
      },
      {
        accessorKey: "group",
        header: "Group",
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
    ],
    []
  );

  const openDeleteConfirmModal = (row: DefaultHostelGroup) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      axiosInstance
        .delete(`default-hostel-groups/${row.id}/`)
        .then(() => {
          getGroups();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: groups,
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
    onCreatingRowSave: handleCreateGroup,
    enableEditing: true,
    onEditingRowSave: handleEditGroup,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Group</DialogTitle>
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
        <DialogTitle variant="h3">Edit Group</DialogTitle>
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
        Create New Group
      </Button>
    ),
  });

  return (
    <div>
      {groups.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageDefaultHostelGroups;
