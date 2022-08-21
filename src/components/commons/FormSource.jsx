import React, { Component } from "react";

let x = new Date().toISOString().slice(0, 10);
export const loginInputs = [
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: "Input your username.",
    noInputMessage: "Username is required.",
    failedLoginMessage: "Wrong username or password.",
    wrongTypeInputMessage: "Username must be an email type.",
    placeholderForCreate: "Username must be an email.",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Input your password.",
    noInputMessage: "Password is required.",
    failedLoginMessage: "Wrong username or password.",
    wrongTypeInputMessage: "Your password length is below 6.",
    placeholderForCreate: "Password must have length above 6.",
  },
];

export const createInputs = [
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: "Input your username.",
    noInputMessage: "Username is required.",
    failedLoginMessage: "This email is existed. Try other username...",
    wrongTypeInputMessage: "Username must be an email type.",
    placeholderForCreate: "Example: username@yahoo.com",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Input your password.",
    noInputMessage: "Password is required.",
    failedLoginMessage: "",
    wrongTypeInputMessage: "Your password length must be above 6.",
    placeholderForCreate: "Example: 123456",
  },
];
export const changePasswordInputs = [
  {
    id: "old password",
    label: "Old password",
    type: "password",
    placeholder: "Input your old password.",
    failedLoginMessage: "Old password is incorrect.",
    wrongTypeInputMessage: "Your password length must be above 6.",
    sameInputMessage: "",
  },
  {
    id: "new password",
    label: "New password",
    type: "password",
    placeholder: "Input your new password.",
    failedLoginMessage: "",
    wrongTypeInputMessage: "Your password length must be above 6.",
    sameInputMessage: "Your new password must be different from old password.",
  },
  {
    id: "confirm new password",
    label: "Confirm new password",
    type: "password",
    placeholder: "Confirm your new password by typing again.",
    failedLoginMessage: "",
    wrongTypeInputMessage: "Confirm password must match the new password.",
    sameInputMessage: "",
  },
];

export const addUserInputs = [
  {
    id: "name",
    label: "Name",
    formType: "input",
    type: "text",
    noInputMessage: "Name is required.",
    placeholder: "",
    invalidInputMessage: "Name can not contain number.",
  },
  {
    id: "date of birth",
    label: "Date of birth",
    formType: "input",
    type: "date",
    placeholder: "",
    noInputMessage: "Date of birth is required.",
    invalidInputMessage: "Unable to set this date as date of birth",
  },
  {
    id: "gender",
    label: "Gender",
    formType: "select",
    type: "",
    placeholder: "",
    noInputMessage: "Gender is required.",
    invalidInputMessage: "",
  },
  {
    id: "department",
    label: "Department",
    formType: "input",
    type: "text",
    placeholder: "",
    noInputMessage: "Department is required.",
    invalidInputMessage: "",
  },
  {
    id: "role",
    label: "Role",
    formType: "select",
    type: "text",
    placeholder: "",
    noInputMessage: "Role is required.",
    invalidInputMessage: "",
  },
  {
    id: "phone number",
    label: "Phone number",
    formType: "input",
    type: "tel",
    placeholder: "",
    noInputMessage: "Phone number is required in 10 numbers.",
    invalidInputMessage: "",
  },
];

export const viewProfileInputsForAdmins = [
  {
    id: "username",
    label: "username",
    type: "text",
  },
  {
    id: "name",
    label: "name",
    type: "text",
  },
  {
    id: "date of birth",
    label: "date of birth",
    type: "text",
  },
  {
    id: "gender",
    label: "gender",
    type: "text",
  },
  {
    id: "phone number",
    label: "phone number",
    type: "text",
  },
  {
    id: "last login",
    label: "last login",
    type: "text",
  },
];
