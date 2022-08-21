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

const SearchAppointments = ({ filteredDate, emptyList, filteredName }) => {
  const [fetchedAllUsers, setFetchedAllUsers] = useState();
  const [fetchedAllPatients, setFetchedAllPatients] = useState();
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

  const checkExistAnAppointment = () => {
    fetchedAllPatients.map((patient) => {
      if (patient["appointments"] !== undefined) {
        if (patient["appointments"].length >= 1) {
          emptyList = false;
        }
      }
    });
  };

  const checkState = (value) => {
    let x = new Date().toISOString().slice(0, 10);
    let y = value;

    if (y > x) {
      return "upcoming";
    } else if (x === y) {
      return "today";
    } else {
      return "done";
    }
  };

  const renderAllAppointments = (patient, index) => {
    return (
      <Flex direction="column" key={index}>
        {patient["appointments"] !== undefined &&
        !isEmptyArray(patient["appointments"]) ? (
          <Flex
            direction="row"
            mt={index !== 0 ? "20px" : "0px"}
            justifyContent="center"
          >
            <Icon as={FaUserInjured} w={4} h={4} m="2px 2px 0 0" />
            <Text fontWeight={550}>Patient: {patient["name"]}</Text>
          </Flex>
        ) : null}
        {patient["appointments"] !== undefined &&
        !isEmptyArray(patient["appointments"])
          ? patient["appointments"].map((appointment, index) => {
              return (
                <Box key={index}>{renderData(appointment, patient, index)}</Box>
              );
            })
          : null}
      </Flex>
    );
  };

  const existInAppointmentsList = (appointments) => {
    let exist = false;
    appointments.map((appointment) => {
      if (appointment["date"] === filteredDate) {
        exist = true;
      }
    });
    return exist;
  };

  const renderFilteredAppointments = (patient, index) => {
    return (
      <Flex direction="column" key={index}>
        {patient["appointments"] !== undefined &&
        !isEmptyArray(patient["appointments"]) &&
        existInAppointmentsList(patient["appointments"]) ? (
          <Flex
            direction="row"
            mt={index !== 0 ? "20px" : "0px"}
            justifyContent="center"
          >
            <Icon as={FaUserInjured} w={4} h={4} m="2px 2px 0 0" />
            <Text fontWeight={550}>Patient: {patient["name"]}</Text>
          </Flex>
        ) : null}
        {patient["appointments"] !== undefined &&
        !isEmptyArray(patient["appointments"])
          ? patient["appointments"].map((appointment, index) => {
              return appointment["date"] === filteredDate ? (
                <Box key={index}>{renderData(appointment, patient, index)}</Box>
              ) : null;
            })
          : null}
      </Flex>
    );
  };

  const renderData = (appointment, patient, index) => {
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
                  checkState(appointment.date) === "upcoming"
                    ? "blue"
                    : checkState(appointment.date) === "today"
                    ? "yellow"
                    : "teal"
                }
              >
                {checkState(appointment.date)}
              </Badge>

              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
              >
                &bull; {appointment.date} &bull; Room:
                {appointment.room} &bull; Floor:{appointment.floor} &bull; Time:
                {appointment.time}
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
              Appointment ID: {index}
            </Box>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            // isTruncated
          >
            {appointment.title}
          </Box>

          <Flex direction="row" justifyContent="space-between">
            {/* <Flex direction="row">
              <Icon as={FaUserInjured} w={4} h={4} m="2px 2px 0 0" />
              <Text>Patient: {patient["name"]}</Text>
            </Flex> */}
            <Flex>
              <Text mr="5px">Cancer(s): </Text>
              <Text>{appointment.cancer}</Text>
            </Flex>
          </Flex>

          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex direction="row">
              <Icon as={FaUserMd} w={4} h={4} m="2px 2px 0 0" />
              <Text>Doctor: {appointment["doctor name"]}</Text>
            </Flex>

            <Flex direction="row">
              <Flex>
                <Text>Doctor ID:</Text>
              </Flex>
              <Box maxW="500px">
                <Text ml="1px" fontStyle="italic">
                  {appointment["doctor id"]}
                </Text>
              </Box>
            </Flex>

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
                  <Icon
                    as={FaTools}
                    w={4}
                    h={4}
                    mt="2px"
                    display={
                      checkState(appointment.date) !== "done" ? "block" : "none"
                    }
                  ></Icon>
                </Link>
              </Box>

              <Box>
                <DeleteIcon
                  onClick={() => {
                    setDeletedAppointment(appointment);
                    onOpen();
                  }}
                  cursor="pointer"
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
      {checkExistAnAppointment()}

      {fetchedAllPatients.map((patient, index) => {
        return filteredName === ""
          ? filteredDate === ""
            ? renderAllAppointments(patient, index)
            : renderFilteredAppointments(patient, index)
          : patient["name"].toLowerCase().includes(filteredName.toLowerCase())
          ? filteredDate === ""
            ? renderAllAppointments(patient, index)
            : renderFilteredAppointments(patient, index)
          : null;
      })}
    </Box>
  ) : (
    <SpinnerComponent />
  );
};
export default SearchAppointments;
