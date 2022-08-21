import React, { useState, useEffect, useContext } from "react";

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
  Menu,
  IconButton,
  MenuList,
  MenuItem,
  MenuButton,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { BiPlusMedical, BiExit } from "react-icons/bi";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
// import RenderLogin from "./Account/RenderLogin";

import {
  firstAdminHeaderConfigs,
  secondAdminHeaderConfigs,
} from "../../configs";
import { colorConfigs } from "../../configs";
import { loginInputs } from "./FormSource";
import { createInputs } from "./FormSource";

//database
import { AuthContext } from "../context/AuthContext";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
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
} from "firebase/firestore";
import { auth, db } from "../../database/firebaseConfigs";
import { async } from "@firebase/util";
import { isEmptyArray } from "formik";
import SpinnerComponent from "./Spinner";
import RenderChangePassword from "./Account/RenderChangePassword";
import RenderViewProfile from "./Account/RenderViewProfile";

const { primaryColor, primaryHover, secondaryColor } = colorConfigs;

const renderFirstContent = (firstConfigs) => {
  const [clickedIndex, setClickedIndex] = useState("");

  return firstConfigs.map((item, index) => {
    return (
      <Flex direction="row" align="center" key={item.label}>
        <Link to={item.path}>
          <Box
            onClick={() => setClickedIndex(index)}
            borderLeft=" 1px solid #e8e6e6"
            width="9rem"
            fontSize="0.7em"
            outline="none"
            p="0.5rem 0"
            position="relative"
            border="none"
            color={item.color}
            boxShadow="   4.5px 0px 0px rgba(0, 0, 0, 0),
          12.5px 0px 0px rgba(0, 0, 0, 0),
          30.1px 0px 0px rgba(0, 0, 0, 0),
          100px 0px 0px rgba(0, 0, 0, 0)"
            _after={{
              content: '""',
              left: 0,
              bottom: 0,
              position: "absolute",
              width: "100%",
              height: "0.175rem",
              background: "black",
              transform: "scale(0,1)",
              transition: "transform 0.3s ease",
            }}
            _hover={{
              boxShadow: "none",
              cursor: "pointer",
              _after: {
                transform: "scale(1,1)",
              },
            }}
          >
            {item.label}
          </Box>
        </Link>
      </Flex>
    );
  });
};

const renderSecondContent = (secondConfigs) => {
  const [clickedIndex, setClickedIndex] = useState("");
  return secondConfigs.map((item, index) => {
    return (
      <Flex direction="row" align="center" key={item.label}>
        <Box
          borderLeft="1px solid gray"
          lineHeight="1"
          height={item["label"].length > 13 ? "2.4rem" : "1.5rem"}
          pl="0.5rem"
        ></Box>
        <Link
          to={item.path}
          state={{
            name: undefined,
            id: undefined,
            type: undefined,
            newAppointment: "",
          }}
        >
          <Box
            onClick={() => setClickedIndex(index)}
            borderLeft=" 1px solid #e8e6e6"
            width="9rem"
            fontSize="0.95em"
            p="0.5rem 0"
            fontWeight="700"
            color={item.color}
            outline="none"
            position="relative"
            border="none"
            boxShadow="   4.5px 0px 0px rgba(0, 0, 0, 0),
          12.5px 0px 0px rgba(0, 0, 0, 0),
          30.1px 0px 0px rgba(0, 0, 0, 0),
          100px 0px 0px rgba(0, 0, 0, 0)"
            _after={{
              content: '""',
              left: 0,
              bottom: 0,
              position: "absolute",
              width: "100%",
              height: "0.35rem",
              background: "black",
              transform: "scale(0,1)",
              transition: "transform 0.3s ease",
            }}
            _hover={{
              boxShadow: "none",
              cursor: "pointer",
              _after: {
                transform: "scale(1,1)",
              },
            }}
          >
            {item.label}
          </Box>
        </Link>
      </Flex>
    );
  });
};

const chooseFirstConfigsToRender = (role) => {
  switch (role) {
    case "admin":
      return renderFirstContent(firstAdminHeaderConfigs);

    default:
      return null;
  }
};

const chooseSecondConfigsToRender = (role) => {
  switch (role) {
    case "admin":
      return renderSecondContent(secondAdminHeaderConfigs);

    default:
      return null;
  }
};

