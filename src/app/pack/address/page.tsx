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

export type Address = {
  id: number;
  user: number;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_primary: boolean;
  created_at: string;
};

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
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
    getAddresses();
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

  const getAddresses = async () => {
    if (!addresses.length) {
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
      .get(`pack/address?${query}`)
      .then((response) => {
        console.log(response.data);
        setAddresses(response.data.results);
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

  const handleCreateAddress = async ({
    values,
    table,
  }: {
    values: Address;
    table: MRT_TableInstance<Address>;
  }) => {
    axiosInstance
      .post(`pack/address/`, {
        user: values.user,
        address_line_1: values.address_line_1,
        address_line_2: values.address_line_2,
        address_line_3: values.address_line_3,
        landmark: values.landmark,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        country: values.country,
        is_primary: values.is_primary,
      })
      .then((response) => {
        getAddresses();
      })
      .catch((error) => console.error(error));

    table.setCreatingRow(null);
  };

  const handleEditAddress = async ({
    values,
    table,
  }: {
    values: Address;
    table: MRT_TableInstance<Address>;
  }) => {
    setTest(values);

    axiosInstance
      .patch(`pack/address/${values.id}/`, {
        user: values.user,
        address_line_1: values.address_line_1,
        address_line_2: values.address_line_2,
        address_line_3: values.address_line_3,
        landmark: values.landmark,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        country: values.country,
        is_primary: values.is_primary,
      })
      .then((response) => {
        getAddresses();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<Address>[]>(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
        header: "ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "user",
        header: "User ID",
        size: 150,
      },
      {
        accessorKey: "address_line_1",
        header: "Address Line 1",
        size: 200,
      },
      {
        accessorKey: "address_line_2",
        header: "Address Line 2",
        size: 200,
      },
      {
        accessorKey: "address_line_3",
        header: "Address Line 3",
        size: 200,
      },
      {
        accessorKey: "landmark",
        header: "Landmark",
        size: 200,
      },
      {
        accessorKey: "city",
        header: "City",
        size: 150,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 150,
      },
      {
        accessorKey: "pincode",
        header: "Pincode",
        size: 150,
      },
      {
        accessorKey: "country",
        header: "Country",
        size: 150,
      },
      {
        accessorKey: "is_primary",
        header: "Is Primary",
        size: 100,
        Cell: ({ cell }) => <Box>{JSON.stringify(cell.getValue())}</Box>,
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

  //DELETE action
  const openDeleteConfirmModal = (row: Address) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      console.log(row.id);
      axiosInstance
        .delete(`pack/address/${row.id}/`)
        .then((response) => {
          console.log(JSON.stringify(response));
          getAddresses();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: addresses,
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
    onCreatingRowSave: handleCreateAddress,
    enableEditing: true,
    onEditingRowSave: handleEditAddress,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Address</DialogTitle>
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
        <DialogTitle variant="h3">Edit Address</DialogTitle>
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
        Create New Address
      </Button>
    ),
  });

  return (
    <div>{addresses.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default Addresses;
