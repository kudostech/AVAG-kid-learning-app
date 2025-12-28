import React, { useEffect, useState } from "react";
import axios_instance from "../utils/axios";
import QuestionTabsLayout from "../components/QuestionTabsLayout";

function Game1() {
  function getDefaultQuestion() {
    return {
      question_text: "",
      question_type: "quiz",
      points: 0,
      correctIndex: null,
      options: ["", "", "", ""],
    };
  }

  const [tab, setTab] = useState("create");
  const [questions, setQuestions] = useState([getDefaultQuestion()]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "list") {
      fetchQuestions();
    }
  }, [tab]);

  const fetchQuestions = async () => {
    try {
      const res = await axios_instance.get("learning/games/");
      const quizQuestions = res.data?.find((g) => g.title === "quiz")?.questions || [];

      const formatted = quizQuestions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        options: q.options,
      }));

      setSubmittedQuestions(formatted);
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, getDefaultQuestion()]);
  };

  const cancelQuestion = (index) => {
    if (questions.length === 1) return;
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question_text = value;
    setQuestions(updated);
  };

  const handlePointChange = (index, value) => {
    const updated = [...questions];
    updated[index].points = parseInt(value, 10) || 0;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerSelect = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = optIndex;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        alert(`Pergunta ${i + 1} precisa ter texto.`);
        return;
      }
      if (!Number.isInteger(q.points) || q.points <= 0) {
        alert(`Pergunta ${i + 1} precisa ter pontos válidos.`);
        return;
      }
      if (q.correctIndex === null) {
        alert(`Pergunta ${i + 1} precisa ter uma resposta correta.`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`Pergunta ${i + 1} tem opções vazias.`);
        return;
      }
    }

    const formattedQuestions = questions.map((q) => ({
      question_text: q.question_text.trim(),
      question_type: q.question_type,
      points: q.points,
      options: q.options.map((text, i) => ({
        id: i + 1,
        option_text: text.trim(),
        is_correct: i === q.correctIndex,
      })),
    }));

    try {
      setLoading(true);
      if (editIndex !== null && editId !== null) {
        await axios_instance.put(`learning/games/${editId}/`, formattedQuestions[0]);

        const updated = [...submittedQuestions];
        updated[editIndex] = { ...formattedQuestions[0], id: editId };
        setSubmittedQuestions(updated);
      } else {
        await axios_instance.post("learning/games/", {
          title: "quiz",
          questions: formattedQuestions,
        });

        setSubmittedQuestions([...submittedQuestions, ...formattedQuestions]);
      }

      setQuestions([getDefaultQuestion()]);
      setEditIndex(null);
      setEditId(null);
      setTab("list");
    } catch (error) {
      console.error("Erro ao enviar pergunta:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const index = submittedQuestions.findIndex((q) => q.id === id);
    if (index === -1) return;

    const questionToEdit = submittedQuestions[index];
    const correctIndex = questionToEdit.options.findIndex(opt => opt.is_correct);

    setQuestions([{
      question_text: questionToEdit.question_text,
      question_type: questionToEdit.question_type,
      points: questionToEdit.points,
      options: questionToEdit.options.map(opt => opt.option_text),
      correctIndex,
    }]);
    setEditIndex(index);
    setEditId(id);
    setTab("create");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar essa pergunta?")) return;

    try {
      await axios_instance.delete(`learning/games/${id}/`);
      const updated = submittedQuestions.filter((q) => q.id !== id);
      setSubmittedQuestions(updated);
    } catch (error) {
      console.error("Erro ao deletar pergunta:", error);
    }
  };

  return (
    <QuestionTabsLayout activeTab={tab} onTabChange={setTab}>
      {tab === "create" && (
        <>
          {editIndex !== null && (
            <div className="text-yellow-600 font-medium mb-4">Editando pergunta existente</div>
          )}
          {questions.map((q, i) => (
            <div key={i} className="mb-8 border-b border-gray-300 pb-4 relative">
              <div className="flex justify-between items-center mb-2">
                <p className="text-2xl font-bold text-black">Pergunta {i + 1}</p>
                {questions.length > 1 && (
                  <button
                    onClick={() => cancelQuestion(i)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Pergunta"
                value={q.question_text}
                onChange={(e) => handleQuestionChange(i, e.target.value)}
                className="w-full p-3 bg-input rounded-lg outline-none text-main-dark/70 placeholder:text-main-dark/70"
              />
              <input
                type="number"
                placeholder="Pontos"
                value={q.points}
                onChange={(e) => handlePointChange(i, e.target.value)}
                className="mt-2 w-32 p-3 bg-input rounded-lg outline-none text-sm text-black"
                min={1}
              />

              <div className="grid grid-cols-2 lg:flex w-full h-80 lg:h-64 gap-4 justify-between p-3 mt-4">
                {q.options.map((opt, j) => (
                  <div
                    key={j}
                    className="flex flex-col items-center justify-center text-center h-full cursor-pointer p-4 bg-main-light text-main-dark text-xl lg:text-3xl font-bold rounded-lg"
                  >
                    <textarea
                      rows={2}
                      placeholder="Opção"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, j, e.target.value)}
                      className="w-full py-3 px-4 rounded-lg border-2 border-input bg-transparent outline-none text-[#545454] placeholder:text-[#545454]"
                      style={{ resize: "none" }}
                    />
                    <label className="mt-2 text-sm text-black">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={q.correctIndex === j}
                        onChange={() => handleCorrectAnswerSelect(i, j)}
                        className="mr-2"
                      />
                      Resposta correta
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            {/* Only show the Add Question button if NOT editing */}
            {editIndex === null && (
              <button
                onClick={addQuestion}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                + Adicionar pergunta
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-main-dark text-white px-6 py-2 rounded-lg"
            >
              {editIndex !== null ? "Atualizar pergunta" : "Criar jogo"}
            </button>
          </div>
        </>
      )}

      {tab === "list" && (
        <div className="space-y-5">
          {submittedQuestions.length === 0 ? (
            <p className="text-gray-600">Nenhuma questão criada ainda.</p>
          ) : (
            submittedQuestions.map((q, i) => (
              <div key={q.id} className="bg-main-light p-4 rounded-lg text-main-dark">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">
                    {i + 1}. {q.question_text}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(q.id)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
                <ul className="list-disc ml-6 mt-2">
                  {q.options.map((opt, j) => (
                    <li
                      key={j}
                      className={opt.is_correct ? "font-bold text-green-600" : ""}
                    >
                      {opt.option_text} {opt.is_correct && "(Correta)"}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-gray-700">Pontos: {q.points}</p>
              </div>
            ))
          )}
        </div>
      )}
    </QuestionTabsLayout>
  );
}

export default Game1;
