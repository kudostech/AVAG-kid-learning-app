import React, { useState, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import axios_instance from "../../utils/axios";

function CreateKnowledge({ data = {}, onSave, onClose }) {
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    description: "",
    notes: "",
    thumbnail: null,
    video_file: null,
    pdf_file: null,
    recommended: false, // added
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await axios_instance.get("learning/subjects");
        setSubjects(res.data);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    }
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        subject: data.subject || "",
        title: data.title || "",
        description: data.description || "",
        notes: data.notes || "",
        thumbnail: null,
        video_file: null,
        pdf_file: null,
        recommended: data.recommended || false, // added
      });
      setThumbnailPreview(null);
      setVideoPreview(null);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [thumbnailPreview, videoPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
    }));
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      video_file: file,
    }));
    setVideoPreview(URL.createObjectURL(file));
  };

  const handlePDFChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      pdf_file: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = new FormData();

      if (data.id) sendData.append("id", data.id);

      sendData.append("subject", formData.subject);
      sendData.append("title", formData.title);
      sendData.append("description", formData.description);
      sendData.append("notes", formData.notes);
      sendData.append("recommended", formData.recommended); // added

      if (formData.thumbnail instanceof File) {
        sendData.append("thumbnail", formData.thumbnail);
      }

      if (formData.video_file instanceof File) {
        sendData.append("video_file", formData.video_file);
      }

      if (formData.pdf_file instanceof File) {
        sendData.append("pdf_file", formData.pdf_file);
      }

      await onSave(sendData);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 pr-10" encType="multipart/form-data">
      <div className="flex justify-between py-5">
        <p className="font-bold mb-2 text-[22px] text-black">
          {data.id ? "Editar Conhecimento" : "Criar Novo"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-black py-2 px-6 rounded-2xl"
        >
          Cancelar
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* Subject select */}
        <label htmlFor="subject" className="font-medium text-base text-black">
          Assunto
          <select
            name="subject"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="text-[#545454] mt-2 bg-input rounded-lg w-full py-3 px-3"
          >
            <option value="">Selecione um assunto</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>

        {/* Title input */}
        <label htmlFor="title" className="font-medium text-base text-black">
          Cabeçalho
          <input
            type="text"
            name="title"
            id="title"
            autoComplete="off"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            className="text-[#545454] mt-2 bg-input rounded-lg w-full py-3 px-3"
            required
          />
        </label>

        {/* Description textarea */}
        <label htmlFor="description" className="font-medium text-base text-black">
          Descrição
          <textarea
            name="description"
            id="description"
            rows={6}
            placeholder="Descrição"
            value={formData.description}
            onChange={handleChange}
            className="text-[#545454] mt-2 bg-input rounded-lg w-full py-3 px-3"
            required
            style={{ resize: "none" }}
          />
        </label>

        {/* Recommended toggle */}
        <label className="flex items-center gap-3 text-black font-medium">
          <input
            type="checkbox"
            name="recommended"
            checked={formData.recommended}
            onChange={handleCheckboxChange}
            className="accent-main-dark w-5 h-5"
          />
          Marcar como Recomendado
        </label>

        {/* Thumbnail upload */}
        <div>
          <header className="font-semibold text-black">Thumbnail</header>
          <div className="flex flex-col items-center justify-center gap-4 bg-input py-6 mt-2 rounded-xl text-main-dark w-full">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full max-w-xs rounded-lg object-cover"
              />
            )}
            <label
              htmlFor="thumbnail-upload"
              className="flex cursor-pointer p-[8px] items-center rounded-2xl bg-main-dark text-white w-fit"
            >
              <MdOutlineFileUpload size={24} className="mr-2" />
              {formData.thumbnail ? formData.thumbnail.name : "Upload Thumbnail"}
            </label>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              style={{ display: "none" }}
              required={!data.id}
            />
          </div>
        </div>

        {/* Video upload */}
        <div>
          <header className="font-semibold text-black">Vídeo</header>
          <div className="flex flex-col items-center justify-center gap-4 bg-input py-6 mt-2 rounded-xl text-main-dark w-full">
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="w-full max-w-xs rounded-lg"
              />
            )}
            <label
              htmlFor="video-upload"
              className="flex cursor-pointer p-[8px] items-center rounded-2xl bg-main-dark text-white w-fit"
            >
              <MdOutlineFileUpload size={24} className="mr-2" />
              {formData.video_file ? formData.video_file.name : "Upload Vídeo"}
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* PDF upload */}
        <div className="relative">
          <header className="font-semibold text-black">PDF</header>
          <div className="flex flex-col items-center justify-center gap-4 bg-input py-6 mt-2 rounded-xl text-main-dark w-full">
            {formData.pdf_file && (
              <p className="text-sm text-center">{formData.pdf_file.name}</p>
            )}
            <label
              htmlFor="pdf_file"
              className="flex cursor-pointer p-[8px] items-center rounded-2xl bg-main-dark text-white w-fit"
            >
              <MdOutlineFileUpload size={24} className="mr-2" />
              {formData.pdf_file ? "Trocar PDF" : "Upload PDF"}
            </label>
            <input
              id="pdf_file"
              type="file"
              accept="application/pdf"
              onChange={handlePDFChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="rounded-full size-14 bg-main-light p-2 absolute -right-2 -top-2 z-10 flex items-center justify-center">
            pdf
          </div>
        </div>

        {/* Notes textarea */}
        <label htmlFor="notes" className="font-medium text-base text-black">
          Notas
          <textarea
            name="notes"
            id="notes"
            rows={10}
            placeholder="Notas"
            value={formData.notes}
            onChange={handleChange}
            className="text-[#545454] mt-2 bg-input rounded-lg w-full py-3 px-3 mb-5"
            required
            style={{ resize: "none" }}
          />
        </label>

        {/* Submit button */}
        <div className="flex">
          <button type="submit" className="bg-main-dark text-white py-2 px-10 rounded-2xl">
            {data.id ? "Salvar" : "Criar"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CreateKnowledge;
