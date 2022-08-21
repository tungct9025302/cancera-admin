import React from "react";
import { Box } from "@chakra-ui/react";

import { colorConfigs } from "../../configs";

const { primaryColor } = colorConfigs;

const Footer = () => {
  return <Box h="10vh" position="relative" bottom="0" bg={primaryColor}></Box>;
};

export default Footer;
