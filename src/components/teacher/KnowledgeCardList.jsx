import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { BsFillTrashFill, BsThreeDotsVertical } from "react-icons/bs";
import { GoPencil } from "react-icons/go";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import React, { useState } from "react";
import axios_instance from "../../utils/axios";
import { getUserProfile } from "../../utils/auth";

const EmptyState = ({ message }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
    <h1> Add your lesson</h1>
    <p className="text-gray-500">{message}</p>
  </div>
);

const KnowledgeCardList = ({
  data,
  offset = 0,
  toogleEdit,
  handleDelete,
  title,
  emptyMessage,
}) => {
  const location = useLocation();
  const [identifier, setIdentifier] = useState(null);

  // Check if 'student' is in the current path
  const isStudentRoute = location.pathname.includes(
    "/student/dashboard/knowledge"
  );

  const isStudentdashboardRoute = location.pathname === "/student/dashboard";

  const toogle = (id) => {
    if (identifier === id) {
      setIdentifier(null);
    } else {
      setIdentifier(id);
    }
  };
  const profile = getUserProfile();
  const role = profile?.role?.toLowerCase();

  const isStudent = role === "student";

  const onWatch = async (id) => {
    if (isStudent) {
      try {
        await axios_instance.put(`learning/knowledge-trail/${id}/`, {
          is_watched: true,
        });

      } catch (error) {
        console.error("Failed to mark item as watched:", error);
      }
    }
  };

  return (
    <>
      <div>
        <p className="font-bold text-[18px] lg:text-[22px] text-black">
          {title}
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3">
        {data?.length > 0 ? (
          data?.map((item, index) => {
            const idx = index + offset;
            return (
              <div
                key={item.id}
                className="p-3 relative mb-4 flex flex-col gap-1 rounded-xl"
              >
                <Link
                  onClick={() => onWatch(item.id)}
                  to={
                    isStudentdashboardRoute
                      ? "/student/dashboard/knowledge"
                      : `knowledge-details/${item.id}`
                  }
                  className="w-full rounded-xl h-[150px] bg-center bg-cover bg-no-repeat relative group "
                  style={{ backgroundImage: `url('${item.thumbnail}')` }}
                >
                  <div className="rounded-full size-10 bg-main-light p-2 absolute -right-2 -top-2 z-10 flex items-center justify-center">
                    {item.pdf_file && item.video_file ? (
                      <FaVideo />
                    ) : item.pdf_file ? (
                      <FaFilePdf />
                    ) : (
                      <FaVideo />
                    )}
                  </div>
                  {/* Dark overlay */}
                  <div className="absolute rounded-xl  inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-opacity"></div>

                  {/* Play icon */}
                  <FaPlay
                    className="absolute top-1/2 left-1/2 text-white text-4xl transform -translate-x-1/2 -translate-y-1/2
               bg-transparent    transition-colors"
                  />
                </Link>
                <p className="flex justify-between items-end text-lg font-semibold">
                  <span>{item.subject_name}</span>
                  {!isStudentRoute && (
                    <BsThreeDotsVertical
                      onClick={() => toogle(idx)}
                      size={15}
                      className="rotate-90 cursor-pointer"
                    />
                  )}
                </p>
                <span className="-mt-1 text-sm text-black/50">
                  {item.title}
                </span>
                <span className="-mt-1 text-sm text-black/50">
                  {item.assigned_by}
                </span>
                <Card
                  onClick={() => toogle(idx)}
                  className={`${
                    identifier === idx ? "block" : "hidden"
                  } right-10 -bottom-20 z-50 absolute w-[135px]`}
                >
                  <List className="w-[120px] text-xs">
                    <ListItem
                      onClick={() => toogleEdit(idx)}
                      className="w-[120px] text-xs"
                    >
                      <ListItemPrefix>
                        <GoPencil />
                      </ListItemPrefix>
                      Editar
                    </ListItem>
                    <ListItem
                      onClick={() => handleDelete(item.id)}
                      className="text-xs w-[120px] font-semibold"
                    >
                      <ListItemPrefix>
                        <BsFillTrashFill />
                      </ListItemPrefix>
                      Excluir
                    </ListItem>
                  </List>
                </Card>
              </div>
            );
          })
        ) : (
          <EmptyState message={emptyMessage} />
        )}
      </div>
    </>
  );
};

export default KnowledgeCardList;
