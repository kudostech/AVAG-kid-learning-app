import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from '../../components/SideBar'
import NavBar from "../../components/NavBar";
function StudentLayout() {
  return (
    <div className="flex w-full h-screen">
         <SideBar />
        <main className="overflow-y-auto w-[100%] bg-white">
          <NavBar />
          <Outlet />
        </main>
    </div>
  );
}

export default StudentLayout;
