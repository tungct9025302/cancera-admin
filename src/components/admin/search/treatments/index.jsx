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

const SearchTreatments = ({ filteredDate, emptyList, filteredName }) => {
  const [fetchedAllUsers, setFetchedAllUsers] = useState();
  const [fetchedAllPatients, setFetchedAllPatients] = useState();
  const [lastestDate, setLatestDate] = useState("");
  let attributes = [
    {
      id: "treatment type",
    },
    {
      id: "duration",
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

  const getLastestTreatment = (treatments) => {
    treatments.map((treatment) => {
      if (treatment["date"] > lastestDate) {
        setLatestDate(treatment["date"]);
      }
    });
  };

  const checkExistATreatment = () => {
    fetchedAllPatients.map((patient) => {
      if (patient["treatments"] !== undefined) {
        if (patient["treatments"].length >= 1) {
          emptyList = false;
        }
      }
    });
  };

  const renderAllTreatments = (patient, index) => {
    return (
      <Flex direction="column" key={index}>
        {patient["treatments"] !== undefined &&
        !isEmptyArray(patient["treatments"]) ? (
          <Flex
            direction="row"
            mt={index !== 0 ? "20px" : "0px"}
            justifyContent="center"
          >
            <Icon as={FaUserInjured} w={4} h={4} m="2px 2px 0 0" />
            <Text fontWeight={550}>Patient: {patient["name"]}</Text>
          </Flex>
        ) : null}
        {patient["treatments"] !== undefined &&
        !isEmptyArray(patient["treatments"])
          ? patient["treatments"].map((treatment, index) => {
              return (
                <Box key={index}>{renderData(treatment, patient, index)}</Box>
              );
            })
          : null}
      </Flex>
    );
  };

  const existInTreatmentsList = (treatments) => {
    let exist = false;
    treatments.map((treatment) => {
      if (treatment["date"] === filteredDate) {
        exist = true;
      }
    });
    return exist;
  };

  const renderFilteredTreatments = (patient, index) => {
    return (
      <Flex direction="column" key={index}>
        {patient["treatments"] !== undefined &&
        !isEmptyArray(patient["treatments"]) &&
        existInTreatmentsList(patient["treatments"]) ? (
          <Flex
            direction="row"
            mt={index !== 0 ? "20px" : "0px"}
            justifyContent="center"
          >
            <Icon as={FaUserInjured} w={4} h={4} m="2px 2px 0 0" />
            <Text fontWeight={550}>Patient: {patient["name"]}</Text>
          </Flex>
        ) : null}
        {patient["treatments"] !== undefined &&
        !isEmptyArray(patient["treatments"])
          ? patient["treatments"].map((treatment, index) => {
              return treatment["date"] === filteredDate ? (
                <Box key={index}>{renderData(treatment, patient, index)}</Box>
              ) : null;
            })
          : null}
      </Flex>
    );
  };

  const renderData = (treatment, patient, index) => {
    getLastestTreatment(patient["treatments"]);
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
                colorScheme={
                  treatment["date"] === lastestDate ? "blue" : "teal"
                }
              >
                {treatment["date"] === lastestDate ? "current" : "done"}
              </Badge>

              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
              >
                &bull;{treatment["date"]}
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
              Treatment ID: {index}
            </Box>
          </Box>

          {attributes.map((attribute, index) => {
            return (
              <Flex direction="row" key={index} mt="5px">
                <Text fontWeight={550} mr="5px">
                  {Capitalize(attribute["id"])}:
                </Text>
                {treatment[`${attribute["id"]}`]}
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
              <Box maxW="500px">Creator: {treatment["creator name"]}</Box>
            </Flex>
            <Flex direction="row" mt="5px">
              <Text>Creator ID:</Text>
              <Text ml="1px" fontStyle="italic">
                {treatment["creator id"]}
              </Text>
            </Flex>
          </Flex>

          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mt="5px"
          >
            <Box></Box>

            {/* <HStack spacing={4}>
              <Box>
                <Link
                  to={`/modify/pid=${pid}/${boxTitle}/id=${index}`}
                  state={{
                    name: name,
                    id: index,
                    pid: pid,
                    boxTitle: boxTitle,
                  }}
                >
                  <Icon as={FaTools} w={4} h={4}></Icon>
                </Link>
              </Box>

              <Box>
                <DeleteIcon
                  onClick={() => {
                    onOpen();
                    setDeletedTreatment(treatment);
                  }}
                  cursor="pointer"
                  mb="8px"
                ></DeleteIcon>
                {renderAlertDialog()}
              </Box>
            </HStack> */}
          </Flex>
        </Box>
      </Box>
    );
  };

  return fetchedAllPatients !== undefined ? (
    <Box>
      {checkExistATreatment()}
      {fetchedAllPatients.map((patient, index) => {
        return filteredDate === ""
          ? renderAllTreatments(patient, index)
          : renderFilteredTreatments(patient, index);
      })}
    </Box>
  ) : (
    <SpinnerComponent />
  );
};
export default SearchTreatments;
