import React, { Component, useState, useContext } from "react";
import {
  Text,
  HStack,
  Box,
  Flex,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  useColorModeValue,
  Stack,
  FormControl,
  FormLabel,
  Checkbox,
  Heading,
  FormHelperText,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { BiPlusMedical } from "react-icons/bi";
import { loginInputs } from "../../FormSource";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AuthContext } from "../../../context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  connectFirestoreEmulator,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../../database/firebaseConfigs";
import { async } from "@firebase/util";
import { isEmptyArray } from "formik";
import { useNavigate } from "react-router-dom";
import SpinnerComponent from "../../Spinner";
import SetRole from "../../../admin/manage/role";
import { useEffect } from "react";

const RenderAdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [requestDialogType, setRequestDialogType] = useState(false);
  const [role, setRole] = useState("guest");
  const { dispatch } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [data, setData] = useState({});
  const [fetchedList, setFetchedList] = useState([]);
  const [logged, setLogged] = useState(false);
  const [fetchedCancerList, setFetchedCancerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remember, setRemember] = useState(false);
  const cancelRef = React.useRef();

  useEffect(() => {
    onOpen();
  }, []);

  const isError = (attribute) => {
    switch (attribute) {
      case "username":
        if (username === "") {
          return true;
        }
        return false;
      case "password":
        if (password === "") {
          return true;
        }
        return false;

      default:
        return false;
    }
  };

  const isInvalidInput = (attribute) => {
    switch (attribute) {
      case "username":
        return !username.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

      case "password":
        return !password.match(/[a-zA-Z0-9]{6,}/);

      case "name":
        return name.match(/\d+/g);

      default:
        return false;
    }
  };
  const checkValidLogin = () => {
    return (
      !isError("username") &&
      !isError("password") &&
      !isInvalidInput("username") &&
      !isInvalidInput("password")
    );
  };

  const findValue = (key) => {
    switch (key) {
      case "username":
        return username;
      case "password":
        return password;
      case "name":
        return name;
      default:
        return null;
    }
  };
  const handleSet = (value, key) => {
    switch (key) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "name":
        setName(value);
        break;
      default:
        null;
    }
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    if (error === true) {
      setError(false);
    }

    setData({ ...data, [id]: value });
  };

  const handleLogin = (e) => {
    let userData = [];
    setLoadingData(true);
    signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const adminDocSnap = await getDoc(doc(db, "admins", user.uid));
        if (adminDocSnap.exists()) {
          userData = { ...adminDocSnap.data() };
        }

        if (userData["role"] === "admin") {
          setError(false);
          dispatch({ type: "LOGIN", payload: user });
          handleSetLoginTime(user, userData);
          setLogged(true);
          setLoadingData(false);
          navigate("/manage-role");
          onClose();
        } else {
          setError(false);
          handleSetLoginTime(user, userData);
          setLoadingData(false);
          alert("Failed to authenticate!");
        }
      })
      .catch((error) => {
        setError(true);
        setLoadingData(false);
      });
  };

  const handleSetLoginTime = async (user, userData) => {
    await updateDoc(doc(db, "admins", user["uid"]), {
      ["last login"]: serverTimestamp(),
    });
  };

  const renderSmallSpinner = () => {
    return (
      <Box
        margin="auto"
        w="100%"
        align="center"
        top="50% "
        position="relative"
        transform="translateY(-50%)"
      >
        <Spinner
          thickness="3px"
          speed="0.65s"
          // emptyColor="gray.300"
          color="white.500"
          size="md"
          mb="4px"
        />
      </Box>
    );
  };

  const renderAlertDialog = () => {
    return (
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => {
          if (!remember) {
            setUsername("");
            setPassword("");
          }
          onClose();
        }}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            <Stack align="center" borderBottom="2px">
              <Heading fontSize={"3xl"} align="center" pt="5px">
                Sign in your account to manage patients
              </Heading>
              <Flex align="center" p="10px">
                <Box align="center">
                  <Text fontSize="2xl" fontWeight={550}>
                    Cancera
                  </Text>
                </Box>

                <Icon ml={1} w={5} h={5} as={BiPlusMedical} color="red" />
              </Flex>
            </Stack>
          </AlertDialogHeader>

          <AlertDialogBody>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              pb="-20px"
              p="0 10px 0 10px"
            >
              <Stack spacing={4}>
                {loginInputs.map((input) => {
                  return (
                    <FormControl
                      id={input["id"]}
                      key={input["id"]}
                      isInvalid={
                        isError(input["id"].toString()) ||
                        isInvalidInput(input["id"].toString()) ||
                        error
                      }
                    >
                      <FormLabel>{input["label"]}</FormLabel>
                      <Input
                        type={input["type"]}
                        value={findValue(input["id"])}
                        bgColor="gray.200"
                        borderWidth="1px"
                        borderColor="gray.300"
                        onChange={(e) => {
                          handleSet(e.target.value, input["id"]);
                          handleInput(event);
                          // fetchUserData();
                        }}
                        _placeholder={{
                          fontSize: "15px",
                        }}
                        placeholder={input["placeholder"]}
                      />
                      {isError(input["id"]) ? (
                        <FormErrorMessage>
                          {input["noInputMessage"]}
                        </FormErrorMessage>
                      ) : isInvalidInput(input["id"]) ? (
                        <FormErrorMessage>
                          {input["wrongTypeInputMessage"]}
                        </FormErrorMessage>
                      ) : error ? (
                        <FormErrorMessage>
                          {input["failedLoginMessage"]}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                  );
                })}

                <Stack spacing={4}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox
                      defaultChecked={remember}
                      onChange={() => setRemember(!remember)}
                    >
                      Remember me
                    </Checkbox>
                    <Box
                      textDecoration="underline"
                      cursor="pointer"
                      textColor="gray"
                    >
                      Forgot your password?
                    </Box>
                  </Stack>

                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Text></Text>

                    {/* <Box
                  textDecoration="underline"
                  cursor="pointer"
                  // onClick={() => {
                  //   setCreate(true);
                  // }}
                  textColor="gray"
                >
                  Create an account
                </Box> */}
                  </Stack>
                  <Button
                    id="loginBtn"
                    bg={checkValidLogin() ? "blue.400" : "gray.200"}
                    color={checkValidLogin() ? "white" : "black"}
                    _hover={{
                      bg: checkValidLogin() ? "blue.500" : "gray.300",
                    }}
                    type="login"
                    style={
                      !checkValidLogin() ? { pointerEvents: "none" } : null
                    }
                    onClick={() => {
                      handleLogin(event);
                    }}
                  >
                    {loadingData ? renderSmallSpinner() : "Sign in"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Text fontSize="0.875em" fontStyle="italic">
              If you are a staff of the clinic, please go to the help desk to
              get a staff account.
            </Text>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  return currentUser !== null ? null : renderAlertDialog();
};
export default RenderAdminLogin;
