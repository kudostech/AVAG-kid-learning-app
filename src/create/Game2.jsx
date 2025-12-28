import React, { useEffect, useState } from "react";
import axios_instance from "../utils/axios";
import QuestionTabsLayout from "../components/QuestionTabsLayout";

function Game2() {
  const [tab, setTab] = useState("create");
  const [questions, setQuestions] = useState([getDefaultQuestion()]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  function getDefaultQuestion() {
    return {
      id: null,
      question_text: "",
      question_type: "fill_in_the_blank",
      points: 0,
      correct_answer: "",
    };
  }

  useEffect(() => {
    if (tab === "list") {
      fetchQuestions();
    }
  }, [tab]);

  const fetchQuestions = async () => {
    try {
      const res = await axios_instance.get("learning/games/");
      const fetched = res.data?.find((g) => g.title === "fill_in_the_blank")?.questions || [];
      const formatted = fetched.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        correct_answer: q.correct_answer || "",
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
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = field === "points" ? parseInt(value, 10) || 0 : value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) return alert(`Pergunta ${i + 1} precisa ter texto.`);
      if (!Number.isInteger(q.points) || q.points <= 0)
        return alert(`Pergunta ${i + 1} precisa ter pontos válidos.`);
      if (!q.correct_answer.trim()) return alert(`Pergunta ${i + 1} precisa de uma resposta correta.`);
    }

    const formattedQuestions = questions.map((q) => ({
      question_text: q.question_text.trim(),
      question_type: q.question_type,
      points: q.points,
      correct_answer: q.correct_answer.trim(),
    }));

    try {
      if (editIndex !== null) {
        // Update one question via PATCH
        const questionId = submittedQuestions[editIndex].id;
        await axios_instance.patch(`learning/questions/${questionId}/`, formattedQuestions[0]);

        const updatedList = [...submittedQuestions];
        updatedList[editIndex] = { ...formattedQuestions[0], id: questionId };
        setSubmittedQuestions(updatedList);
      } else {
        // Create new game with questions
        await axios_instance.post("learning/games/", {
          title: "fill_in_the_blank",
          questions: formattedQuestions,
        });
        setSubmittedQuestions([...submittedQuestions, ...formattedQuestions]);
      }

      setQuestions([getDefaultQuestion()]);
      setEditIndex(null);
      setTab("list");
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error);
    }
  };

  const handleEdit = (index) => {
    setQuestions([{ ...submittedQuestions[index] }]);
    setEditIndex(index);
    setTab("create");
  };

  const handleDelete = async (id) => {
    try {
      await axios_instance.delete(`learning/questions/${id}/`);
      setSubmittedQuestions(submittedQuestions.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Erro ao deletar pergunta:", error);
    }
  };

  return (
    <QuestionTabsLayout activeTab={tab} onTabChange={setTab}>
      {tab === "create" && (
        <>
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
                onChange={(e) => handleChange(i, "question_text", e.target.value)}
                className="w-full p-3 bg-input rounded-lg outline-none text-main-dark/70"
              />
              <input
                type="number"
                placeholder="Pontos"
                min={1}
                value={q.points}
                onChange={(e) => handleChange(i, "points", e.target.value)}
                className="mt-2 w-32 p-3 bg-input rounded-lg outline-none text-sm text-black"
              />
              <textarea
                placeholder="Resposta correta"
                value={q.correct_answer}
                onChange={(e) => handleChange(i, "correct_answer", e.target.value)}
                className="w-full mt-4 p-3 bg-input rounded-lg outline-none text-main-dark/70"
                rows={3}
              />
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
              <div key={q.id || i} className="bg-main-light p-4 rounded-lg text-main-dark">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">
                    {i + 1}. {q.question_text}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(i)}
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
                <p className="mt-2 text-sm text-gray-700">Resposta correta: {q.correct_answer}</p>
                <p className="mt-2 text-sm text-gray-700">Pontos: {q.points}</p>
              </div>
            ))
          )}
        </div>
      )}
    </QuestionTabsLayout>
  );
}

export default Game2;
