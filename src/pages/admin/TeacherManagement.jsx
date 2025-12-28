import {
  Avatar,
  Button,
  Card,
  CardFooter,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import axios_instance from "../../utils/axios";
import ViewProfileModal from "../../components/teacher/ViewStudentProfileModal";
import { TABLE_HEAD3 } from "../../../helper/data";
import UserModal from "../../components/teacher/usermodal";

function TeacherManagement() {
  const [Data, setData] = useState([]);
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(Data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = Data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("post");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (userdata) => {
    setSelectedUser(userdata);
    setIsModalOpen(true);
  };
  const handleClose = () => setIsModalOpen(false);
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios_instance.get("api/teachers/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);
  const toggleModal = () => {
    setOpen(!open);
    if (open) {
      setModalType("post");
      setSelectedUser(null);
      setSelectedUserId(null);
    }
  };
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
        usertype="teacher"
      />
      <Card className="h-full lg:overflow-hidden overflow-x-scroll w-full px-6">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD3.map((head) => (
                <th
                  key={head}
                  className="border-b p-2 border-gray-300 pb-4 pt-10"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold leading-none"
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
                { id, avatar, full_name, email, subject, experience },
                index
              ) => {
                const isLast = index === currentData.length - 1;
                const classes = isLast
                  ? "py-4  p-3"
                  : "py-4 p-3 border-b border-gray-300";

                const subject_name = subject?.name || "Sem disciplina";
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
                        <Avatar
                          src={avatar || "/default-avatar.png"}
                          alt={full_name}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {full_name}
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
                        {subject_name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        className="font-normal text-gray-600"
                      >
                        {experience == 1 ? `1 Year` : `${experience} Years`}
                      </Typography>
                    </td>
                    <td style={{ position: "relative" }} className={classes}>
                      <IconButton
                        variant="text"
                        onClick={() =>
                          handleOpen({
                            avatar,
                            full_name,
                            email,
                            subject_name,
                            experience:
                              experience == 1
                                ? `1 Year`
                                : `${experience} Years`,
                          })
                        }
                      >
                        Ver
                      </IconButton>
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

export default TeacherManagement;
