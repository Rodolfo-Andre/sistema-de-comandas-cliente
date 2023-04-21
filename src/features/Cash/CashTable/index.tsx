import { Edit, Delete } from "@mui/icons-material";
import {
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  useGridApiRef,
} from "@mui/x-data-grid";
import { FormDialogDelete, DataTable } from "@/components";
import { useOpenClose } from "@/hooks";
import { useContext, useState } from "react";
import { AlertContext } from "@/contexts/AlertSuccess";
import { deleteObject, fetchAll } from "@/services/HttpRequests";
import { ICashGet } from "@/interfaces";
import { handleLastPageDeletion } from "@/utils";
import useSWR, { useSWRConfig } from "swr";
import CashUpdateForm from "../CashUpdateForm";

const CashTable = () => {
  const { data, isLoading } = useSWR("api/cash", () =>
    fetchAll<ICashGet>("api/cash")
  );
  const { mutate } = useSWRConfig();
  const { handleOpen } = useContext(AlertContext);
  const [selectedCash, setSelectedCash] = useState<ICashGet | null>(null);
  const [openDialogD, openDialogDelete, closeDialogDelete] =
    useOpenClose(false);
  /*  const [openDialogU, openDialogUpdate, closeDialogUpdate] =
    useOpenClose(false); */
  const gridApiRef = useGridApiRef();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      width: 100,
      getActions: (cash: GridRowParams<ICashGet>) => {
        return [
          <GridActionsCellItem
            key={cash.row.id}
            icon={<Delete />}
            label="Delete"
            color="error"
            onClick={() => {
              setSelectedCash(cash.row);
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
      />

      <FormDialogDelete
        title={`¿Estás seguro de eliminar la caja número "${selectedCash?.id}"?`}
        open={openDialogD}
        handleCancel={() => {
          closeDialogDelete();
        }}
        handleSuccess={async () => {
          await deleteObject(`api/cash/${selectedCash?.id}`);
          handleLastPageDeletion(gridApiRef, data!.length);
          mutate("api/cash");
          closeDialogDelete();
          handleOpen("La caja se ha eliminado correctamente");
          setSelectedCash(null);
        }}
      />

      {/*  {openDialogU && (
        <CashUpdateForm
          setSelectedCash={setSelectedCash}
          open={openDialogU}
          closeDialog={() => {
            closeDialogUpdate();
          }}
          cash={selectedCash!}
        />
      )} */}
    </>
  );
};

export default CashTable;