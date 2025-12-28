import { useState, useEffect } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import { useMobile } from "../hook/MobileNav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserProfile } from "../utils/auth";
import Avatar from "@mui/material/Avatar";
import axios_instance from "../utils/axios";

export default function NavBar() {
  const profile = getUserProfile();
  const name = profile?.first_name + " " + profile?.last_name || "User";
  const avatar = profile?.avatar || null;
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);

  const create = location.pathname.includes("admin");

  const pathSegments = location.pathname.split("/");
  const check = location.pathname.includes("/student/dashboard");
  // console.log("Checking if route matches teacher route", check);

  if (avatar) {
    return <Avatar src={avatar} alt={name} sx={{ width: 34, height: 34 }} />;
  }

  // fallback: show initials or "?" when no image
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const { toggleMobile } = useMobile();

  useEffect(() => {
    axios_instance
      .get("api/notifications/unread-count/")
      .then((res) => {
        const response = res.data.unread_count || 0;
        setNotifications(response);
      })
      .catch((err) => {
        console.error("Failed to load notifications", err);
      });
  }, []);
  return (

    <div className="px-3 flex shadow justify-between py-3 fixed bottom-auto top-0 w-full bg-white z-50 lg:static">
      {/* <div className="px-3 flex shadow relative justify-between py-3 fixed bottom-auto top-0 w-full bg-white z-50 lg:static"> */}

      <div className="">
        <CgMenuLeft
          onClick={toggleMobile}
          color="black"
          size={35}
          className="size-10 lg:hidden block"
        />
        {/* <input
          type="text"
          autoComplete="off"
          placeholder="Pesquisar aqui"
          className="text-accent 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-accent border-none active:border-none outline-none rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
          id="name"
        /> */}
        {/* <FiSearch size={16} className="text-black/30" /> */}
      </div>

      <div className="flex  justify-center items-center gap-3">
        <div
          onClick={() => navigate("setting")}
          className={`relative cursor-pointer ${create ? "hidden" : "block"}`}
        >
          <Avatar
            sx={{
              bgcolor: "#f0f0f0",
              width: 34,
              height: 34,
              fontSize: "16px",
              color: "#333",
            }}
          >
            🔔
          </Avatar>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-[5px] leading-none">
              {notifications}
            </span>
          )}
        </div>
        <Link
          to={check && "student-profile"}
          className="text-black/50  text-sm gap-1 flex justify-center items-center"
        >
          <Avatar sx={{ width: 34, height: 34, fontSize: "14px" }}>
            {initials}
          </Avatar>
          <p>{name}</p>
          <IoChevronDownOutline />
        </Link>
      </div>
    </div>
  );
}
