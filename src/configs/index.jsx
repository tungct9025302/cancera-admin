import SetRole from "../components/admin/manage/role";
import AddUser from "../components/admin/add/user";
import RenderAdminLogin from "../components/commons/Account/RenderAdminLogin";
import Search from "../components/admin/search";

export const secondAdminHeaderConfigs = [
  {
    label: "ADD USER",
    path: "/add-user",
    color: "#4a4a4a",
  },
  {
    label: "MANAGE ROLE",
    path: "/manage-role",
    color: "#4a4a4a",
  },
  {
    label: "SEARCH",
    path: "/search",
    color: "#4a4a4a",
  },
];
export const firstAdminHeaderConfigs = [
  {
    label: "CORONA NEWS",
    path: "/corona-news",
    color: "red",
  },
  {
    label: "FIND A DOCTOR",
    path: "/find-doctor",
    color: "#187aab",
  },
  {
    label: "CONNECT TO CARE",
    path: "/connect-to-care",
    color: "#187aab",
  },
  {
    label: "FIND DRUG PRICES",
    path: "/find-drug-prices",
    color: "#187aab",
  },
];

//Default setup
const defaultColor = "blue";

export const colorConfigs = {
  primaryColor: `${defaultColor}.400`,
  primaryHover: `${defaultColor}.200`,
  secondaryColor: `${defaultColor}.300`,
};

//Set path
export const routeConfigs = [
  //Admin
  {
    path: "/manage-role",
    element: <SetRole />,
  },
  {
    path: "/add-user",
    element: <AddUser />,
  },
  {
    path: "/cancera-admin/2vKT4Lo84PB90ASaKAR5",
    element: <RenderAdminLogin />,
  },
  {
    path: "/search",
    element: <Search />,
  },
];
