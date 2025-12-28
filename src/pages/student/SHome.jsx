import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoTriangle } from "react-icons/io5";
import { studentData, studentNotify } from "../../../helper/data";
import { getUserProfile } from "../../utils/auth";
import { Link } from "react-router-dom";
import KnowledgeCardList from "../../components/teacher/KnowledgeCardList";
import axios_instance from "../../utils/axios";

export default function SHome() {
  const profile = getUserProfile();
  const [courseData, setCourseData] = useState([]);
  const [courseDataB, setCourseDataB] = useState([]);
  const [stats, setStats] = useState([]);
  const [watchedVideo, setwatchedVideo] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios_instance.get("learning/knowledge-trail/");
        const results = response.data || [];
        setCourseData(results);
        setCourseDataB(results.filter((row) => row.is_watched === true));
      } catch (error) {
        console.error("Error fetching students:", error);
      }
      try {
        const statsResponse = await axios_instance.get(
          "learning/statistics/student-stats/"
        );
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      try {
        const response = await axios_instance.get("learning/student-activity/");
        const watched_video =
          response.data.knowledge_trails_watched_video || [];
        setwatchedVideo(watched_video);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);
  const data = Object.entries(stats).map(([key, value]) => {
    return {
      label: key,
      count: value.count,
      desp: value.new_certificates ?? value.difference ?? 0,
      difference: value.difference ?? value.new_certificates ?? 0,
      // img: "/path-to-icon.svg" if needed
    };
  });
  return (
    <div className="pr-4 px-3 lg:px-0 flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-center -mb-1 text-2xl font-bold">
          Olá, {profile?.first_name} {profile?.last_name}
        </h1>
        <img src="/teacher/avatar.png" className="size-12" />
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:col-span-2">
          {data.map((card, id) => (
            <div
              key={id}
              className="flex p-5 gap-3 bg-main-light justify-start items-center rounded-lg"
            >
              <div className="bg-[#A9E8FF] p-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <img
                  src="/teacher/thumb.png"
                  alt={card.label}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </div>

              <div>
                <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl capitalize">
                  {card.label}
                </p>

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
        <div className=" grid lg:col-span-1 col-span-2 lg:flex flex-col px-5 gap-3">
          <p className="px-8 text-main-dark font-medium flex">
            Classificação
            <img src="/student/star.png" alt="" />
          </p>
          {studentNotify.map((winner, id) => (
            <div key={id} className="flex items-center gap-3">
              <p className="bg-main-light text-center flex items-center justify-center  size-10 text-xs text-main-dark w-7 font-medium rounded-full h-7 ">
                #{winner.value}
              </p>
              <div className="bg-main-light py-[3px] items-center relative flex w-full gap-2 px-3 rounded-lg">
                <img src={winner.img} className="size-8" />
                <div>
                  <p className="text-base font-medium">{winner.name}</p>
                  <p className="text-xs text-black/50">{winner.desp}</p>
                </div>
                <img
                  src="/student/award.png"
                  className="absolute -top-[14px] right-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between p-2 items-center text-white">
          <p className="font-bold text-[22px] text-black">
            Trilha do Conhecimento
          </p>
          <Link
            to="/student/dashboard/knowledge"
            className="flex cursor-pointer p-[10px] items-center rounded-2xl gap-2 bg-main-dark"
          >
            Ver tudo
          </Link>
        </div>
        <KnowledgeCardList
          data={courseData}
          emptyMessage="Nenhuma trilha de conhecimento disponível ainda."
        />
        <div className="flex justify-between p-2 items-center text-white">
          <p className="font-bold text-[22px] text-black">Trilha das Aulas</p>
          <Link
            to="/student/dashboard/knowledge"
            className="flex cursor-pointer p-[10px] items-center rounded-2xl gap-2 bg-main-dark"
          >
            Ver tudo
          </Link>
        </div>
        {/* <div className="grid  grid-cols-2 lg:grid-cols-4 gap-2 p-3 "> */}
        <KnowledgeCardList
          data={watchedVideo}
          emptyMessage="Nenhuma trilha de conhecimento disponível ainda."
        />
        {/* </div> */}
      </div>
    </div>
  );
}
