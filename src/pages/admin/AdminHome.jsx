import {
  Avatar,
  Button,
  Card,
  CardFooter,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { BsFillTrashFill, BsThreeDotsVertical } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import { IoEyeOutline, IoTriangle } from "react-icons/io5";
import { TABLE_HEAD } from "../../../helper/data";
import UserModal from "../../components/teacher/usermodal";
import { getUserProfile } from "../../utils/auth";
import axios_instance from "../../utils/axios";
import ViewProfileModal from "../../components/teacher/ViewStudentProfileModal";

export default function AdminHome() {
  const [identifier, setIdentifier] = useState(null);
  const [stats, setStats] = useState([]);

  const profile = getUserProfile();

  const [Data, setData] = useState([]);
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(Data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = Data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("post");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteData = async (id) => {
    const dataf = Data.filter((row) => row.id !== id);
    setData(dataf);
    try {
      const response = await axios_instance.delete(
        `api/users/get-all-students/${id}/`
      );
      console.log(response.data); // Handle the fetched data as needed
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios_instance.get("api/users/get-all-students");
        setData(response.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    axios_instance
      .get("learning/statistics/admin-stats/") // Replace with your real API URL
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const toggleModal = () => {
    setOpen(!open);
    if (open) {
      setModalType("post");
      setSelectedUser(null);
      setSelectedUserId(null);
    }
  };
  const toogleEdit = (id) => {
    if (identifier === id) {
      setIdentifier(null);
    } else {
      setIdentifier(id);
    }
  };
  const handleEditUser = (index) => {
    const user = Data[index];
    console.log(user);
    setModalType("put");
    setSelectedUserId(index);
    setSelectedUser({
      first_name: user.first_name?.split(" ")[0] || "",
      last_name: user.last_name?.split(" ")[0] || "",
      email: user.email || "",
      password: "",
      confirm_password: "",
    });
    setOpen(true);
  };

  const labelMap = {
    students: "Aluno",
    teachers: "Professor",
    knowledge_trail_videos: "Video",
    knowledge_trail_pdfs: "PDF",
  };
  
  const apiData = Object.entries(stats).map(([key, value]) => {
  return {
    label: labelMap[key] || key,
    count: value.count,
    desp: value.new_certificates ?? value.difference ?? 0,
    difference: value.difference ?? value.new_certificates ?? 0,
    // img: "/path-to-icon.svg" if needed
  };
});


      const handleOpen = (userdata) => {
    setSelectedUser(userdata);
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);

  return (
    <div className="pr-4 px-3 flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-center -mb-1 text-2xl font-bold">
          Olá, {profile.first_name} {profile.last_name}
        </h1>
        <img src="/teacher/avatar.png" className="size-12" />
      </div>
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
         {apiData.map((card, id) => (
          <div
            key={id}
            className="flex p-5 gap-3 bg-main-light justify-start items-center rounded-lg"
          >
            <div className="bg-[#A9E8FF] p-2 rounded-full">
                 <img src='/teacher/thumb.png' alt={card.label} className="w-8 h-8" />
            </div>
            <div>
              <p className="font-semibold text-xl capitalize">{card.label}</p>
              <div className="flex gap-2 items-center">
                <p>{card.count}</p>
                <span
                  className={`flex text-xs items-end ${
                    card.difference < 0 ? "text-[#FF0000]" : "text-main-dark"
                  }`}
                >
                  <IoTriangle
                    size={10}
                    className={`${
                      card.difference < 0 ? "rotate-180" : ""
                    } mb-[3px] mr-[2px]`}
                  />
                  {card.desp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UserModal
        open={open}
        handleOpen={toggleModal}
        requestType={modalType}
        userId={selectedUserId}
        apiEndpoint="users/sign-up/"
        data={selectedUser}
      />
      <Card className="h-full lg:overflow-hidden overflow-x-scroll   w-full  px-6">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b p-2 border-gray-300 pb-4 pt-10"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map(
              (
                {
                  activity,
                  first_name,
                  created_at,
                  img,
                  email,
                  status,
                  last_name,
                  id,
                  avatar
                },
                index
              ) => {
                const isLast = id === currentData.length - 1;
                const classes = isLast
                  ? "py-4  p-3 "
                  : "py-4 p-3 border-b  border-gray-300 ";
                const date = new Date(created_at).toLocaleDateString();
                const name = first_name + " " + last_name;
                return (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        {startIndex + index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src={img} alt={name} size="sm" />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        {email}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        {date}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        {status}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        {activity}
                      </Typography>
                    </td>
                    <td style={{ position: "relative" }} className={classes}>
                      <IconButton onClick={() => toogleEdit(id)} variant="text">
                        <BsThreeDotsVertical className=" rotate-90 h-4 w-4" />
                      </IconButton>
                      <Card
                        onClick={() => toogleEdit(id)}
                        className={` ${
                          identifier === id ? "block" : "hidden"
                        } ${
                          isLast ? "-top-20" : "top-0"
                        } right-16 z-50 absolute w-[135px]`}
                      >
                        <List className="w-[120px] text-xs ">
                          <ListItem
                            onClick={() =>
                              handleOpen({
                                avatar,
                                name,
                                email,
                                dataDeRegistro: date
                              })
                            }
                            className="w-[120px] text-xs"
                          >
                            <ListItemPrefix>
                              <IoEyeOutline />
                            </ListItemPrefix>
                            var
                          </ListItem>
                          <ListItem
                            onClick={() => handleEditUser(index)}
                            className=" w-[120px]   text-xs"
                          >
                            <ListItemPrefix>
                              <GoPencil />
                            </ListItemPrefix>
                            Editar
                          </ListItem>
                          <ListItem
                            onClick={() => deleteData(id)}
                            className=" text-xs w-[120px] font-semibold "
                          >
                            {" "}
                            <ListItemPrefix>
                              <BsFillTrashFill />
                            </ListItemPrefix>
                            Excluir
                          </ListItem>
                        </List>
                      </Card>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </Card>
      <CardFooter className="flex items-center justify-between w-full border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Página {currentPage} de {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </CardFooter>
       <ViewProfileModal
                    open={isModalOpen}
                    onClose={handleClose}
                    user={selectedUser}
                  />
    </div>
  );
}
