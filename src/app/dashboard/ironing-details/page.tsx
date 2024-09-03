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

export type IroningDetail = {
  id: number;
  order: string;
  staff: string;
  staff_name: string;
  box_id: string;
  number_of_clothes_ironed: number;
  checkup_report: string;
  ironing_status: string;
  created_at: string;
};

const ManageIroningDetails: React.FC = () => {
  const [ironingDetails, setIroningDetails] = useState<IroningDetail[]>([]);
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
    getIroningDetails();
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

  const getIroningDetails = async () => {
    if (!ironingDetails.length) {
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
      .get(`ironing-details?${query}`)
      .then((response) => {
        setIroningDetails(response.data.results);
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

  const handleCreateIroningDetail = async ({
    values,
    table,
  }: {
    values: IroningDetail;
    table: MRT_TableInstance<IroningDetail>;
  }) => {
    axiosInstance
      .post(`ironing-details/`, {
        order: values.order,
        staff: values.staff,
        number_of_clothes_ironed: values.number_of_clothes_ironed,
        checkup_report: values.checkup_report,
        ironing_status: values.ironing_status,
      })
      .then((response) => {
        getIroningDetails();
      })
      .catch((error) => console.error(error));
    table.setCreatingRow(null);
  };

  const handleEditIroningDetail = async ({
    values,
    table,
  }: {
    values: IroningDetail;
    table: MRT_TableInstance<IroningDetail>;
  }) => {
    axiosInstance
      .patch(`ironing-details/${values.id}/`, {
        order: values.order,
        staff: values.staff,
        number_of_clothes_ironed: values.number_of_clothes_ironed,
        checkup_report: values.checkup_report,
        ironing_status: values.ironing_status,
      })
      .then((response) => {
        getIroningDetails();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<IroningDetail>[]>(
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
        accessorKey: "staff_name",
        header: "Staff Name",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "box_id",
        header: "Box ID",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "number_of_clothes_ironed",
        header: "Number of Clothes Ironed",
        size: 150,
      },
      {
        accessorKey: "checkup_report",
        header: "Checkup Report",
        size: 150,
      },
      {
        accessorKey: "ironing_status",
        header: "Ironing Status",
        size: 150,
      },
      {
        accessorKey: "staff",
        header: "Staff",
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableEditing: false,
        size: 250,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
    ],
    []
  );

  const openDeleteConfirmModal = (row: IroningDetail) => {
    if (
      window.confirm("Are you sure you want to delete this ironing detail?")
    ) {
      axiosInstance
        .delete(`ironing-details/${row.id}/`)
        .then((response) => {
          getIroningDetails();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: ironingDetails,
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
    onCreatingRowSave: handleCreateIroningDetail,
    enableEditing: true,
    onEditingRowSave: handleEditIroningDetail,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Ironing Detail</DialogTitle>
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
        <DialogTitle variant="h3">Edit Ironing Detail</DialogTitle>
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
        Create New Ironing Detail
      </Button>
    ),
  });

  return <div>{ironingDetails && <MaterialReactTable table={table} />}</div>;
};

export default ManageIroningDetails;
