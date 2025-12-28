import { AiFillSetting } from "react-icons/ai";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { IoCloseCircle, IoGameController, IoLogOut } from "react-icons/io5";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdHome } from "react-icons/md";
import { RiAiGenerate } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";
import { logout } from "../utils/logout";
import { getUserProfile } from "../utils/auth";
import { PiClockFill } from "react-icons/pi";
import { ImBook } from "react-icons/im";
import { useState } from "react";
import { useMobile } from "../hook/MobileNav";

export default function TSideBar() {
  const userProfile = getUserProfile(); // Assume it returns an object with a role property
  const location = useLocation();
  // const [showMobile, setShowMobile] = useState(false);
  const { mobile, toggleMobile } = useMobile();

  const handleLogout = async () => {
    await logout();
  };

  const pathSegments = location.pathname.split("/");
  const sideLinks =
    userProfile?.role === "teacher"
      ? [
          { label: "Início", inActive: <MdHome />, path: "/teacher/dashboard" },
          {
            label: "Alunos",
            inActive: <FaUserAlt />,
            path: "/teacher/dashboard/Students",
          },
          {
            label: "Geração de Certificado",
            inActive: <RiAiGenerate />,
            path: "/teacher/dashboard/generate",
          },
          {
            label: "Conhecimento",
            inActive: <FaBook />,
            path: "/teacher/dashboard/knowledge",
          },
          // { label: "Ranking", inActive: <LiaClipboardListSolid />, path: "/teacher/dashboard/ranking" },
          {
            label: "Jogos",
            inActive: <IoGameController />,
            path: "/teacher/dashboard/game",
          },
        ]
      : userProfile?.role === "student"
      ? [
          { label: "Início", inActive: <MdHome />, path: "/student/dashboard" },
          {
            label: "Conhecimento",
            inActive: <ImBook />,
            path: "/student/dashboard/knowledge",
          },
          {
            label: "Atividade",
            inActive: <PiClockFill />,
            path: "/student/dashboard/activty",
          },
          {
            label: "Gestão de Perfil",
            inActive: <FaUserAlt />,
            path: "/student/dashboard/student-profile",
          },
          {
            label: "Ranking",
            inActive: <LiaClipboardListSolid />,
            path: "/student/dashboard/ranking",
          },
          {
            label: "Jogos",
            inActive: <IoGameController />,
            path: "/student/dashboard/student-game",
          },
        ]
      : [
          { label: "Início", inActive: <MdHome />, path: "/admin/dashboard" },
          {
            label: "Gestão de Professores",
            inActive: <FaUserAlt />,
            path: "/admin/dashboard/register-teacher",
          },
          {
            label: "Gestão de Alunos",
            inActive: <FaUserAlt />,
            path: "/admin/dashboard/Students",
          },
          {
            label: "Conhecimento",
            inActive: <FaBook />,
            path: "/admin/dashboard/knowledge",
          },
          {
            label: "Ranking",
            inActive: <LiaClipboardListSolid />,
            path: "/admin/dashboard/ranking",
          },
          {
            label: "Jogos",
            inActive: <IoGameController />,
            path: "/admin/dashboard/game",
          },
        ];

  const config = [
    {
      label: "Configurações",
      inActive: <AiFillSetting />,
      path:
        userProfile?.role === "teacher"
          ? "/teacher/dashboard/setting"
          : userProfile?.role === "student"
          ? "/student/dashboard/setting"
          : "/admin/dashboard/setting",
    },
    {
      label: "Sair",
      inActive: <IoLogOut />,
      path: "/",
      isLogout: true,
    },
  ];

  const renderLinks = () => (
    <>
      <div className="flex flex-col gap-1">
        {sideLinks.map((link, id) => {
          const hrefSegments = link?.path?.split("/");
          return (
            <NavLink
              key={id}
              to={link.path}
              onClick={() => toggleMobile(false)}
              className={`${
                pathSegments[3] === hrefSegments[3] && "bg-main-dark text-white"
              } my-auto flex p-[10px] text-sm rounded-lg items-center text-black`}
            >
              <span>{link.inActive}</span>
              <span className="inline ml-2">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="flex flex-col gap-1">
        {config.map((link, id) => (
          <NavLink
            key={id}
            to={link.path}
            onClick={() => {
              if (link.isLogout) handleLogout();
              toggleMobile(false);
            }}
            className={`${
              location.pathname === link.path && "bg-main-dark text-white"
            } my-auto flex p-[10px] text-sm rounded-lg items-center text-black`}
          >
            <span>{link.inActive}</span>
            <span className="inline ml-2">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {/* <button
        className="lg:hidden fixed top-4 left-4 z-50 text-black"
        onClick={() => setShowMobile(!mobile)}
      >
        ☰
      </button> */}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          mobile ? "opacity-100" : "opacity-0 pointer-events-none"
        } lg:hidden`}
        onClick={() => toggleMobile(false)}
      ></div>

      <div
        className={`overflow-y-auto fixed top-0 left-0 z-50 h-screen w-[80%] sm:w-[60%] bg-bg p-4 transform transition-transform duration-300 ${
          mobile ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <IoCloseCircle
          onClick={() => toggleMobile(false)}
          className="size-8 absolute top-3 right-3 text-black"
        />
        <div className="flex flex-col items-center">
          <img
            src="/teacher/avag.png"
            alt="Teacher Avatar"
            className="w-20 h-20 sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] object-cover"
          />
        </div>

        <div className="h-full flex flex-col justify-between pt-4">
          {renderLinks()}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-[22%] bg-bg items-center">
        <div>
          <img src="/teacher/avag.png" className="size-[110px]" alt="" />
        </div>
        <div className="h-full flex flex-col justify-between pb-2 p-2">
          {renderLinks()}
        </div>
      </div>
    </>
  );
}
