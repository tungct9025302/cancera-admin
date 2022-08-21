import React, { useContext } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Header from "./commons/Header";
import Footer from "./commons/Footer";
import { routeConfigs } from "../configs";
import { AuthContext } from "./context/AuthContext";
import { PrivateComponent } from "../components/private component";
import { AuthContextProvider } from "./context/AuthContext";
import { PrivateRoute } from "../components/private route";
const App = () => {
  const renderRoutes = () => {
    return routeConfigs.map(({ path, element }) => (
      <Route
        exact
        path={path}
        key={path}
        element={<PrivateRoute path={path}>{element}</PrivateRoute>}
        // element={element}
      />
    ));
  };

  const Layout = ({ children }) => {
    return (
      <Box>
        <PrivateComponent>
          <Header position="absolute" />
        </PrivateComponent>
        <Box
          h="80vh"
          // position="relative"
          margin="0"
          padding="0"
          overflow="auto"
          pb="10px"
        >
          {children}
        </Box>
        <PrivateComponent>
          <Footer />
        </PrivateComponent>
      </Box>
    );
  };

  return (
    <AuthContextProvider>
      <BrowserRouter>
        {/* <Header position="absolute" /> */}
        {/* <Box h="10vh"></Box>
      <Box
        h="80vh"
        // position="relative"
        margin="0"
        padding="0"
        overflow="auto"
        pb="10px"
      > */}
        <Layout>
          <Routes>{renderRoutes()}</Routes>
        </Layout>
        {/* </Box> */}
        {/* <Footer /> */}
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
