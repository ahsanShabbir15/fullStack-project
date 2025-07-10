import * as Yup from "yup";

const signinValidation = Yup.object({
  email: Yup.string().email("invalid Email").required("Email is required"),
  password: Yup.string().required("password is required"),
});
export default signinValidation;
