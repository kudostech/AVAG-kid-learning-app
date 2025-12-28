import React, { useEffect, useState } from 'react';
import axios_instance from "../utils/axios";
import { Dialog } from "@material-tailwind/react";
import Confetti from 'react-confetti';

const QuizGameTwo = (student_id) => {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  useEffect(() => {
    axios_instance.get('learning/games/')
      .then((response) => {
        const allQuizQuestions = response.data.flatMap(item =>
          item.questions.filter(q => q.question_type === "quiz")
        );
        const selectedQuestions = shuffleArray(allQuizQuestions).slice(0, 10);
        setQuestionsData(selectedQuestions);
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error);
      });
  }, []);

  const currentQuestion = questionsData[currentQuestionIndex];

  const handleAnswerSelect = (key) => {
    setSelectedAnswerKey(key);
  };

 const handleSubmit = () => {
  if (!currentQuestion || selectedAnswerKey === null) return;

  const selectedIndex = parseInt(selectedAnswerKey.split('-')[1], 10);
  const selectedOption = currentQuestion.options[selectedIndex];
  const selectedOptionId = selectedOption?.id;

  // Submit the answer
  axios_instance.post("learning/student-answers/", {
    student: student_id.student_id,
    question: currentQuestion.id,
    selected_option: selectedOptionId,
    typed_answer: null, // Optional, used for typed questions
  }).catch(error => {
    console.error("Error submitting answer:", error);
  });

  // Evaluate and continue
  if (selectedOption?.is_correct) {
    setScore(score + (currentQuestion.points || 1));
  }

  setProgress(((currentQuestionIndex + 1) / questionsData.length) * 100);

  if (currentQuestionIndex + 1 < questionsData.length) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswerKey(null);
  } else {
    setShowModal(true);
  }
};


  const handleReset = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswerKey(null);
    setProgress(0);
    setShowModal(false);
  };

  const shareScore = () => {
    const shareText = `Eu acertei ${score} pontos no jogo Quiz! 🎉`;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  return (
    <div className="w-full h-full flex p-6">
      <div className="w-full h-full flex flex-col rounded-lg">
        <div className="flex gap-5 w-full mb-3 lg:p-2 justify-start items-center text-white">
          <p className="font-bold lg:text-[20px] text-black">
            Jogue e Ganhe{" "}
            <img src="/student/bulb.png" className="inline-block my-auto" alt="" />
          </p>
          <p className="flex cursor-pointer p-[10px] items-center rounded-2xl gap-2 bg-main-dark">
            Pontuação Total: {score}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-main-dark h-4 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-2xl lg:text-3xl text-center font-bold text-black my-4">
          {currentQuestion ? currentQuestion.question_text : "Carregando perguntas..."}
        </p>

        <div className="lg:flex grid grid-cols-2 w-full h-80 lg:h-64 gap-4 justify-between p-3">
          {currentQuestion?.options?.map((option, index) => {
            const key = `${currentQuestionIndex}-${index}`;
            return (
              <label
                key={key}
                className={`flex items-center justify-between h-full w-full cursor-pointer p-4 bg-main-light text-main-dark text-xl lg:text-2xl font-medium rounded-lg mb-2 transition-all ${
                  selectedAnswerKey === key ? 'border-2 border-blue-500' : ''
                }`}
              >
                <span className="flex-1 text-left">{option.option_text}</span>
                <input
                  type="radio"
                  name={`quiz-option-${currentQuestionIndex}`}
                  checked={selectedAnswerKey === key}
                  onChange={() => handleAnswerSelect(key)}
                  className="w-5 h-5"
                />
              </label>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-main-dark text-white py-2 px-4 rounded mt-4 w-full"
          disabled={selectedAnswerKey === null}
        >
          {currentQuestionIndex + 1 < questionsData.length
            ? 'Próxima Pergunta'
            : 'Finalizar'}
        </button>

        {showModal && (
          <>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              tweenDuration={5000}
              numberOfPieces={300}
              wind={0.01}
            />
            <Dialog
              open={showModal}
              handler={handleReset}
              size="xs"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
              }}
              className="border-2 border-main-dark"
              onClick={handleReset}
            >
              <div className="2xl:p-[30px] justify-center items-center font-num w-[100%] p-4 lg:p-5 flex flex-col gap-[18px] rounded-xl 2xl:rounded-3xl bg-main-light">
                <img src="/student/congrat.png" className="w-[30%]" />
                <div className="w-full flex flex-col items-center">
                  <p className="text-main-dark font-bold text-3xl">Parabéns</p>
                  <p className="text-xl m-1 text-[#545454] font-semibold">{`${score} pontos!`}</p>
                  <p className="text-center">
                    Agora você entrou na disputa pelo GRANDE PRÊMIO de 1 garrafa da sua escolha durante a festa de hoje à noite!...
                  </p>
                </div>
                <p className="text-main-dark font-semibold text-2xl">Sua pontuação</p>
                <p className="text-main-dark font-semibold text-5xl -mt-1">{score}</p>
                <p className="cursor-pointer" onClick={shareScore}>
                  <img src="/student/social.png" className="w-28 h-fit" alt="" />
                </p>
              </div>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizGameTwo;
