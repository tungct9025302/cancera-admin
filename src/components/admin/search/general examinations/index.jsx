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
import { FaTools, FaUserInjured, FaUserMd } from "react-icons/fa";

import InfiniteScroll from "react-infinite-scroll-component";

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
import { AuthContext } from "../../../context/AuthContext";
import { db, auth } from "../../../../database/firebaseConfigs";
import { isEmptyArray } from "formik";
import SpinnerComponent from "../../../commons/Spinner";

const SearchGeneralExaminations = ({
  filteredDate,
  emptyList,
  filteredName,
}) => {
  const [fetchedAllUsers, setFetchedAllUsers] = useState();
  const [fetchedAllPatients, setFetchedAllPatients] = useState();
  let attributes = [
    {
      id: "blood pressure",
      rightAddon: "mmHg",
    },
    {
      id: "blood concentration",
      rightAddon: "g/dL",
    },
    {
      id: "blood glucose",
      rightAddon: "mg/dL",
    },
    {
      id: "heart rate",
      rightAddon: "bpm",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let userData = [];
    let allPatientsData = [];
    // const querySnapshotForUsers = await getDocs(collection(db, "users"));
    // querySnapshotForUsers.forEach((doc) => {
    //   allUsersData.push({ account_id: doc.id, ...doc.data() });
    // });
    const querySnapshotForPatients = await getDocs(collection(db, "patients"));
    querySnapshotForPatients.forEach((doc) => {
      allPatientsData.push({ account_id: doc.id, ...doc.data() });
    });
    setFetchedAllPatients(allPatientsData);

    // const docSnap = await getDoc(doc(db, "admins", currentUser.uid));
    // if (docSnap.exists()) {
    //   userData = { ...docSnap.data() };
    // }
    // setFetchedList(userData);
  };

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const checkState = (value, action) => {
    let x = new Date().toISOString().slice(0, 10);
    let y = value;
    switch (action) {
      case "state":
        if (y < x) {
          return "done";
        } else if (x === y) {
          return "today";
        } else {
          return "Future data?";
        }
      case "color":
        if (y < x) {
          return "teal";
        } else if (x === y) {
          return "yellow";
        } else {
          return "red";
        }
    }
  };

  const checkExistAGeneralExamination = () => {
    fetchedAllPatients.map((patient) => {
      if (patient["general examinations"] !== undefined) {
        if (patient["general examinations"].length >= 1) {
          emptyList = false;
        }
      }
    });
  };

  const renderAllGeneralExaminations = (patient, index) => {
    return (
      <Flex direction="column" key={index}>
        {patient["general examinations"] !== undefined &&
        !isEmptyArray(patient["general examinations"]) ? (
          <Flex
            direction="row"
            mt={index !== 0 ? "20px" : "0px"}
            justifyContent="center"
          >
            <Icon as={FaUserInjured} w={4} h={4} m="2px 2px 0 0" />
            <Text fontWeight={550}>Patient: {patient["name"]}</Text>
          </Flex>
        ) : null}
        {patient["general examinations"] !== undefined &&
        !isEmptyArray(patient["general examinations"])
          ? patient["general examinations"].map(
              (general_examination, index) => {
                return (
                  <Box key={index}>
                    {renderData(general_examination, patient, index)}
                  </Box>
                );
              }
            )
          : null}
      </Flex>
    );
  };

  const existInGeneralExaminationsList = (general_examinations) => {
    let exist = false;
    general_examinations.map((general_examination) => {
      if (general_examination["date"] === filteredDate) {
        exist = true;
      }
    });
    return exist;
  };

  const renderFilteredGeneralExaminations = (patient, index) => {
    return (
      <Flex direction="column" key={index}>
        {patient["general examinations"] !== undefined &&
        !isEmptyArray(patient["general examinations"]) &&
        existInGeneralExaminationsList(patient["general examinations"]) ? (
          <Flex
            direction="row"
            mt={index !== 0 ? "20px" : "0px"}
            justifyContent="center"
          >
            <Icon as={FaUserInjured} w={4} h={4} m="2px 2px 0 0" />
            <Text fontWeight={550}>Patient: {patient["name"]}</Text>
          </Flex>
        ) : null}
        {patient["general examinations"] !== undefined &&
        !isEmptyArray(patient["general examinations"])
          ? patient["general examinations"].map(
              (general_examination, index) => {
                return general_examination["date"] === filteredDate ? (
                  <Box key={index}>
                    {renderData(general_examination, patient, index)}
                  </Box>
                ) : null;
              }
            )
          : null}
      </Flex>
    );
  };

  const renderData = (general_examination, patient, index) => {
    return (
      <Box
        w="100%"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bgColor="#fcfcfc"
      >
        <Box p="6">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="baseline">
              <Badge
                borderRadius="full"
                px="2"
                colorScheme={checkState(general_examination["date"], "color")}
              >
                {checkState(general_examination["date"], "state")}
              </Badge>

              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
              >
                &bull;{general_examination.date}
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
              General Examination ID: {index}
            </Box>
          </Box>

          {attributes.map((attribute, index) => {
            return (
              <Flex direction="row" m="5px 5px 0 0" key={index}>
                <Text fontWeight={550} mr="3px">
                  {Capitalize(attribute["id"])}:
                </Text>
                <Text mr="5px">
                  {general_examination[`${attribute["id"]}`]}
                </Text>
                {/* <Text>{attribute["rightAddon"]}</Text> */}
              </Flex>
            );
          })}

          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt="2px"
            alignContent="center"
          >
            <Flex direction="row">
              <Icon as={FaUserMd} w={4} h={4} m="2px 2px 0 0" />
              <Box maxW="500px">
                Creator: {general_examination["creator name"]}
              </Box>
            </Flex>
            <Flex direction="row" mt="5px">
              <Text>Creator ID:</Text>
              <Text ml="1px" fontStyle="italic">
                {general_examination["creator id"]}
              </Text>
            </Flex>
          </Flex>

          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            alignContent="center"
          >
            <Box></Box>
            {/* <HStack spacing={4}>
              <Box align="center">
                <Link
                  to={`/modify/pid=${pid}/${boxTitle}/id=${index}`}
                  state={{
                    name: name,
                    id: index,
                    pid: pid,
                    boxTitle: boxTitle,
                  }}
                >
                  <Icon as={FaTools} w={4} h={4} mt="8px"></Icon>
                </Link>
              </Box>

              <Box>
                <DeleteIcon
                  onClick={() => {
                    onOpen();
                    setDeletedGeneralExamination(general_examination);
                  }}
                  cursor="pointer"
                ></DeleteIcon>
                {renderAlertDialog()}
              </Box>
            </HStack> */}

            {/* <Box>
                <Text ml="1px" fontStyle="italic">
                  {general_examination.note}
                </Text>
              </Box> */}
          </Flex>
        </Box>
      </Box>
    );
  };

  return fetchedAllPatients !== undefined ? (
    <Box>
      {checkExistAGeneralExamination()}
      {fetchedAllPatients.map((patient, index) => {
        return filteredDate === ""
          ? renderAllGeneralExaminations(patient, index)
          : renderFilteredGeneralExaminations(patient, index);
      })}
    </Box>
  ) : (
    <SpinnerComponent />
  );
};
export default SearchGeneralExaminations;
