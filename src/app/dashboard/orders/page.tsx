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

export type Order = {
  id: number;
  pickup_date: string;
  slot: string;
  room: string;
  student: string;
  pickup_staff: string;
  delivery_staff: string;
  pickup_date_time: string;
  washing_started_date_time: string;
  folding_date_time: string;
  ironing_date_time: string;
  delivery_date_time: string;
  order_status: string;
  number_of_clothes: number;
  box_id: string;
  mobile_number: string;
  delivery_pin: string;
  created_at: string;
};

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [test, setTest] = useState<any>(null);
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
    getOrders();
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

  const getOrders = async () => {
    if (!orders.length) {
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
      .get(`orders?${query}`)
      .then((response) => {
        setOrders(response.data.results);
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

  const handleCreateOrder = async ({
    values,
    table,
  }: {
    values: Order;
    table: MRT_TableInstance<Order>;
  }) => {
    axiosInstance
      .post(`orders/`, {
        slot: values.slot,
        pickup_date: values.pickup_date,
        room: values.room,
        student: values.student,
        pickup_staff: values.pickup_staff,
        delivery_staff: values.delivery_staff,
        pickup_date_time: values.pickup_date_time,
        washing_started_date_time: values.washing_started_date_time,
        folding_date_time: values.folding_date_time,
        ironing_date_time: values.ironing_date_time,
        delivery_date_time: values.delivery_date_time,
        order_status: values.order_status,
        number_of_clothes: values.number_of_clothes,
        box_id: values.box_id,
        mobile_number: values.mobile_number,
        delivery_pin: values.delivery_pin,
      })
      .then((response) => {
        getOrders();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditOrder = async ({
    values,
    table,
  }: {
    values: Order;
    table: MRT_TableInstance<Order>;
  }) => {
    setTest(values);

    axiosInstance
      .patch(`orders/${values.id}/`, {
        slot: values.slot,
        pickup_date: values.pickup_date,
        room: values.room,
        student: values.student,
        pickup_staff: values.pickup_staff,
        delivery_staff: values.delivery_staff,
        pickup_date_time: values.pickup_date_time,
        washing_started_date_time: values.washing_started_date_time,
        folding_date_time: values.folding_date_time,
        ironing_date_time: values.ironing_date_time,
        delivery_date_time: values.delivery_date_time,
        order_status: values.order_status,
        number_of_clothes: values.number_of_clothes,
        box_id: values.box_id,
        mobile_number: values.mobile_number,
        delivery_pin: values.delivery_pin,
      })
      .then((response) => {
        getOrders();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
        header: "ID",
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "order_status",
        header: "Order Status",
        filterVariant: "select",
        filterSelectOptions: [
          { label: "Pre Booked", value: "pre_booked" },
          { label: "Picked up", value: "picked_up" },
          { label: "Pickup Not Done	", value: "pickup_not_done" },
          { label: "Washing Started", value: "washing_started" },
          { label: "Folding Done", value: "folding_done" },
          { label: "Ready To Deliver", value: "ready_to_deliver" },
          { label: "Delivered", value: "delivered" },
          { label: "Hold", value: "hold" },
        ],
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          // Replace underscores with spaces and capitalize the first letter of each word
          return value
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        },
      },
      {
        accessorKey: "pickup_date",
        header: "Pickup Date",
        // enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "slot_date",
        header: "Slot Date",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "room_number",
        header: "Room Number",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "hostel_name",
        header: "Hostel Name",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "college_name",
        header: "College Name",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "registration_number",
        header: "Registration Number",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "student_name",
        header: "Student Name",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "student_mobile_number",
        header: "Student Mobile Number",
        enableEditing: false,
        size: 250,
      },
      {
        accessorKey: "pickup_staff_name",
        header: "Pickup Staff Name",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "delivery_staff_name",
        header: "Delivery Staff Name",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "number_of_clothes",
        header: "Number of Clothes",
        size: 150,
      },
      {
        accessorKey: "box_id",
        header: "Box ID",
        size: 150,
      },
      {
        accessorKey: "mobile_number",
        header: "Mobile Number",
        size: 150,
      },
      {
        accessorKey: "delivery_pin",
        header: "Delivery Pin",
        size: 150,
      },
      {
        accessorKey: "slot",
        header: "Slot",
        size: 150,
      },
      {
        accessorKey: "room",
        header: "Room",
        size: 150,
      },
      {
        accessorKey: "student",
        header: "Student",
        size: 150,
      },
      {
        accessorKey: "pickup_staff",
        header: "Pickup Staff",
        size: 150,
      },
      {
        accessorKey: "delivery_staff",
        header: "Delivery Staff",
        size: 150,
      },
      {
        accessorKey: "pickup_date_time",
        header: "Pickup Date Time",
        enableEditing: false,
        size: 220,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
      {
        accessorKey: "washing_started_date_time",
        header: "Washing Started Date Time",
        enableEditing: false,
        size: 270,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
      {
        accessorKey: "folding_date_time",
        header: "Folding Date Time",
        enableEditing: false,
        size: 220,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
      {
        accessorKey: "ironing_date_time",
        header: "Ironing Date Time",
        enableEditing: false,
        size: 220,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
      {
        accessorKey: "delivery_date_time",
        header: "Delivery Date Time",
        enableEditing: false,
        size: 220,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },

      {
        accessorKey: "created_at", //normal accessorKey
        header: "Created At",
        enableEditing: false,
        size: 220,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
    ],
    []
  );

  //DELETE action
  const openDeleteConfirmModal = (row: Order) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      axiosInstance
        .delete(`orders/${row.id}/`)
        .then((response) => {
          getOrders();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: orders,
    columns,
    // enableColumnFilterModes: true,
    initialState: { showColumnFilters: true },
    muiFilterTextFieldProps: {
      sx: { m: "0.5rem 0", width: "100%" },
      variant: "outlined",
    },
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
    // columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",

    createDisplayMode: "modal",
    onCreatingRowSave: handleCreateOrder,
    enableEditing: true,
    onEditingRowSave: handleEditOrder,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Order</DialogTitle>
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
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Order</DialogTitle>
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
        Create New Order
      </Button>
    ),
  });

  return (
    <div>{orders.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default ManageOrders;
