import React, { useState, useEffect } from "react";
import axios_instance from "../../utils/axios";
import KnowledgeCardList from "../../components/teacher/KnowledgeCardList";

function Activity() {
  const [watchedVideo, setwatchedVideo] = useState([]);
  const [knowledge_trails_pdf, setKnowledge_trails_pdf] = useState([]);
  const [playedGames, setPlayedGames] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios_instance.get("learning/student-activity/");
        const watched_video = response.data.knowledge_trails_watched_video || [];
        const knowledge_trails_pdf = response.data.knowledge_trails_pdf || [];
        const played_games = response.data.played_games || [];

        setwatchedVideo(watched_video);
        setKnowledge_trails_pdf(knowledge_trails_pdf);
        setPlayedGames(played_games);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Extract unique game titles from playedGames
  const playedGameTitles = Array.from(
    new Set(playedGames.map((entry) => entry.game?.title))
  );

  const allGameTypes = [
    "quiz",
    "fillInTheBlank",
    "dragAndDrop",
    "matchTheColoum",
    "WordHunt",
  ];

  const filteredPlayedGames = allGameTypes.filter((type) =>
    playedGameTitles.includes(type)
  );

  return (
    <div className="pr-5 px-3 pt-3">
      <p className="font-bold text-[22px] text-black">Detalhes da Atividade</p>

      {/* Vídeos Assistidos */}
      <div className="flex justify-between items-center text-white">
        <p className="font-bold text-sm text-black/50">Vídeos que Você Assistiu</p>
        <p className="flex cursor-pointer p-[10px] items-center rounded-2xl text-sm gap-2 bg-main-dark">Ver tudo</p>
      </div>
      <KnowledgeCardList
        data={watchedVideo}
        emptyMessage="Nenhuma trilha de conhecimento disponível ainda."
      />

      {/* Jogos que Você Jogou */}
      <div className="flex mt-5 justify-between items-center text-white">
        <p className="font-bold text-[22px] text-black">Jogos que Você Jogou</p>
        <p className="flex cursor-pointer p-[10px] items-center rounded-2xl text-sm gap-2 bg-main-dark">Ver tudo</p>
      </div>
      <div className="grid mt-3 grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredPlayedGames.map((item, id) => (
          <div key={id} className="flex flex-col items-start gap-1">
            <img src={`/teacher/${item}.png`} alt={item} />
          </div>
        ))}
      </div>

      {/* PDFs */}
      <div className="flex mt-5 justify-between items-center text-white">
        <p className="font-bold text-[22px] text-black">Trilha do Conhecimento</p>
        <p className="flex cursor-pointer p-[10px] items-center rounded-2xl text-sm gap-2 bg-main-dark">Ver tudo</p>
      </div>
      <KnowledgeCardList
        data={knowledge_trails_pdf}
        emptyMessage="Nenhuma trilha de conhecimento disponível ainda."
      />
    </div>
  );
}

export default Activity;
