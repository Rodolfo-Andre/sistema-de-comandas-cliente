import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import FormDialogDelete from "@/components/FormDialogDelete";
import DataTable from "@/components/DataTable";
import TableUpdateForm from "@/features/Table/TableUpdateForm";
import {
  useGridApiRef,
  GridActionsCellItem,
  GridRowParams,
  GridColDef,
} from "@mui/x-data-grid";
import { useOpenClose } from "@/hooks";
import { useContext, useState } from "react";
import { AlertContext } from "@/contexts/AlertSuccess";
import { deleteObject, fetchAll } from "@/services/HttpRequests";
import { ITableGet } from "@/interfaces";
import { handleLastPageDeletion } from "@/utils";
import useSWR, { useSWRConfig } from "swr";

const Table = () => {
  const { data, isLoading } = useSWR("api/table", () =>
    fetchAll<ITableGet>("api/table")
  );
  const { mutate } = useSWRConfig();
  const { handleOpen } = useContext(AlertContext);
  const [selectedTable, setSelectedTable] = useState<ITableGet | null>(null);
  const [openDialogD, openDialogDelete, closeDialogDelete] =
    useOpenClose(false);
  const [openDialogU, openDialogUpdate, closeDialogUpdate] =
    useOpenClose(false);
  const gridApiRef = useGridApiRef();

  const columns: GridColDef[] = [
    { field: "numTable", headerName: "Número de Mesa", minWidth: 140, flex: 1 },
    {
      field: "numSeats",
      headerName: "Cantidad de Asientos",
      minWidth: 160,
      flex: 5,
    },
    {
      field: "stateTable",
      headerName: "Estado de Mesa",
      minWidth: 140,
      flex: 5,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      minWidth: 100,
      flex: 1,
      getActions: (table: GridRowParams<ITableGet>) => {
        if (table.row.stateTable === "Ocupado") return [];

        return [
          <GridActionsCellItem
            key={table.row.numTable}
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            color="warning"
            onClick={() => {
              setSelectedTable(table.row);
              openDialogUpdate();
            }}
          />,
          <GridActionsCellItem
            key={table.row.numTable}
            icon={<Delete />}
            label="Delete"
            color="error"
            onClick={() => {
              setSelectedTable(table.row);
              openDialogDelete();
            }}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <DataTable
        apiRef={gridApiRef}
        columns={columns}
        loading={isLoading}
        rows={data}
        getRowId={(row) => row.numSeats}
      />

      <FormDialogDelete
        title={`¿Estás seguro de eliminar la mesa "${selectedTable?.numTable}"?`}
        open={openDialogD}
        handleCancel={() => {
          closeDialogDelete();
        }}
        handleSuccess={async () => {
          await deleteObject(`api/table/${selectedTable?.numTable}`);
          handleLastPageDeletion(gridApiRef, data!.length);
          mutate("api/table");
          closeDialogDelete();
          handleOpen("La mesa se ha eliminado correctamente");
          setSelectedTable(null);
        }}
      />

      {openDialogU && (
        <TableUpdateForm
          setSelectedTable={setSelectedTable}
          open={openDialogU}
          closeDialog={() => {
            closeDialogUpdate();
          }}
          table={selectedTable!}
        />
      )}
    </>
  );
};

export default Table;
