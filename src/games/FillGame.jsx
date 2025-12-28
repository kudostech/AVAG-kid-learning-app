import React, { useEffect, useState } from "react";
import axios_instance from "../utils/axios";

function FillGame(student_id) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios_instance.get("learning/games/");
        const categories = response.data;

        // Extract all fill_in_the_blank questions from all categories
        const fillQuestions = categories.flatMap((category) =>
          category.questions.filter(
            (q) => q.question_type === "fill_in_the_blank"
          )
        );

        // Shuffle and pick first 10 (or all if less)
        const shuffled = fillQuestions.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    fetchQuestions();
  }, []);

  const handleChange = (e) => {
    if (!questions.length) return;
    const maxLength = questions[currentQuestionIndex].correct_answer.length;
    if (e.target.value.length <= maxLength) {
      setUserAnswer(e.target.value.toLowerCase());
    }
  };

  const handleSubmit = async () => {
    if (!questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];

    if (userAnswer.length !== currentQuestion.correct_answer.length) return;

    const isAnswerCorrect =
      userAnswer.trim() === currentQuestion.correct_answer.toLowerCase();

    // Submit the answer to the backend
    try {
      await axios_instance.post("learning/submit-answer/", {
        student: student_id.student_id,
        question: currentQuestion.id,
        selected_option: null, // No options for fill-in-the-blank
        typed_answer: userAnswer.trim(),
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
    }

    // Save result in state
    setResults((prev) => [
      ...prev,
      {
        question: currentQuestion.question_text,
        userAnswer,
        correctAnswer: currentQuestion.correct_answer,
        isCorrect: isAnswerCorrect,
      },
    ]);

    setUserAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    } else {
      setProgress(100);
      setShowModal(true);
    }
  };

  if (!questions.length) return <p>Loading questions...</p>;

  return (
    <div className="flex flex-col w-full items-center justify-center p-5">
      <div className="w-full flex bg-gray-300 rounded-full h-4 mb-6">
        <div
          className="bg-main-dark h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex bg-main-light rounded-lg p-4 w-full justify-center mt-10">
        <p className="text-xl lg:text-4xl mb-4 text-black text-center">
          {(() => {
            const question = questions[currentQuestionIndex];
            const parts = question.question_text.split("___");

            if (parts.length === 1) {
              return question.question_text; // No blank in the question
            }

            return parts.map((part, i) => (
              <span key={i}>
                {part}
                {i < parts.length - 1 && (
                  <input
                    type="text"
                    className="inline-block border-b-2 font-semibold border-gray-400 outline-none mx-1 w-24 text-center text-black bg-white"
                    // maxLength={question.correct_answer?.length || 20}
                    onChange={handleChange}
                    value={userAnswer}
                  />
                )}
              </span>
            ));
          })()}
        </p>
      </div>

      <button
        className={`bg-blue-500 mt-10 text-white py-2 px-4 rounded ${
          userAnswer.length !==
          questions[currentQuestionIndex].correct_answer.length
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={handleSubmit}
        disabled={
          userAnswer.length !==
          questions[currentQuestionIndex].correct_answer.length
        }
      >
        Enviar Resposta
      </button>

      {showModal && (
        <div className="modal">
          <h2>Quiz complete!</h2>
          <p>
            You got {results.filter((r) => r.isCorrect).length} out of{" "}
            {results.length} correct.
          </p>
          {/* Add your confetti/modal UI here */}
        </div>
      )}
    </div>
  );
}

export default FillGame;
