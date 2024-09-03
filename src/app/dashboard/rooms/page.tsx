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

export type Room = {
  id: number;
  hostel_name: string;
  room_number: string;
  created_at: string;
  hostel: string;
};

export type Hostel = {
  hostel_name: string;
};

const ManageRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [test, setTest] = useState<any>(null);
  const [hostels, setHostels] = useState<string[]>([]);
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
    getRooms();
    getHostels();
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

  const getRooms = async () => {
    if (!rooms.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    // console.log(sorting);
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
      .get(`rooms?${query}`)
      .then((response) => {
        setRooms(response.data.results);
        setRowCount(response.data.count);
        setIsError(false);
      })
      .catch((error) => {
        setIsError(true);
        // if (error.response.data.code === "token_not_valid")
        //   onLogout();
      });
    setIsLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  const getHostels = async () => {
    await axiosInstance
      .get("hostels?page_size=100")
      .then((response) => {
        setHostels(
          response.data.results.map((item: Hostel) => item.hostel_name)
        );
      })
      .catch((error) => console.log(error));
  };

  const handleCreateRoom = async ({
    values,
    table,
  }: {
    values: Room;
    table: MRT_TableInstance<Room>;
  }) => {
    axiosInstance
      .post(`rooms/`, {
        room_number: values.room_number,
        hostel_name: values.hostel_name,
      })
      .then((response) => {
        getRooms();
      })
      .catch((error) => console.error(error));
    table.setCreatingRow(null);
  };

  const handleEditRoom = async ({
    values,
    table,
  }: {
    values: Room;
    table: MRT_TableInstance<Room>;
  }) => {
    axiosInstance
      .patch(`rooms/${values.id}/`, {
        room_number: values.room_number,
        hostel_name: values.hostel_name,
      })
      .then((response) => {
        getRooms();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<Room>[]>(
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
        size: 150,
        editVariant: "select",
        editSelectOptions: hostels,
      },
      {
        accessorKey: "room_number",
        header: "Room Number",
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
      {
        accessorKey: "hostel",
        header: "Hostel",
        size: 200,
        enableEditing: false,
      },
    ],
    [hostels]
  );

  const openDeleteConfirmModal = (row: Room) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      axiosInstance
        .delete(`rooms/${row.id}/`)
        .then((response) => {
          getRooms();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: rooms,
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
    onCreatingRowSave: handleCreateRoom,
    enableEditing: true,
    onEditingRowSave: handleEditRoom,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Room</DialogTitle>
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
        <DialogTitle variant="h3">Edit Room</DialogTitle>
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
        Create New Room
      </Button>
    ),
  });

  return (
    <div>
      {rooms.length > 0 && hostels.length > 0 && (
        <MaterialReactTable table={table} />
      )}
    </div>
  );
};

export default ManageRooms;
