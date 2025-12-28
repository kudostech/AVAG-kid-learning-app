// components/QuestionTabsLayout.jsx
import React from "react";

function QuestionTabsLayout({ activeTab, onTabChange, children }) {
  return (
    <div className="pb-10">
      {/* Tab Switcher */}
      <div className="flex gap-4 p-2 mb-5">
        <button
          onClick={() => onTabChange("create")}
          className={`px-5 py-2 rounded-full ${activeTab === "create" ? "bg-main-dark text-white" : "bg-gray-200 text-black"}`}
        >
          Criar Questões
        </button>
        <button
          onClick={() => onTabChange("list")}
          className={`px-5 py-2 rounded-full ${activeTab === "list" ? "bg-main-dark text-white" : "bg-gray-200 text-black"}`}
        >
          Questões Criadas
        </button>
      </div>

      {/* Rendered Content */}
      <div>
        {children}
      </div>
    </div>
  );
}

export default QuestionTabsLayout;
