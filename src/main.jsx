import React from "react";
import ReactDOM from "react-dom/client";
import { extendTheme } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import App from "./components/App";
import { AuthContextProvider } from "./components/context/AuthContext";

export const theme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: false,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
