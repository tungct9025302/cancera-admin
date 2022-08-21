import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import RenderAdminLogin from "../commons/Account/RenderAdminLogin";
// import {useAuth} from

export const PrivateRoute = ({ children, path }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser && path !== "/cancera-admin/2vKT4Lo84PB90ASaKAR5") {
    return <RenderAdminLogin />;
  } else {
    return children;
  }
};
