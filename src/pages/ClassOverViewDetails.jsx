import {
  Dialog,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { subtitle } from "../../helper/data";
import { useLocation, useParams } from "react-router-dom";
import axios_instance from "../utils/axios";

function ClassOverViewDetails() {
  const location = useLocation();
  const { id } = useParams();
  const check = location.pathname.includes("/teacher/dashboard");

  const [open, setOpen] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const allTabs = [
    {
      label: "Transcrição",
      value: "Transcrição",
      desc: `It really matters and then like it really doesn't matter...`,
    },
    {
      label: "Notas",
      value: "Notas",
      desc: `Because it's about motivating the doers...`,
    },
    {
      label: "PDFs",
      value: "pDFs",
      desc: `Because it's about motivating the doers...`,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios_instance.get(
          `learning/knowledge-trail/${id}`
        );
        const results = response.data || {};
        setCourseData(results);
        console.log(results);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [id]);

  useEffect(() => {
    if (!courseData) return;

    const filteredTabs = courseData.pdf_file
      ? allTabs.filter((tab) => tab.value !== "Transcrição")
      : allTabs;

    setData(filteredTabs);
    setActiveTab(courseData.pdf_file ? "Notas" : "Transcrição");
  }, [courseData]);

  return (
    <div className="p-3 flex gap-3 flex-col pt-5 pr-10">
      {generate && (
        <Dialog
          open={generate}
          handler={() => setGenerate((prev) => !prev)}
          size="xs"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          className="border-2 border-main-dark"
        >
          <div className="2xl:p-[30px] justify-center items-center font-num w-[100%] p-4 lg:p-5 flex flex-col gap-[18px] rounded-xl 2xl:rounded-3xl bg-main-light">
            <img src="/teacher/pdf.png" className="w-[50%]" />
            <div className="w-full flex flex-col items-center justify-center">
              <p className="text-main-dark font-semibold text-2xl">Parabéns</p>
              <p className="text-center">
                Parabéns! Seu certificado foi gerado com sucesso
              </p>
            </div>
            <p
              className="bg-main-dark w-[100%] rounded-xl text-center text-white font-bold text-xl mt-2 2xl:text-2xl py-3 cursor-pointer"
              onClick={() => setGenerate((prev) => !prev)}
            >
              Exportar como PDF
            </p>
          </div>
        </Dialog>
      )}

      {!check && (
        <Dialog
          open={open}
          size="xs"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          className="border-2 border-main-dark"
        >
          <div className="2xl:p-[30px] justify-center items-center font-num w-[100%] p-4 lg:p-5 flex flex-col gap-[18px] rounded-xl 2xl:rounded-3xl bg-main-light">
            <img src="/student/congrat.png" className="w-[50%]" />
            <div className="w-full flex text-center flex-col items-center">
              <p className="text-main-dark font-semibold text-2xl">Parabéns</p>
              <p className="text-center text-lg font-medium">
                Você concluiu com sucesso
              </p>
              <p className="text-center text-sm">
                Clique no botão abaixo para gerar e baixar seu certificado de
                conclusão de curso
              </p>
            </div>
            <p
              className="bg-main-dark w-[100%] rounded-xl text-center text-white font-bold text-xl mt-2 2xl:text-2xl py-3 cursor-pointer"
              onClick={() => {
                setOpen(false);
                setGenerate(true);
              }}
            >
              Gerar certificado
            </p>
          </div>
        </Dialog>
      )}

      <p className="font-bold text-[22px] text-black">Trilha do Conhecimento</p>

      <div className="relative w-full" style={{ paddingTop: "50%" }}>
        {courseData?.pdf_file && courseData?.video_file ? (
          <video
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
            controls
            poster={courseData.thumbnail}
            src={courseData.video_file}
          />
        ) : courseData?.pdf_file ? (
          // Show thumbnail image when only PDF is present (no video)
          <img
            className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
            src={courseData.thumbnail}
            alt="PDF thumbnail"
          />
        ) : courseData?.video_file ? (
          // Show video when only video_file is present
          <video
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
            controls
            poster={courseData.thumbnail}
            src={courseData.video_file}
          />
        ) : courseData?.thumbnail ? (
          // Show thumbnail image if only thumbnail exists
          <img
            className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
            src={courseData.thumbnail}
            alt="Thumbnail"
          />
        ) : null}
      </div>

      <p className="font-bold text-[22px] text-black">Lição 01: O que é UX?</p>

      {activeTab && data.length > 0 && (
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none border-b w-[35%] border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-4 border-main-dark shadow-none rounded-[3px]",
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={activeTab === value ? "text-main-dark" : ""}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody className="border-t border-black/20">
            {data.map(({ value }) => (
              <TabPanel key={value} value={value}>
                {value === "Transcrição" ? (
                  <div className="flex gap-5 flex-col">
                    {subtitle.map((data, i) => (
                      <div key={i} className="flex gap-6">
                        <p className="flex w-[30%]">{data.time}</p>
                        <p className="text-start text-sm">{data.transcript}</p>
                      </div>
                    ))}
                  </div>
                ) : value === "pDFs" && courseData?.pdf_file ? (
                  <div className="p-3 border rounded-lg bg-gray-50">
                    <p className="mb-2 font-semibold">Download do PDF:</p>
                    <a
                      href={courseData.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {courseData.pdf_file.split("/").pop()}
                    </a>
                  </div>
                ) : (
                  <div>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Sit velit perspiciatis nesciunt, impedit ipsa atque magni
                    possimus expedita iure ea tempora magnam non ab nemo qui
                    provident assumenda totam? Inventore?
                  </div>
                )}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      )}
    </div>
  );
}

export default ClassOverViewDetails;
