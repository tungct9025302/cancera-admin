import React, { useState, useEffect, useContext } from "react";

import { useLocation, Link } from "react-router-dom";
import {
  Text,
  Box,
  Flex,
  Badge,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Icon,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialog,
  Button,
  Select,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { MinusIcon, EditIcon } from "@chakra-ui/icons";
import { FaTools } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";

import DialogBox from "../../commons/DialogBox";
import SpinnerComponent from "../../commons/Spinner";

import SearchAppointments from "./appointments";
import SearchGeneralExaminations from "./general examinations";
import SearchTreatments from "./treatments";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import { auth, db } from "../../../database/firebaseConfigs";
import { isEmptyArray } from "formik";

const Search = () => {
  const [type, setType] = useState("");
  const [filteredDate, setFilteredDate] = useState("");
  const [filteredName, setFilteredName] = useState("");
  const [fetchedAllUsers, setFetchedAllUsers] = useState();
  const [fetchedList, setFetchedList] = useState();
  const [emptyList, setEmptyList] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useContext(AuthContext);
  const cancelRef = React.useRef();
  const location = useLocation();

  let properties = {
    allTypes: ["Appointments", "General examinations", "Treatments"],
  };
  //database
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let userData = [];
    let allUsersData = [];
    const querySnapshotForUsers = await getDocs(collection(db, "users"));
    querySnapshotForUsers.forEach((doc) => {
      allUsersData.push({ account_id: doc.id, ...doc.data() });
    });
    const querySnapshotForPatients = await getDocs(collection(db, "patients"));
    querySnapshotForPatients.forEach((doc) => {
      allUsersData.push({ account_id: doc.id, ...doc.data() });
    });
    setFetchedAllUsers(allUsersData);

    const docSnap = await getDoc(doc(db, "admins", currentUser.uid));
    if (docSnap.exists()) {
      userData = { ...docSnap.data() };
    }
    setFetchedList(userData);
  };

  //   const handleRemove = async (e) => {
  //     e.preventDefault();
  //     const existInList = () => {
  //       fetchedAllUsers.map((user) => {
  //         if (user["account_id"] === deletedUserID) {
  //           setExistedInList(true);
  //         }
  //       });
  //       return existedInList;
  //     };

  //     try {
  //       if (fetchedAllUsers === undefined || existInList()) {
  //         alert(
  //           "Error: This patient is already not existed in your patient list."
  //         );
  //         window.location.reload();
  //       } else {
  //         getAuth()
  //           .deleteUser(deletedUserID)
  //           .then(() => {
  //             window.location.reload();
  //           })
  //           .catch((error) => {
  //             alert("Error deleting user:", error);
  //           });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   const handleSetRoleByID = async (e, userID, value) => {
  //     e.preventDefault();

  //     const userRef = doc(db, "users", userID);

  //     // Set the "capital" field of the city 'DC'

  //     const existInList = () => {
  //       fetchedAllUsers.map((user) => {
  //         if (user["account_id"] === userID) {
  //           setExistedInList(true);
  //         }
  //       });
  //       return existedInList;
  //     };

  //     try {
  //       if (fetchedAllUsers === undefined || existInList()) {
  //         alert(
  //           "Error: This patient is already not existed in your patient list."
  //         );
  //         window.location.reload();
  //       } else {
  //         await updateDoc(userRef, {
  //           role: value.toLowerCase(),
  //         });

  //         window.location.reload();
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        (areObjects && !deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }
  function isObject(object) {
    return object != null && typeof object === "object";
  }

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const renderAlertDialog = () => {
    return (
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete this user?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text mb="5px">
              Are you sure you want to delete this user from your patient list?
            </Text>
            <Text>
              Deleted user can not be recovered and you have to manually add the
              user back.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={() => {
                handleRemove(event);
                onClose();
              }}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const renderFilteredPatientList = () => {
    return fetchedAllUsers !== undefined
      ? fetchedAllUsers
          .filter(
            (filteredRole) =>
              filteredRole["role"].toLowerCase() === role.toLowerCase()
          )
          .map((patient) => {
            return <Box key={patient["pid"]}>{renderData(patient)}</Box>;
          })
      : null;
  };

  const renderAllUsers = () => {
    return fetchedAllUsers !== undefined
      ? fetchedAllUsers.map((user, index) => {
          return <Box key={index}>{renderData(user, index)}</Box>;
        })
      : null;
  };

  const renderData = (user, index) => {
    return (
      <Box
        w="100%"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bgColor="#fcfcfc"
        display="flex"
        direction="column"
        justifyContent="space-between"
        p="6"
      >
        {/* <Link
          to={`/search-patient/id=${index}`}
          state={{ dataType: "PatientData", pid: index }}
        > */}
        <Box>
          <Box display="flex" direction="row">
            <Box display="flex" alignItems="baseline" w="340px">
              <Badge borderRadius="full" px="2" textTransform="none">
                USERNAME : {user["username"]}
              </Badge>
            </Box>
            <Box
              color="gray.600"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              <Flex direction="row" alignItems="center">
                <Text mr="5px">Role:</Text>
                <FormControl w="160px">
                  <Select
                    size="xs"
                    id="role"
                    value={Capitalize(user["role"])}
                    onChange={(e) => {
                      handleSetRoleByID(
                        event,
                        user["account_id"],
                        e.target.value
                      );
                    }}
                  >
                    {properties["allTypes"].map((attribute) => {
                      return <option key={attribute}>{attribute}</option>;
                    })}
                  </Select>
                </FormControl>
              </Flex>
            </Box>
          </Box>

          <Box display="flex" direction="row" mb="10px">
            <Box
              w="334px"
              color="gray.600"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {user["pid"] !== undefined ? "PID" : "UID"}:
              {user["pid"] || user["id"]}
            </Box>
          </Box>

          <Box display="flex" direction="row" mb="10px">
            <Box
              w="334px"
              color="gray.600"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              Account ID: {user["account_id"]}
            </Box>
          </Box>

          <Box
            color="gray.600"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            Last login:{" "}
            {user["last login"] !== ""
              ? `${user["last login"].toDate()}`
              : null}
          </Box>
        </Box>
        {/* </Link> */}

        <Box alignSelf="center">
          <Button
            size="xs"
            bgColor="red.300"
            borderWidth="1px"
            onClick={() => {
              onOpen();
              setDeletedUserID(user["account_id"]);
            }}
            cursor="pointer"
          >
            <MinusIcon></MinusIcon>
            {renderAlertDialog()}
          </Button>
        </Box>
      </Box>
    );
  };

  const renderEndMessage = () => {
    switch (type) {
      case "":
        if (fetchedAllUsers !== undefined) {
          if (fetchedAllUsers.length > 0) {
            return null;
          } else {
            return "No data found... :(";
          }
        }
      case "Appointments":
        return emptyList ? "No appointment data found... :(" : null;
      case "General examinations":
        return emptyList ? "No general examination data found... :(" : null;
      case "Treatments":
        return emptyList ? "No treatment data found... :(" : null;
      default:
        return null;
    }
  };

  const renderByType = () => {
    switch (type) {
      case "Appointments":
        return (
          <SearchAppointments
            filteredDate={filteredDate}
            filteredName={filteredName}
            emptyList={emptyList}
          ></SearchAppointments>
        );
      case "General examinations":
        return (
          <SearchGeneralExaminations
            filteredDate={filteredDate}
            filteredName={filteredName}
            emptyList={emptyList}
          ></SearchGeneralExaminations>
        );
      case "Treatments":
        return (
          <SearchTreatments
            filteredDate={filteredDate}
            filteredName={filteredName}
            emptyList={emptyList}
          ></SearchTreatments>
        );
      default:
        return null;
    }
  };

  // && fetchedList !== undefined ?
  return fetchedAllUsers !== undefined ? (
    <Flex direction="row" w="100%" p="0 12%">
      <DialogBox name={undefined} pid={undefined} boxTitle="search" />

      <Box minW="600px" w="100%" p="0 2% 0 2%">
        <Text
          fontSize="5xl"
          padding="2% 5% 1% 5%"
          fontFamily="serif"
          fontWeight="550"
        >
          Manage entities
        </Text>
        <Flex direction="column" m="0 5% 0 5%">
          <Flex direction="row" justifyContent="space-evenly">
            <Flex direction="row" mb="10px" align="center">
              <Text fontWeight="600" mr="5px" whiteSpace="nowrap">
                Search for :
              </Text>
              <FormControl w="160px">
                <Select
                  id="type"
                  placeholder="Select type"
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                >
                  {properties["allTypes"].map((attribute) => {
                    return <option key={attribute}>{attribute}</option>;
                  })}
                </Select>
              </FormControl>
            </Flex>
            <Flex
              direction="row"
              mb="10px"
              align="center"
              visibility={type !== "" ? "visible" : "hidden"}
            >
              <Box>
                <Text fontWeight="600" mr="5px" whiteSpace="nowrap">
                  By date :
                </Text>
              </Box>
              <Box>
                <FormControl w="160px">
                  <Input
                    type="date"
                    value={filteredDate}
                    bgColor="gray.200"
                    borderWidth="1px"
                    borderColor="gray.300"
                    onChange={(e) => {
                      setFilteredDate(e.target.value);
                    }}
                    _placeholder={{
                      fontSize: "15px",
                    }}
                  />
                </FormControl>
              </Box>
            </Flex>

            <Flex
              direction="row"
              mb="10px"
              align="center"
              visibility={type !== "" ? "visible" : "hidden"}
            >
              <Box>
                <Text fontWeight="600" mr="5px" whiteSpace="nowrap">
                  By name :
                </Text>
              </Box>
              <Box>
                <FormControl w="160px">
                  <Input
                    type="text"
                    value={filteredName}
                    bgColor="gray.200"
                    borderWidth="1px"
                    borderColor="gray.300"
                    onChange={(e) => {
                      setFilteredName(e.target.value);
                    }}
                    _placeholder={{
                      fontSize: "15px",
                    }}
                  />
                </FormControl>
              </Box>
            </Flex>
          </Flex>
          <InfiniteScroll
            style={{ height: "600px" }}
            dataLength={4}
            hasMore={false}
            loader={<h4>Loading...</h4>}
            endMessage={
              <Text textAlign="center" fontWeight={550}>
                {renderEndMessage()}
              </Text>
            }
          >
            {renderByType()}
          </InfiniteScroll>
        </Flex>
      </Box>

      <Box minW="18%"></Box>
    </Flex>
  ) : (
    <SpinnerComponent></SpinnerComponent>
  );
};

export default Search;
