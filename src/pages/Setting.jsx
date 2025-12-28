import React, { useState, useEffect } from "react";
import { 
  FaHome, 
  FaBell, 
  FaPlus, 
  FaCog, 
  FaUser, 
  FaUsers, 
  FaGraduationCap, 
  FaChalkboardTeacher,
  FaVolumeUp,
  FaUserCircle,
  FaPalette,
  FaTimes,
  FaCheck,
  FaPaperPlane
} from "react-icons/fa";
import { getUserProfile } from "../utils/auth";

import axios_instance from "../utils/axios";

function Setting() {
  const profile = getUserProfile();
  const role = profile?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  // Define tab access based on roles
  const getDefaultTab = () => {
    if (isTeacher) return "add-notification"; // Teachers start with add notification
    if (isStudent) return "notifications"; // Students start with notifications
    if (isAdmin) return "add-notification"; // Admins start with add notification
    return "settings"; // Fallback
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  const [desp, setDesp] = useState("");
  const [title, setTitle] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [sendNotifyModal, setSendNotifyModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    activityAlerts: true,
    reminderSettings: false,
    voiceNarration: false
  });

  const apifuntion = async () => {
    setIsLoading(true);
    try {
      const payload = {
        title,
        message: desp,
        recipient: selectedRecipient,
      };

      await axios_instance.post("api/notifications/", payload);
      resetValues();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      alert("Falha ao enviar a notificação. Tente novamente.");
    } finally {
      setSendNotifyModal(false);
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!desp || !title) {
      return alert("Todos os campos são obrigatórios");
    }
    if (isTeacher) {
      // Teachers can send directly to students
      setSelectedRecipient("student");
      apifuntion();
    } else if (isAdmin) {
      // Admins choose recipient
      setSendNotifyModal(true);
    }
  };

  const handlePublish = async () => {
    if (!selectedRecipient) {
      return alert("Por favor, selecione um usuário para publicar");
    }
    apifuntion();
  };

  useEffect(() => {
    if (activeTab === "notifications") {
      setIsLoading(true);
      axios_instance
        .get("api/notifications")
        .then((res) => {
          setNotifications(res.data);
        })
        .catch((err) => {
          console.error("Failed to load notifications", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [activeTab]);

  const resetValues = () => {
    setDesp("");
    setTitle("");
    setSelectedRecipient("");
    setSendNotifyModal(false);
  };

  const handleSettingToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleMessageClick = async (message, index) => {
    setSelectedMessage({ ...message, index });
    setShowMessageDetail(true);
    try {
      await axios_instance.post(`api/notifications/${message.id}/mark-as-read/`);
      resetValues();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // console.error("Erro ao enviar notificação:", error);
    } finally {
      setSendNotifyModal(false);
      setIsLoading(false);
    }
  };

  const closeMessageDetail = () => {
    setSelectedMessage(null);
    setShowMessageDetail(false);
  };

  // Define tabs based on user role
  const getTabs = () => {
    const tabs = [];

    // Teachers get all three tabs
    if (isTeacher) {
      tabs.push(
        {
          id: "add-notification",
          label: "Adicionar Notificação",
          icon: FaPlus
        },
        {
          id: "notifications",
          label: "Notificações",
          icon: FaBell
        },
        {
          id: "settings",
          label: "Configurações",
          icon: FaCog
        }
      );
    }
    // Students get notifications and settings
    else if (isStudent) {
      tabs.push(
        {
          id: "notifications",
          label: "Notificações",
          icon: FaBell
        },
        {
          id: "settings",
          label: "Configurações",
          icon: FaCog
        }
      );
    }
    // Admins get add notification and settings
    else if (isAdmin) {
      tabs.push(
        {
          id: "add-notification",
          label: "Adicionar Notificação",
          icon: FaPlus
        },
        {
          id: "settings",
          label: "Configurações",
          icon: FaCog
        }
      );
    }

    return tabs;
  };

  const tabs = getTabs();

  return (
    <div className="flex h-full overflow-x-hidden bg-gray-50 cursor-pointer flex-col py-6 px-4 gap-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <FaCheck className="text-white" />
          Notificação enviada com sucesso!
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Configurações</h1>
        <p className="text-gray-600">
          {isTeacher && "Gerencie notificações e configurações como professor"}
          {isStudent && "Visualize notificações e ajuste suas configurações"}
          {isAdmin && "Administre notificações do sistema"}
        </p>
        <div className="mt-2">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            isTeacher ? 'bg-blue-100 text-blue-800' :
            isStudent ? 'bg-green-100 text-green-800' :
            isAdmin ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {role?.charAt(0).toUpperCase() + role?.slice(1)}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-3 text-center text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "border-b-3 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon className="text-lg" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white rounded-b-xl shadow-sm">
        {activeTab === "add-notification" && (isTeacher || isAdmin) && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaPlus className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Nova Notificação</h2>
                  <p className="text-gray-600">
                    {isTeacher && "Envie notificações para seus estudantes"}
                    {isAdmin && "Crie e envie notificações para usuários do sistema"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título da Notificação
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título da notificação"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem da Notificação
                  </label>
                  <textarea
                    rows={6}
                    value={desp}
                    onChange={(e) => setDesp(e.target.value)}
                    placeholder="Digite os detalhes da notificação"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 resize-none"
                  />
                </div>

                {isTeacher && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <FaGraduationCap className="text-lg" />
                      <span className="font-medium">Esta notificação será enviada para todos os seus estudantes</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      {isTeacher ? "Enviar para Estudantes" : "Publicar Notificação"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (isTeacher || isStudent) && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaBell className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Notificações</h2>
                <p className="text-gray-600">
                  {isTeacher && "Visualize todas as notificações do sistema"}
                  {isStudent && "Suas notificações e avisos importantes"}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((data, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleMessageClick(data, index)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-full flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <FaBell className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                              {data.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed line-clamp-2">
                              {data.message.length > 100 ? `${data.message.substring(0, 100)}...` : data.message}
                            </p>
                          </div>
                          <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-blue-500 text-sm font-medium flex items-center gap-1">
                              Ver detalhes
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Notificação #{index + 1}
                          </div>
                          <div className="text-xs text-gray-400">
                            Clique para ver detalhes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaBell className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaCog className="text-purple-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Configurações</h2>
                <p className="text-gray-600">Personalize sua experiência no sistema</p>
              </div>
            </div>

            <div className="space-y-6">
              {(isStudent || isTeacher) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaUser className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Configurações de Perfil</h3>
                      <p className="text-gray-600">Gerencie informações do perfil</p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-16">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaUserCircle className="text-blue-500" />
                      <span>{isStudent ? "Perfil do Estudante" : "Perfil do Professor"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPalette className="text-blue-500" />
                      <span>Seleção de Avatar</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <FaBell className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Notificações e Alertas</h3>
                    <p className="text-gray-600">Configure suas preferências de notificação</p>
                  </div>
                </div>
                <div className="space-y-4 ml-16">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="text-gray-700 font-medium">Alertas de Atividade</span>
                    <button
                      onClick={() => handleSettingToggle('activityAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.activityAlerts ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.activityAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="text-gray-700 font-medium">Configurações de Lembrete</span>
                    <button
                      onClick={() => handleSettingToggle('reminderSettings')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.reminderSettings ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.reminderSettings ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <FaVolumeUp className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Controles de Som e Músicas</h3>
                    <p className="text-gray-600">Ajuste as configurações de áudio</p>
                  </div>
                </div>
                <div className="ml-16">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="text-gray-700 font-medium">Narração por Voz</span>
                    <button
                      onClick={() => handleSettingToggle('voiceNarration')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.voiceNarration ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.voiceNarration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showMessageDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden transform transition-all duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-full">
                    <FaBell className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Detalhes da Notificação</h2>
                    <p className="text-blue-100 text-sm">Notificação #{selectedMessage.index + 1}</p>
                  </div>
                </div>
                <button
                  onClick={closeMessageDetail}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <FaTimes className="text-white text-lg" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Title Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Título
                  </label>
                  <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                    {selectedMessage.title}
                  </h3>
                </div>

                {/* Message Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Mensagem
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Data de criação:  {new Date(selectedMessage.created_at).toLocaleString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})}
                </div>
                <button
                  onClick={closeMessageDetail}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipient Selection Modal - Only for Admins */}
      {sendNotifyModal && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Selecionar Destinatário</h2>
              <button
                onClick={() => setSendNotifyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div
                onClick={() => setSelectedRecipient("teacher")}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRecipient === "teacher"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaChalkboardTeacher className="text-xl text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Professor</div>
                    <div className="text-sm text-gray-600">
                      A notificação será enviada apenas para professores
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedRecipient("student")}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRecipient === "student"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-xl text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Estudante</div>
                    <div className="text-sm text-gray-600">
                      A notificação será enviada apenas para estudantes
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSelectedRecipient("both")}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRecipient === "both"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaUsers className="text-xl text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Ambos</div>
                    <div className="text-sm text-gray-600">
                      A notificação será enviada para professores e estudantes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setSendNotifyModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={!selectedRecipient || isLoading}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Publicar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Home Button */}
      <button className="lg:hidden fixed bottom-6 left-6 p-4 bg-white text-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
        <FaHome className="text-xl" />
      </button>
    </div>
  );
}

export default Setting;