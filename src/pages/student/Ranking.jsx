import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios_instance from "../../utils/axios";
import { FiSearch } from "react-icons/fi";
import { IoMdFunnel } from "react-icons/io";
import { LuArrowDownUp } from "react-icons/lu";
import { TABLE_HEAD5, TABLE_ROWS } from "../../../helper/data";
import ViewProfileModal from "../../components/teacher/ViewStudentProfileModal";

const getInitials = (name) => {
  if (!name) return "NA";
  const parts = name.split(" ");
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
};

function StudentRanking() {
  const [Data, setData] = useState(TABLE_ROWS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(Data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = Data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await axios_instance.get("learning/leaderboard/leaderboard/");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    }
    fetchSubjects();
  }, []);

  const handleClose = () => setIsModalOpen(false);

  const handleOpen = (userdata) => {
    setSelectedUser(userdata);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-2 px-3 overflow-hidden lg:px-0">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Ranking
      </Typography>

      <div className="flex justify-between px-10 items-center text-black/50">
        <div className="flex gap-3 text-lg">
          <IoMdFunnel />
          <LuArrowDownUp />
        </div>

        <TextField
          variant="outlined"
          size="small"
          placeholder="Pesquisar aqui"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FiSearch size={16} />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Card className="mt-4">
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[600px] table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD5.map((head) => (
                  <th key={head} className="pb-4 pt-6 border-b">
                    <Typography variant="body2" fontWeight="bold">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD5.length} className="text-center py-10 text-gray-500">
                    No student data available
                  </td>
                </tr>
              ) : (
                currentData.map(({ student_name, image, score, Attendance, last_activity }, index) => {
                  const rowClasses = index === currentData.length - 1 ? "py-4" : "py-4 border-b";
                  const safeDateStr = last_activity?.replace(/\.(\d{3})\d*Z$/, ".$1Z");
                  const date = safeDateStr ? new Date(safeDateStr) : null;

                  const formattedDate =
                    date instanceof Date && !isNaN(date)
                      ? `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
                          date.getDate()
                        ).padStart(2, "0")}`
                      : "N/A";

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className={rowClasses}>{startIndex + index + 1}</td>
                      <td className={rowClasses}>
                        <div className="flex items-center gap-3">
                          <Avatar src={image || undefined}>
                            {!image && getInitials(student_name)}
                          </Avatar>
                          <Typography variant="body2" className="text-gray-800">
                            {student_name}
                          </Typography>
                        </div>
                      </td>
                      <td className={rowClasses}>{score}</td>
                      <td className={rowClasses}>{Attendance}</td>
                      <td className={rowClasses}>{formattedDate}</td>
                      <td className={rowClasses}>
                        <IconButton
                        sx={{fontSize: "15px"}}
                          onClick={() =>
                            handleOpen({
                              avatar: image,
                              name: student_name,
                              score,
                              Attendance,
                              last_activity: formattedDate,
                            })
                          }
                        >
                          Ver
                        </IconButton>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>

        <CardActions className="flex justify-between border-t px-4 py-2">
          <Typography variant="body2">Página {currentPage} de {totalPages}</Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </CardActions>
      </Card>

      <ViewProfileModal open={isModalOpen} onClose={handleClose} user={selectedUser} />
    </div>
  );
}

export default StudentRanking;
