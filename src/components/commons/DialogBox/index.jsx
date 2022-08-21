import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Flex,
  Text,
  VStack,
  Popover,
  PopoverTrigger,
  Button,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverFooter,
} from "@chakra-ui/react";

import background from "../../../pictures/dialogbox_background.jpg";

const DialogBox = (props) => {
  const [id, setId] = useState();
  const [boxTitle, setType] = useState();
  const navigate = useNavigate();
  const adminDialogBoxTitles = ["add user", "manage role", "search"];

  useEffect(() => {
    if (props.pid !== undefined) {
      setId(props.pid);
    }
  }, []);

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const Dialog = ({ boxTitle }) => {
    const initialFocusRef = React.useRef();

    return (
      <Button
        display="block"
        m="1rem"
        shadow="md"
        bgColor={boxTitle === props.boxTitle ? "cyan.300" : "none"}
        borderWidth="2px"
        borderColor="#9db5fa"
        wordBreak="break-word"
        minW="180px"
        onClick={() => {
          setType(boxTitle);

          switch (boxTitle) {
            case "manage role":
              navigate("/manage-role");
              break;
            case "add user":
              navigate("/add-user");
              break;
            case "search":
              navigate("/search");
              break;
            default:
              break;
          }
        }}
      >
        {boxTitle.toUpperCase()}
      </Button>
    );
  };

  return (
    <Flex
      shadow="md"
      borderWidth="2px"
      borderColor="gray.300"
      mt="2rem"
      direction="column"
      w="30%"
      minW="220px"
      minH="74vh"
      backgroundImage={background}
      backgroundPosition="10%"
      backgroundSize="auto"
    >
      <Text
        fontSize="30px"
        fontWeight="600"
        letterSpacing="-.42px"
        color="#0c1d4f"
        p="1rem 0 0 1rem"
      >
        Manage users:
      </Text>

      <Flex direction="column" spacing={8} align="left">
        {adminDialogBoxTitles.map((name) => {
          return <Dialog key={name} boxTitle={name} />;
        })}
      </Flex>
    </Flex>
  );
};

export default DialogBox;
