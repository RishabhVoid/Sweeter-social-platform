import * as Yup from "yup";

const signUpSchema = Yup.object({
  email: Yup.string().email().required("Please provide a valid email!"),
  password: Yup.string().min(6).required("Please provide a valid password!"),
});

export default signUpSchema;
