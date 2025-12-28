import React, { useEffect, useState } from "react";
import QuestionTabsLayout from "../components/QuestionTabsLayout";
import axios_instance from "../utils/axios";

function Game5() {
  function getDefaultQuestion() {
    return {
      question_text: "",
      question_type: "find_and_count",
      points: 0,
      correct_answer: "",
      options: Array(16).fill(""),
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
      const data = res.data?.find((g) => g.title === "find_and_count")?.questions || [];

      const formatted = data.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        correct_answer: q.correct_answer,
        options: q.options.map(opt => opt.option_text),
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

  const handleInputChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
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
      if (!q.correct_answer.trim()) {
        alert(`Pergunta ${i + 1} precisa de uma resposta correta.`);
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
      correct_answer: q.correct_answer.trim(),
      options: q.options.map((text, i) => ({
        id: i + 1,
        option_text: text.trim(),
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
          title: "find_and_count",
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

    const q = submittedQuestions[index];
    setQuestions([{
      question_text: q.question_text,
      question_type: q.question_type,
      points: q.points,
      correct_answer: q.correct_answer,
      options: q.options,
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
            <div key={i} className="mb-8 border-b border-gray-300 pb-4">
              <p className="text-2xl font-bold text-black">Pergunta {i + 1}</p>
              <input
                type="text"
                placeholder="Texto da pergunta"
                value={q.question_text}
                onChange={(e) => handleInputChange(i, "question_text", e.target.value)}
                className="w-full p-3 bg-input rounded-lg outline-none text-main-dark/70 mt-2"
              />
              <input
                type="number"
                placeholder="Pontos"
                value={q.points}
                onChange={(e) => handleInputChange(i, "points", parseInt(e.target.value, 10) || 0)}
                className="mt-2 w-32 p-3 bg-input rounded-lg outline-none text-sm text-black"
                min={1}
              />
              <div className="mt-4">
                <label className="block font-medium text-sm mb-2">Resposta correta:</label>
                <input
                  type="text"
                  placeholder="Resposta correta"
                  value={q.correct_answer}
                  onChange={(e) => handleInputChange(i, "correct_answer", e.target.value)}
                  className="w-1/2 p-3 bg-input rounded-lg outline-none text-main-dark/70"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                {q.options.map((opt, j) => (
                  <textarea
                    key={j}
                    rows={1}
                    placeholder="Opção"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, j, e.target.value)}
                    className="w-full p-2 bg-main-light text-main-dark rounded-lg resize-none"
                  />
                ))}
              </div>

              {questions.length > 1 && (
                <button
                  onClick={() => cancelQuestion(i)}
                  className="text-red-500 hover:underline text-sm mt-2"
                >
                  Cancelar
                </button>
              )}
            </div>
          ))}

          {editIndex === null && (
            <button
              onClick={addQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
            >
              + Adicionar pergunta
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-main-dark text-white px-6 py-2 rounded-lg mt-4"
          >
            {editIndex !== null ? "Atualizar pergunta" : "Criar jogo"}
          </button>
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
                    <li key={j}>{opt}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-gray-700">Resposta correta: {q.correct_answer}</p>
                <p className="text-sm text-gray-700">Pontos: {q.points}</p>
              </div>
            ))
          )}
        </div>
      )}
    </QuestionTabsLayout>
  );
}

export default Game5;
