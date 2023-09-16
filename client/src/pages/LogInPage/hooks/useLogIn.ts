import { FormikState, useFormik } from "formik";
import loginSchema from "../formSchema";
import React, { useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StoreStateTypeDef from "../../../setup/store/types/stateTypeDef";
import { AppContext } from "../../../setup/context";
import { AlertState } from "../../../setup/context/types";
import { AnyAction, Dispatch } from "redux";
import { setId, setToken } from "../../../setup/store/actions";
import { ResponsdeCodes } from "../../../common/errorCodes";

type InitialValues = {
  email: string;
  password: string;
  [key: string]: string;
};

const handleLogIn = async (
  values: InitialValues,
  resetForm: (
    nextState?: Partial<FormikState<InitialValues>> | undefined
  ) => void,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction,
  uri: string,
  setAlertState: React.Dispatch<React.SetStateAction<AlertState>>,
  dispatch: Dispatch<AnyAction>
) => {
  setIsDisabled(true);

  const { email, password } = values;

  if (!uri.trim()) {
    navigate("/");
    return;
  }

  const rawData = await fetch(`${uri}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const jsonData = await rawData.json();

  if (rawData.ok) {
    const { userId, token } = jsonData;

    dispatch(setToken(token));
    dispatch(setId(userId));

    navigate("/app/dashboard");
    setIsDisabled(false);
    resetForm();
    return;
  } else if (jsonData.status === ResponsdeCodes.ERROR) {
    setAlertState({
      messages: [
        "Internal server error!",
        "Please restart the app if problem persues.",
      ],
    });
    setIsDisabled(false);
    return;
  } else if (jsonData.status === ResponsdeCodes.INVALID_USER) {
    setAlertState({
      messages: [
        "Provided email does not exists!",
        "New to Sweeter? Maybe Sign Up first?",
      ],
    });
    setIsDisabled(false);
    return;
  } else if (jsonData.status === ResponsdeCodes.INVALID_CEDENTIALS) {
    setAlertState({
      messages: ["Provided password is not a match for given email!"],
    });
    setIsDisabled(false);
    return;
  }
};

const useLogIn = (
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uri = useSelector((state: StoreStateTypeDef) => state.sweeter_uri);

  const { setAlertState } = useContext(AppContext);

  const initialValues: InitialValues = {
    email: "",
    password: "",
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
    initialValues,
    validationSchema: loginSchema,
    onSubmit(values, { resetForm }) {
      handleLogIn(
        values,
        resetForm,
        setIsDisabled,
        navigate,
        uri,
        setAlertState,
        dispatch
      );
    },
  });

  return {
    handleSubmit,
    handleBlur,
    errors,
    values,
    handleChange,
    touched,
    resetForm,
  };
};

export default useLogIn;
