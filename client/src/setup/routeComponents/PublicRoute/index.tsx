import React from "react";

type props = {
  component: React.ComponentType<any>;
};

const PublicRoute = ({ component: Component, ...rest }: props) => {
  return <Component {...rest} />;
};

export default PublicRoute;
