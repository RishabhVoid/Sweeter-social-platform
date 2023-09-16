import { Navigate } from "react-router-dom";
import React from "react";

type props = {
  component: React.ComponentType<any>;
  isAuthenticated: boolean;
};

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}: props) => {
  if (isAuthenticated) {
    return <Component {...rest} />;
  }
  return <Navigate to={"/"} />;
};

export default PrivateRoute;
