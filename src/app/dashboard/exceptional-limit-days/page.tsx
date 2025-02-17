"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "@/api/axiosInstance";
import { formatDate } from "@/app/lib/DateUtils/dateUtils";

export type ExceptionalLimitDay = {
  id: number;
  groups: number[]; // Array of group IDs
  date: string;
  max_orders: number;
  reason: string;
};

const ManageExceptionalLimitDays: React.FC = () => {
  const [exceptionalLimitDays, setExceptionalLimitDays] = useState<
    ExceptionalLimitDay[]
  >([]);
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]); // Available groups
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
    getExceptionalLimitDays();
    getGroups(); // Fetch available groups for selection
  }, [columnFilters, pagination.pageIndex, pagination.pageSize, sorting]);

  const getGroups = async () => {
    try {
      const response = await axiosInstance.get("hostel-groups/");
      setGroups(
        response.data.results.map((group: any) => ({
          id: group.id,
          name: group.hostel_group_name,
        }))
      );
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

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

  const getExceptionalLimitDays = async () => {
    if (!exceptionalLimitDays.length) {
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
      .get(`exceptional-limit-days?${query}`)
      .then((response) => {
        setExceptionalLimitDays(response.data.results);
        console.log(response);
        setRowCount(response.data.count);
        setIsError(false);
      })
      .catch(() => setIsError(true));
    setIsLoading(false);
    setIsRefetching(false);
  };

  const handleCreateExceptionalLimitDay = async ({
    values,
    table,
  }: {
    values: ExceptionalLimitDay;
    table: MRT_TableInstance<ExceptionalLimitDay>;
  }) => {
    // Ensure `groups` is an array
    const payload = {
      ...values,
      groups: Array.isArray(values.groups) ? values.groups : [], // Ensure groups is an array
    };

    try {
      await axiosInstance.post(`exceptional-limit-days/`, payload);
      getExceptionalLimitDays(); // Refresh the table after creation
      console.log("Created new record:", payload);
    } catch (error: any) {
      console.error("Error creating record:", error.response?.data || error);
    }

    table.setCreatingRow(null);
  };

  const handleEditExceptionalLimitDay = async ({
    values,
    table,
  }: {
    values: ExceptionalLimitDay;
    table: MRT_TableInstance<ExceptionalLimitDay>;
  }) => {
    console.log(values);
    axiosInstance
      .patch(`exceptional-limit-days/${values.id}/`, values)
      .then(() => {
        getExceptionalLimitDays();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<ExceptionalLimitDay>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "groups",
        header: "Groups",
        size: 300,
        enableEditing: true,
        Cell: ({ cell }) => {
          const groupIds = cell.getValue<number[]>() || [];
          return groupIds
            .map((id) => groups.find((g) => g.id === id)?.name || "Unknown")
            .join(", ");
        },

        Edit: ({ cell, column, table }) => {
          const currentValues = cell.getValue<number[]>() || []; // Get the current group IDs

          return (
            <FormControl fullWidth>
              <InputLabel>Groups</InputLabel>
              <Select
                multiple
                value={currentValues}
                onChange={(e) => {
                  const updatedValue = e.target.value as number[]; // Updated selected group IDs
                  const editingRow =
                    table.getState().creatingRow || table.getState().editingRow; // Check creating or editing row state

                  if (editingRow) {
                    table.setEditingRow({
                      ...editingRow,
                      _valuesCache: {
                        ...editingRow._valuesCache,
                        [column.id]: updatedValue, // Update the `groups` field
                      },
                    });
                  }
                }}
                renderValue={(selected) =>
                  (selected as number[])
                    .map(
                      (id) => groups.find((g) => g.id === id)?.name || "Unknown"
                    )
                    .join(", ")
                }
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
        Cell: ({ cell }) => (
          <Box>{formatDate(cell.getValue() as string, false)}</Box>
        ),
      },
      {
        accessorKey: "max_orders",
        header: "Max Orders",
        size: 150,
      },
      {
        accessorKey: "reason",
        header: "Reason",
        size: 250,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
    ],
    [groups]
  );

  const openDeleteConfirmModal = (row: ExceptionalLimitDay) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axiosInstance
        .delete(`exceptional-limit-days/${row.id}/`)
        .then(() => {
          getExceptionalLimitDays();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: exceptionalLimitDays,
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
    onCreatingRowSave: handleCreateExceptionalLimitDay,
    enableEditing: true,
    onEditingRowSave: handleEditExceptionalLimitDay,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Exceptional Limit Day</DialogTitle>
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
        <DialogTitle variant="h3">Edit Exceptional Limit Day</DialogTitle>
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
        Create New Exceptional Limit Day
      </Button>
    ),
  });

  return (
    <div>
      {exceptionalLimitDays.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageExceptionalLimitDays;
