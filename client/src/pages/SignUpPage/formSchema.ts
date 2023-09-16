import * as Yup from "yup";

const signUpSchema = Yup.object({
  name: Yup.string().min(2).required("Please provide a valid name!"),
  email: Yup.string().email().required("Please provide a valid email!"),
  password: Yup.string().min(6).required("Please provide a valid password!"),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Password must match!"),
});

export default signUpSchema;
