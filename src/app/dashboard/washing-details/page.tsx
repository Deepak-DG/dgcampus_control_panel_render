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

export type WashingDetail = {
  id: number;
  order: string;
  staff: string;
  staff_name: string;
  box_id: string;
  checkup_report: string;
  washing_status: string;
  created_at: string;
};

const ManageWashingDetails: React.FC = () => {
  const [washingDetails, setWashingDetails] = useState<WashingDetail[]>([]);
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
    getWashingDetails();
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

  const getWashingDetails = async () => {
    if (!washingDetails.length) {
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
      .get(`washing-details?${query}`)
      .then((response) => {
        setWashingDetails(response.data.results);
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

  const handleCreateWashingDetail = async ({
    values,
    table,
  }: {
    values: WashingDetail;
    table: MRT_TableInstance<WashingDetail>;
  }) => {
    axiosInstance
      .post(`washing-details/`, {
        order: values.order,
        staff: values.staff,
        checkup_report: values.checkup_report,
        washing_status: values.washing_status,
      })
      .then((response) => {
        getWashingDetails();
      })
      .catch((error) => console.error(error));
    table.setCreatingRow(null);
  };

  const handleEditWashingDetail = async ({
    values,
    table,
  }: {
    values: WashingDetail;
    table: MRT_TableInstance<WashingDetail>;
  }) => {
    axiosInstance
      .patch(`washing-details/${values.id}/`, {
        order: values.order,
        staff: values.staff,
        checkup_report: values.checkup_report,
        washing_status: values.washing_status,
      })
      .then((response) => {
        getWashingDetails();
      })
      .catch((error) => console.error(error));
    table.setEditingRow(null);
  };

  const columns = useMemo<MRT_ColumnDef<WashingDetail>[]>(
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
        accessorKey: "order_status",
        header: "Order Status",
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: "checkup_report",
        header: "Checkup Report",
        size: 150,
      },

      {
        accessorKey: "washing_status",
        header: "Washing Status",
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
        size: 220,
        Cell: ({ cell }) => <Box>{formatDate(cell.getValue() as string)}</Box>,
      },
    ],
    []
  );

  const openDeleteConfirmModal = (row: WashingDetail) => {
    if (
      window.confirm("Are you sure you want to delete this washing detail?")
    ) {
      axiosInstance
        .delete(`washing-details/${row.id}/`)
        .then((response) => {
          getWashingDetails();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: washingDetails,
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
    onCreatingRowSave: handleCreateWashingDetail,
    enableEditing: true,
    onEditingRowSave: handleEditWashingDetail,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Washing Detail</DialogTitle>
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
        <DialogTitle variant="h3">Edit Washing Detail</DialogTitle>
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
        Create New Washing Detail
      </Button>
    ),
  });

  return (
    <div>
      {washingDetails.length >= 0 && <MaterialReactTable table={table} />}
    </div>
  );
};

export default ManageWashingDetails;
