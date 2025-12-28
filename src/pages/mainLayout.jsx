import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

function MainLayout() {
  return (
    <div className="flex w-full h-screen">
        <SideBar />
        <main className="overflow-y-auto w-full bg-white lg:mt-0 mt-16">
          <NavBar />
          <Outlet />
        </main>
    </div>
  );
}

export default MainLayout;
