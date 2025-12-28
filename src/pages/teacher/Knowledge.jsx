import React, { useState, useEffect } from "react";
import CreateKnowledge from "./CreateKnowledge";
import axios_instance from "../../utils/axios";
import KnowledgeCardList from "../../components/teacher/KnowledgeCardList";

function Knowledge() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [courseDataB, setCourseDataB] = useState([]);

  const handleCreate = () => setSelectedItem({});


  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  const handleCloseForm = () => {
    setSelectedItem(null);
  };

 const handleDelete = async (id, type) => {
  try {
    // Send DELETE request to backend
    await axios_instance.delete(`learning/knowledge-trail/${id}/`);

    // Update frontend state based on type
    if (type === "A") {
      setCourseData((prev = []) => prev.filter((item) => item.id !== id));
    } else {
      setCourseDataB((prev = []) => prev.filter((item) => item.id !== id));
    }
  } catch (error) {
    console.error("Failed to delete item:", error);
  }
};

  const handleSave = async (formData) => {
  try {
    const isEdit = formData.has("id");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = isEdit
      ? await axios_instance.put(
          `learning/knowledge-trail/${formData.get("id")}/`,
          formData,
          config
        )
      : await axios_instance.post("learning/knowledge-trail/", formData, config);

    const savedItem = response.data;

    // Update courseData
    setCourseData((prev = []) => {
      const exists = prev.some((item) => item.id === savedItem.id);
      return exists
        ? prev.map((item) => (item.id === savedItem.id ? savedItem : item))
        : [savedItem, ...prev];
    });

    // Update recommended list if needed
    if (savedItem.recommended) {
      setCourseDataB((prev = []) => {
        const exists = prev.some((item) => item.id === savedItem.id);
        return exists
          ? prev.map((item) => (item.id === savedItem.id ? savedItem : item))
          : [savedItem, ...prev];
      });
    }

    setSelectedItem(null);
  } catch (error) {
    console.error("Error saving item:", error.response || error);
  }
};


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios_instance.get("learning/knowledge-trail/");
        const results = response.data || [];
        setCourseData(results);
        setCourseDataB(results.filter((row) => row.recommended === true));

      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <>
      {selectedItem ? (
        <CreateKnowledge
          data={selectedItem}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      ) : (
        <div className="flex overflow-hidden pt-5 flex-col p-3 gap-2">
          <div className="flex justify-between p-2 items-center text-white">
            <p className="font-bold text-[18px] lg:text-[22px] text-black">
              Trilha de Conhecimento
            </p>
            <p
              onClick={handleCreate}
              className="flex cursor-pointer p-[10px] items-center rounded-2xl gap-2 bg-main-dark"
            >
              Criar Novo
            </p>
          </div>

          <KnowledgeCardList
            data={courseData}
            toogleEdit={(id) => {
              const item = courseData.find((item) => item.id === id);
              handleEdit(item);
            }}
            handleDelete={(id) => handleDelete(id, "A")}
            CreateKnow={handleCreate}
            emptyMessage="Nenhuma trilha de conhecimento disponível ainda."
          />

          <KnowledgeCardList
            data={courseDataB}
            offset={10}
            identifier={selectedItem?.id}
            toogleEdit={(id) => {
              const item = courseDataB.find((item) => item.id === id);
              handleEdit(item);
            }}
            handleDelete={(id) => handleDelete(id, "B")}
            CreateKnow={handleCreate}
            title="Trilha de Conhecimento Importante"
            emptyMessage="Nenhuma trilha importante marcada."
          />
        </div>
      )}
    </>
  );
}

export default Knowledge;
