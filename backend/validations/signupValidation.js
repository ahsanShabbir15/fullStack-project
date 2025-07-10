import * as Yup from "yup";

const signupValidation = Yup.object({
  name: Yup.string().min(3).max(25).required("Name is required"),
  email: Yup.string()
    .email("invalid email address")
    .required("Email is required"),
  password: Yup.string().required("password id required").min(5),
  confirmPassword: Yup.string()
    .required("confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});
export default signupValidation;
