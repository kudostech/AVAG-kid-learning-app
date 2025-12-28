import {
  Avatar,
  Button,
  Card,
  CardFooter,
  Checkbox,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import axios_instance from "../../utils/axios";
import { RiAiGenerate } from "react-icons/ri";
import { TABLE_HEAD4 } from "../../../helper/data";
import CertificateDialog from "../../components/CertificateDialog";
import ViewProfileModal from "../../components/teacher/ViewStudentProfileModal";
import { IoEyeOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

function Generate() {
  const [students, setStudents] = useState([]);
  const [isBulkSelectMode, setIsBulkSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [certificate, setCertificate] = useState({ certificate_url: [] });
  // State for modal and selected user
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil((students?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClose = () => setOpen(false);

  const handleExport = () => {
    const urls = certificate?.certificate_url;

    urls.forEach((url) => {
      window.open(url);
    });

    handleClose();
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios_instance.get(
          "/learning/leaderboard/leaderboard/"
        );
        const results = response.data;
        setStudents(results);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  const handle2Close = () => setIsModalOpen(false);

  const handleGenerate = async (id = null) => {
    const idsToGenerate = id ? [id] : selectedIds;

    if (idsToGenerate.length === 0) {
      alert("Selecione pelo menos um estudante para gerar certificados.");
      return;
    }

    setOpen(true);

    try {
      const responses = await axios_instance.post(
        `/learning/certificates/generate-certificates-for-all/`,
        {
          student_ids: idsToGenerate,
        }
      );

      const allUrls = responses.data.certificates.map(
        (res) => res.certificate_url
      );
      setCertificate({ certificate_url: allUrls });
    } catch (error) {
      console.error("Erro ao gerar certificados:", error);
    }
  };
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const BulkselectHandler = () => {
    if (!isBulkSelectMode) {
      setIsBulkSelectMode(true);
    } else {
      handleGenerate();
    }
  };

  const toogleEdit = (id) => {
    setSelectedUserId((prevId) => (prevId === id ? null : id));
  };

  const handleOpen = (userdata) => {
    setSelectedUser(userdata);
    setIsModalOpen(true);
  };

  return (
    <div className="flex pt-5 px-3 flex-col gap-4">
      <div className="flex justify-between p-2 items-center text-white">
        <p className="font-bold lg:text-[28px] w-full text-black">
          Certificate Generation
        </p>

        <p
          onClick={BulkselectHandler}
          className="flex text-sm justify-center w-full lg:w-[20%] cursor-pointer p-2 lg:p-[12px] items-center rounded-2xl gap-2 bg-main-dark"
        >
          <RiAiGenerate />
          {isBulkSelectMode ? "Gerar Selecionados" : "Selecionar Múltiplos"}
        </p>
      </div>

      <Card className="h-full lg:overflow-hidden overflow-x-scroll w-full px-6">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD4.map((head) => (
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
            {currentData.map((student, index) => {
              const isLast = index === currentData.length - 1;
              const classes = isLast
                ? "py-4 p-3"
                : "py-4 p-3 border-b border-gray-300";
              const isChecked = selectedIds.includes(student.student_id);
              const rowNumber = startIndex + index + 1;
              const safeDateStr = student.last_activity?.replace(
                /\.(\d{3})\d*Z$/,
                ".$1Z"
              );
              const date = safeDateStr ? new Date(safeDateStr) : null;
              const formattedDate =
                date instanceof Date && !isNaN(date)
                  ? `${date.getFullYear()}/${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}/${String(date.getDate()).padStart(
                      2,
                      "0"
                    )}`
                  : "N/A";
              return (
                <tr key={student.student_id} className="hover:bg-gray-50">
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600 flex items-center gap-2"
                    >
                      {isBulkSelectMode && (
                        <Checkbox
                          checked={isChecked}
                          onChange={() => toggleSelection(student.student_id)}
                        />
                      )}
                      {rowNumber}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={student.img}
                        alt={student.student_name}
                        size="sm"
                      />
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {student.student_name}
                        </Typography>
                      </div>
                    </div>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {student.medals}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {student.score}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      90%
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {formattedDate}
                    </Typography>
                  </td>

                  <td style={{ position: "relative" }} className={classes}>
                    <IconButton
                      onClick={() => toogleEdit(student.student_id)}
                      variant="text"
                    >
                      <BsThreeDotsVertical className="rotate-90 h-4 w-4" />
                    </IconButton>
                    <Card
                      onClick={() => toogleEdit(student.student_id)}
                      className={`${
                        selectedUserId === student.student_id
                          ? "block"
                          : "hidden"
                      } ${
                        isLast ? "-top-20" : "top-0"
                      } right-16 absolute w-[135px]`}
                    >
                      <List className="w-[120px] text-xs">
                        <ListItem
                          onClick={() =>
                            handleOpen({
                              avatar: student.img,
                              name: student.student_name,
                              email: student.email,
                              dataDeRegistro: date,
                            })
                          }
                          className="w-[120px] text-xs"
                        >
                          <ListItemPrefix>
                            <IoEyeOutline />
                          </ListItemPrefix>
                          Ver
                        </ListItem>
                        <ListItem
                          onClick={() => handleGenerate(student.student_id)}
                          className="w-[120px] text-xs"
                        >
                          <ListItemPrefix>
                            <RiAiGenerate />
                          </ListItemPrefix>
                          Gerar
                        </ListItem>
                      </List>
                    </Card>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <CertificateDialog
        open={open}
        onClose={handleClose}
        onButtonClick={handleExport}
      />

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
        onClose={handle2Close}
        user={selectedUser}
      />
    </div>
  );
}

export default Generate;
