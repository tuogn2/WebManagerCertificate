import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "../../components/adminComponents/SideBar";
import { AppBar, CssBaseline, Toolbar } from "@mui/material";

export default function AdminHome() {
  return (
    <>
      <CssBaseline />
      <SideBar />
    </>
  );
}
