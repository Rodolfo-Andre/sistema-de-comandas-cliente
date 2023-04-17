import { Yup } from "@/schemas";
import { ICategoryDishPrincipal } from "@/interfaces/ICategoryDish";

const categoryDishSchema: Yup.ObjectSchema<ICategoryDishPrincipal> = Yup.object(
  {
    nameCatDish: Yup.string().min(5).max(50).required(),
  }
);

export { categoryDishSchema };