const Header = (props) => {
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

  const [fetchedCancerList, setFetchedCancerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [remember, setRemember] = useState(false);

  const cancelRef = React.useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCancerData();

    if (currentUser !== null) {
      fetchUserData(currentUser);
      setError(false);

      setLoadingData(false);
      // dispatch({ type: "LOGIN", payload: currentUser });
    }

    return () => {
      setFetchedCancerList([]);
      setRole("guest");
      setFetchedList([]);
      setName("");
    };
  }, []);

  const fetchCancerData = async () => {
    let list = {};
    try {
      //get cancer data
      const cancerDocSnap = await getDoc(
        doc(db, "guests", "q6hUkmJo4Nq6Laaqtt5q")
      );
      if (cancerDocSnap.exists()) {
        list = { ...cancerDocSnap.data() };
      }
      setFetchedCancerList(list["cancer data"]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async (user) => {
    let userData = [];

    if (user !== undefined) {
      try {
        const adminDocSnap = await getDoc(doc(db, "admins", user.uid));

        if (adminDocSnap.exists()) {
          userData = { ...adminDocSnap.data() };
          // setRole(userData["role"]);
        }

        if (userData["name"] !== undefined) {
          setName(userData["name"]);
        } else {
          setName(userData["patient name"]);
        }

        setFetchedList(userData);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // const Autospace = (str) => {
  //   return str.replace(/[A-Z]/g, " $&").trim();
  // };

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = fetchedCancerList.filter((value) => {
      return value["name"].toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleLogout = (e) => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        const user = null;
        if (!remember) {
          setUsername("");
          setPassword("");
        }
        dispatch({ type: "LOGOUT", payload: user });
        navigate("/cancera-admin/2vKT4Lo84PB90ASaKAR5");
        onClose();
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const renderSignInDialog = (type) => {
    switch (type) {
      case "log out":
        return (
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={() => {
              onClose();
            }}
            isOpen={isOpen}
            isCentered
          >
            <AlertDialogOverlay />

            <AlertDialogContent>
              <AlertDialogHeader>Sign out</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Are you sure you want to sign out?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    onClose();
                  }}
                >
                  No
                </Button>
                <Button
                  id="logoutBtn"
                  colorScheme="red"
                  onClick={() => {
                    handleLogout(event);
                  }}
                  ml={3}
                >
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      case "change password":
        return (
          <RenderChangePassword
            cancelRef={cancelRef}
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            dispatch={dispatch}
            fetchUserData={fetchUserData}
            setUsername={setUsername}
            username={username}
            setPassword={setPassword}
            password={password}
            setData={setData}
            data={data}
            error={error}
            setError={setError}
            setLoadingData={setLoadingData}
            loadingData={loadingData}
            remember={remember}
            setRemember={setRemember}
            role={role}
            setRole={setRole}
          ></RenderChangePassword>
        );
      case "view profile":
        return (
          <RenderViewProfile
            cancelRef={cancelRef}
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            fetchedList={fetchedList}
          ></RenderViewProfile>
        );
      default:
        return null;
    }
  };

  return (
    <Flex p="0.5% 18%" shadow="md" minH="10vh">
      {/* left part header */}
      <Link to={"/"} onClick={() => setClickedIndex(0)}>
        <Flex mr="4rem" align="center" float="left" pt="1.75rem">
          <Box align="center">
            <Text fontSize="3xl" fontWeight={550}>
              Cancera
            </Text>
          </Box>

          <Icon ml={1} w={5} h={5} as={BiPlusMedical} color="red" />
        </Flex>
      </Link>
      {/* middle part header */}

      <Flex direction="column" minW="716px">
        <HStack spacing={8}>{chooseFirstConfigsToRender("admin")}</HStack>
        <HStack spacing={6} pr="2rem">
          {chooseSecondConfigsToRender("admin")}
        </HStack>
      </Flex>

      {/* right part header */}
      <Flex direction="column">
        <Flex justifyContent="space-between" mb="5px">
          <Box textColor="black" fontSize="0.875em" p="2px" mr="2px">
            {name !== "" ? `Hello, ${name} !` : null}
          </Box>

          <Menu>
            <MenuButton
              bgColor="cyan.200"
              as={IconButton}
              aria-label="Options"
              color="black"
              icon={<HamburgerIcon w={4} h={4} />}
              variant="outline"
              size="xs"
            ></MenuButton>
            <MenuList zIndex="1">
              <MenuGroup title="Profile">
                <MenuItem
                  onClick={() => {
                    setRequestDialogType("view profile");
                    onOpen();
                  }}
                >
                  View profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setRequestDialogType("change password");
                    onOpen();
                  }}
                >
                  Change password
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Help">
                <MenuItem>Docs</MenuItem>
                <MenuItem>FAQ</MenuItem>
              </MenuGroup>
              <MenuDivider></MenuDivider>
              <MenuItem
                bgColor="gray.300"
                icon={<BiExit />}
                onClick={() => {
                  setRequestDialogType("log out");
                  onOpen();
                }}
              >
                Log out
              </MenuItem>
              {renderSignInDialog(requestDialogType)}
            </MenuList>
          </Menu>

          {/* <Button
                size="xs"
                bgColor="cyan.300"
                borderWidth="1px"
                mr="5px"
                onClick={() => {
                  onOpen();
                }}
              >
                <Icon as={GiHamburgerMenu} w={4} h={4}></Icon>
              </Button>

              {renderSignInDialog()} */}
        </Flex>

        <Box>
          <Box>
            <InputGroup zIndex="0">
              <Input
                h="40px"
                size="lg"
                variant="outline"
                w="20rem"
                bg="#f4f4f4"
                color="#4a4a4a"
                fontSize="1em"
                type="text"
                value={wordEntered}
                borderColor="2px solid black"
                _placeholder={{
                  fontWeight: "bold",
                  color: "gray",
                  fontSize: "0.75em",
                }}
                placeholder=""
                onChange={handleFilter}
              />
              <InputRightElement
                children={
                  wordEntered.length === 0 ? (
                    <SearchIcon w="5" h="5" color="black.300"></SearchIcon>
                  ) : (
                    <Box cursor="pointer">
                      <CloseIcon
                        w="5"
                        h="5"
                        color="black.300"
                        onClick={clearInput}
                      />
                    </Box>
                  )
                }
              />
            </InputGroup>
          </Box>
          {filteredData.length != 0 && (
            <Box
              p="1%"
              bgColor="white"
              position="absolute"
              overflow="auto"
              overflowY="auto"
              boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
              minW="20rem"
            >
              {filteredData.slice(0, 15).map((value, key) => {
                return (
                  <Box
                    key={key}
                    fontSize="0.875em"
                    fontWeight="500"
                    cursor="pointer"
                  >
                    <Link to={`/search/cancer/${value["name"]}`}>
                      {Capitalize(value["name"])}
                    </Link>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Header;
