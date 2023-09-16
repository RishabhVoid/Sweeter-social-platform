import { FormikState, useFormik } from "formik";
import signUpSchema from "../formSchema";
import React, { useContext } from "react";
import { AppContext } from "../../../setup/context";
import { useDispatch, useSelector } from "react-redux";
import StoreStateTypeDef from "../../../setup/store/types/stateTypeDef";
import { AlertState } from "../../../setup/context/types";
import { AnyAction, Dispatch } from "redux";
import { setId, setToken } from "../../../setup/store/actions";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ResponsdeCodes } from "../../../common/errorCodes";

type InitialValues = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  [key: string]: string;
};

const handleRegister = async (
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  values: InitialValues,
  pictureFile: File,
  resetForm: (
    nextState?: Partial<FormikState<InitialValues>> | undefined
  ) => void,
  uri: string,
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>,
  dispatch: Dispatch<AnyAction>,
  navigate: NavigateFunction
) => {
  setDisabled(true);

  const formData = new FormData();
  Object.keys(values).map((key) => {
    if (key === "confirm_password") return;
    formData.append(key, values[key]);
  });

  formData.append("picture", pictureFile);
  formData.append("picturePath", pictureFile.name);

  if (!uri.trim()) {
    navigate("/");
    return;
  }

  const rawData = await fetch(`${uri}/auth/register`, {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      email: values.email,
    },
    body: formData,
  });

  const jsonData = await rawData.json();

  if (jsonData.status === ResponsdeCodes.ERROR) {
    setAlertState({
      messages: [
        "Internal server error!",
        "Reload the app if problem persues!",
      ],
    });
    setDisabled(false);
    return;
  } else if (jsonData.status === ResponsdeCodes.PRE_EXISTING_USER) {
    setAlertState({
      messages: ["Given email already exists!"],
    });
    setDisabled(false);
    return;
  }

  const { token, userId } = jsonData;

  dispatch(setToken(token));
  dispatch(setId(userId));

  navigate("/app/dashboard");

  setDisabled(false);
  resetForm();
};

const useSignUp = (
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  pictureFile: File | null
) => {
  const { setAlertState } = useContext(AppContext);
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues: InitialValues = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const {
    handleSubmit,
    handleBlur,
    errors,
    values,
    handleChange,
    touched,
    resetForm,
  } = useFormik({
    validationSchema: signUpSchema,
    initialValues: initialValues,
    onSubmit: (values, { resetForm }) => {
      if (!pictureFile) {
        setAlertState({
          messages: ["Please provide a profile picture!"],
        });
        return;
      }
      handleRegister(
        setDisabled,
        values,
        pictureFile,
        resetForm,
        uri,
        setAlertState,
        dispatch,
        navigate
      );
    },
  });

  return {
    handleSubmit,
    handleBlur,
    handleChange,
    resetForm,
    errors,
    values,
    touched,
  };
};

export default useSignUp;
