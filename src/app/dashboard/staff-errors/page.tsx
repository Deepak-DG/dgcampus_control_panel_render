"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";
import { formatDate } from "@/app/lib/DateUtils/dateUtils";
import DeleteIcon from "@mui/icons-material/Delete";

export type StaffError = {
  id: number;
  staff: string;
  order: string | null;
  staff_current_role: string | null;
  box_id: string | null;
  order_status: string | null;
  number_of_clothes: number | null;
  number_of_clothes_folded: number | null;
  number_of_clothes_ironed: number | null;
  error_code: string;
  resolve_status: string;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
};

const ManageStaffErrors: React.FC = () => {
  const [staffErrors, setStaffErrors] = useState<StaffError[]>([]);
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
    getStaffErrors();
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

  const getStaffErrors = async () => {
    if (!staffErrors.length) {
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
      .get(`staff-errors?${query}`)
      .then((response) => {
        setStaffErrors(response.data.results);
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

  const columns = useMemo<MRT_ColumnDef<StaffError>[]>(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
        header: "ID",
        enableEditing: false,
        size: 100,
      },
      {
        accessorKey: "staff",
        header: "Staff",
        size: 150,
      },
      {
        accessorKey: "order",
        header: "Order",
        size: 150,
      },
      {
        accessorKey: "staff_current_role",
        header: "Current Role",
        size: 150,
      },
      {
        accessorKey: "box_id",
        header: "Box ID",
        size: 150,
      },
      {
        accessorKey: "order_status",
        header: "Order Status",
        size: 150,
      },
      {
        accessorKey: "number_of_clothes",
        header: "No. of Clothes",
        size: 150,
      },
      {
        accessorKey: "number_of_clothes_folded",
        header: "No. of Clothes Folded",
        size: 150,
      },
      {
        accessorKey: "number_of_clothes_ironed",
        header: "No. of Clothes Ironed",
        size: 150,
      },
      {
        accessorKey: "error_code",
        header: "Error Code",
        size: 150,
      },
      {
        accessorKey: "resolve_status",
        header: "Resolve Status",
        size: 150,
      },
      {
        accessorKey: "resolved_by",
        header: "Resolved By",
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

  const openDeleteConfirmModal = (row: any) => {
    if (window.confirm("Are you sure you want to delete this staff error?")) {
      axiosInstance
        .delete(`staff-errors/${row.original.id}/`)
        .then((response) => {
          getStaffErrors();
        })
        .catch((error) => console.error(error));
    }
  };

  const table = useMaterialReactTable({
    data: staffErrors,
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
    enableEditing: true, // Disable editing
    // enableRowActions: false, // Disable row actions
    renderTopToolbarCustomActions: () => null, // No custom actions (e.g., no create button)
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <div>{staffErrors.length >= 0 && <MaterialReactTable table={table} />}</div>
  );
};

export default ManageStaffErrors;
