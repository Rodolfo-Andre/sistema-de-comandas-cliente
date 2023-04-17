import { Typography } from "@mui/material";
import { ContentBox } from "@/components";
import { EmployeeTable, EmployeeAddForm } from "@/features";

const EmployeeSection = () => {
  return (
    <ContentBox
      sxProps={{
        padding: 2,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Empleados
      </Typography>

      <EmployeeAddForm />

      <EmployeeTable />
    </ContentBox>
  );
};

export default EmployeeSection;
