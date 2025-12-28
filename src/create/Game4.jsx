import React, { useEffect, useState } from "react";
import axios_instance from "../utils/axios";
import QuestionTabsLayout from "../components/QuestionTabsLayout";

function Game4() {
  // Function to get default question structure for create tab
  function getDefaultQuestion() {
    return {
      question_text: "",
      answer_text: "",
      options: ["", "", "", ""],
      points: 0,  // new field
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

  // Fetch existing questions for the list tab
  const fetchQuestions = async () => {
    try {
      const res = await axios_instance.get("learning/games/");
      const smartSortGame = res.data?.find((g) => g.title === "smart_sort");
      const smartSortQuestions = smartSortGame?.questions || [];

      const formatted = smartSortQuestions.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        answer_text: q.answer_text || "",
        options: q.options,
        points: q.points || 0, // get points
      }));

      setSubmittedQuestions(formatted);
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err);
    }
  };

  // Add new empty question input block
  const addQuestion = () => {
    setQuestions([...questions, getDefaultQuestion()]);
  };

  // Remove question input block
  const cancelQuestion = (index) => {
    if (questions.length === 1) return;
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // Update question text input
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question_text = value;
    setQuestions(updated);
  };

  // Update answer text input
  const handleAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].answer_text = value;
    setQuestions(updated);
  };

  // Update option text inputs
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // Update points input
  const handlePointsChange = (index, value) => {
    const updated = [...questions];
    updated[index].points = Number(value);
    setQuestions(updated);
  };

  // Submit either create or update
  const handleSubmit = async () => {
    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        alert(`Pergunta ${i + 1} precisa ter texto.`);
        return;
      }
      if (!q.answer_text.trim()) {
        alert(`Pergunta ${i + 1} precisa ter resposta.`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`Pergunta ${i + 1} tem opções vazias.`);
        return;
      }
      if (q.points < 0 || isNaN(q.points)) {
        alert(`Pergunta ${i + 1} precisa ter pontos válidos (número >= 0).`);
        return;
      }
    }

    // Format for API
    const formattedQuestions = questions.map((q) => ({
      question_text: q.question_text.trim(),
      answer_text: q.answer_text.trim(),
      options: q.options.map((text, i) => ({
        id: i + 1,
        option_text: text.trim(),
      })),
      points: q.points,
    }));

    try {
      setLoading(true);

      if (editIndex !== null && editId !== null) {
        // Update single question
        await axios_instance.put(`learning/games/${editId}/`, formattedQuestions[0]);

        const updated = [...submittedQuestions];
        updated[editIndex] = { ...formattedQuestions[0], id: editId };
        setSubmittedQuestions(updated);
      } else {
        // Create new game/questions batch
        await axios_instance.post("learning/games/", {
          title: "smart_sort",
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

  // Edit existing question from list tab
  const handleEdit = (id) => {
    const index = submittedQuestions.findIndex((q) => q.id === id);
    if (index === -1) return;

    const questionToEdit = submittedQuestions[index];

    setQuestions([{
      question_text: questionToEdit.question_text,
      answer_text: questionToEdit.answer_text,
      options: questionToEdit.options.map(opt => opt.option_text),
      points: questionToEdit.points || 0,
    }]);
    setEditIndex(index);
    setEditId(id);
    setTab("create");
  };

  // Delete question
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
        <div className="pb-10">
          {editIndex !== null && (
            <div className="text-yellow-600 font-medium mb-4">
              Editando pergunta existente
            </div>
          )}

          {questions.map((q, i) => (
            <div key={i}>
              <p className="text-2xl text-start capitalize font-bold text-black my-4">
                <div className="flex justify-between items-center">
                  <span>Pergunta {i + 1}</span>
                  <span className="font-medium mb-2 text-lg">
                    Resposta{" "}
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Resposta"
                      className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-[100%] py-3 2xl:py-4"
                      value={q.answer_text}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                    />
                  </span>
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Pergunta"
                  className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(i, e.target.value)}
                />
              </p>

              <div className="lg:flex grid grid-cols-2 w-full gap-8 p-3">
                {q.options.map((opt, j) => (
                  <input
                    key={j}
                    type="text"
                    autoComplete="off"
                    placeholder="Opção"
                    className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-[30%] py-3 2xl:py-4"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, j, e.target.value)}
                  />
                ))}
              </div>

              {/* New Points Input */}
              <div className="mt-4">
                <label className="font-semibold mr-2">Pontos:</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="text-main-dark/70 border-none outline-none bg-input rounded-lg w-24 py-2 px-3"
                  value={q.points}
                  onChange={(e) => handlePointsChange(i, e.target.value)}
                />
              </div>

              {questions.length > 1 && (
                <button
                  onClick={() => cancelQuestion(i)}
                  className="text-red-500 hover:underline text-sm mt-2"
                >
                  Cancelar pergunta
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-4 mt-4">
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
              className="bg-main-dark rounded-lg text-white px-6 py-3 capitalize"
            >
              {loading ? "Carregando..." : editIndex !== null ? "Salvar edição" : "Criar jogo"}
            </button>
          </div>
        </div>
      )}

      {tab === "list" && (
        <div>
          {submittedQuestions.length === 0 ? (
            <p className="text-center mt-6 text-gray-500">Nenhuma pergunta cadastrada.</p>
          ) : (
            submittedQuestions.map((q, i) => (
              <div
                key={q.id}
                className="border p-3 rounded-lg my-3 bg-white text-black"
              >
                <p className="font-semibold mb-1">{`Pergunta ${i + 1}: ${q.question_text}`}</p>
                <p className="mb-1">{`Resposta: ${q.answer_text}`}</p>
                <p className="mb-1">{`Pontos: ${q.points}`}</p> {/* Show points */}
                <p className="mb-2">Opções:</p>
                <ul className="list-disc list-inside mb-2">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>{opt.option_text}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(q.id)}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </QuestionTabsLayout>
  );
}

export default Game4;
