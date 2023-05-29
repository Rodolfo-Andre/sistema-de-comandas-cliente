import ComboBox from "@/components/ComboBox";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ImageDropzone from "@/components/ImageDropzone";
import dishSchema from "@/schemas/Dish";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import { useSWRConfig } from "swr";
import { createObject } from "@/services/HttpRequests";
import { ICategoryDishGet } from "@/interfaces/ICategoryDish";
import { IDishCreateOrUpdate, IDishGet } from "@/interfaces/IDish";
import { IFormProps } from "@/interfaces/IFormProps";
import { uploadToCloudinary } from "@/utils";
import { Formik } from "formik";
import { useState } from "react";
import { showSuccessToastMessage } from "@/lib/Messages";

const initialValues: IDishCreateOrUpdate = {
  nameDish: "",
  priceDish: 0.0,
  imgDish: "",
};

interface IDishAddFormProps extends IFormProps<IDishCreateOrUpdate> {
  data: ICategoryDishGet[];
}

const DishAddForm = ({ setFormikRef, data }: IDishAddFormProps) => {
  const theme = useTheme();
  const { mutate } = useSWRConfig();
  const [file, setFile] = useState<File | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <Formik<IDishCreateOrUpdate>
        initialValues={initialValues}
        innerRef={(ref) => setFormikRef(ref!)}
        validateOnChange={false}
        validationSchema={dishSchema}
        onSubmit={async (newDish) => {
          if (file) {
            const urlImage = await uploadToCloudinary(file);
            newDish.imgDish = urlImage;
          }

          await createObject<IDishGet, IDishCreateOrUpdate>(
            "api/dish",
            newDish
          );
          mutate("api/dish");

          showSuccessToastMessage("El plato se ha registrado correctamente");
        }}
      >
        {({
          values,
          errors,
          handleChange,
          setFieldValue,
          isSubmitting,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1.5} marginY={2}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <ImageDropzone
                  isSubmitting={isSubmitting}
                  onDrop={(file) => {
                    setFile(file);
                    setFieldValue("imgDish", file.name);
                  }}
                />
                {errors.imgDish && (
                  <Typography
                    sx={{
                      color: `${theme.palette.error.main}`,
                    }}
                    variant="caption"
                  >
                    {errors.imgDish}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="nameDish"
                  type="text"
                  label="Plato"
                  error={Boolean(errors.nameDish)}
                  value={values.nameDish}
                  onChange={handleChange}
                  helperText={errors.nameDish}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  id="priceDish"
                  type="text"
                  label="Precio"
                  error={Boolean(errors.priceDish)}
                  value={values.priceDish}
                  onChange={handleChange}
                  helperText={errors.priceDish}
                  disabled={isSubmitting}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <ComboBox
                  id="id"
                  label="nameCatDish"
                  values={data}
                  handleChange={(category: ICategoryDishGet | null) => {
                    setFieldValue("categoryDishId", category?.id);
                  }}
                  disabled={isSubmitting}
                  textFieldProps={{
                    label: "Categoría",
                    error: Boolean(errors.categoryDishId),
                    helperText: errors.categoryDishId,
                  }}
                />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </ThemeProvider>
  );
};

export default DishAddForm;
