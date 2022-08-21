import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import {useAuth} from

export const PrivateComponent = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return null;
  } else {
    return children;
  }
};
