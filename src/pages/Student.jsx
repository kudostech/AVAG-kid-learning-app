import React, { useState, useEffect } from "react";
import axios_instance from "../utils/axios";
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
import { BsFillTrashFill, BsThreeDotsVertical } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import UserModal from "../components/teacher/usermodal";
import ViewProfileModal from "../components/teacher/ViewStudentProfileModal";
import { IoEyeOutline } from "react-icons/io5";

import { TABLE_HEAD2 } from "../../helper/data";

function Students() {
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
  // const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios_instance.get("api/users/get-all-students"); // Replace with your API URL
        setData(response.data.results);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const deleteData = async (id) => {
    const dataf = Data.filter((row) => row.id !== id);
    setData(dataf);
    try {
      const response = await axios_instance.delete(`api/users/${id}/`);
      console.log(response.data); // Handle the fetched data as needed
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleModal = () => {
    setOpen(!open);
    if (open) {
      setModalType("post");
      setSelectedUser(null);
      setSelectedUserId(null);
    }
  };

  const toogleEdit = (id) => {
    if (selectedUserId === id) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(id);
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
  const handleOpen = (userdata) => {
    setSelectedUser(userdata);
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);

  return (
    <div className="flex pt-5 px-3 flex-col gap-4">
      <div className="flex justify-between p-2 gap-3 items-center text-white">
        <p className="font-bold lg:text-[28px] text-black">
          Gestão de Usuários
        </p>
        <p
          onClick={toggleModal}
          className="flex cursor-pointer p-[6px] lg:p-[10px] text-center items-center rounded-lg lg:rounded-2xl gap-2 bg-main-dark"
        >
          Adicionar Novo Usuário
        </p>
      </div>

      <UserModal
        open={open}
        handleOpen={toggleModal}
        requestType={modalType}
        userId={selectedUserId}
        data={selectedUser}
      />

      <Card className="h-full lg:overflow-hidden overflow-x-scroll w-full px-6">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD2.map((head) => (
                <th
                  key={head}
                  className="border-b p-2 border-gray-300 pb-4 pt-10"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold leading-none "
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
                  first_name,
                  avatar,
                  Turma,
                  last_name,
                  created_at,
                  img,
                  email,
                  status,
                  id,
                },
                index
              ) => {
                const isLast = id === currentData.length - 1;
                const classes = isLast
                  ? "py-4 p-3"
                  : "py-4 p-3 border-b border-gray-300";
                const name = first_name + " " + last_name;
                const date = new Date(created_at).toISOString().slice(0, 10);
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
                        {Turma}
                      </Typography>
                    </td>
                    <td style={{ position: "relative" }} className={classes}>
                      <IconButton onClick={() => toogleEdit(id)} variant="text">
                        <BsThreeDotsVertical className="rotate-90 h-4 w-4" />
                      </IconButton>
                      <Card
                        onClick={() => toogleEdit(id)}
                        className={`${
                          selectedUserId === id ? "block" : "hidden"
                        } ${
                          isLast ? "-top-20" : "top-0"
                        } right-16 absolute w-[135px]`}
                      >
                        <List className="w-[120px] text-xs">
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
                            className="w-[120px] text-xs"
                          >
                            <ListItemPrefix>
                              <GoPencil />
                            </ListItemPrefix>
                            Editar
                          </ListItem>
                          <ListItem
                            onClick={() => deleteData(id)}
                            className="text-xs w-[120px] font-semibold"
                          >
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

export default Students;
