import React, { useState, useEffect } from "react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BsEyeFill } from "react-icons/bs";
import Avatar from '@mui/material/Avatar';

import { errorNotify, goodNotify } from "../../../helper/ToastLogin";
import axios_instance from "../../utils/axios";
import { getUserProfile } from "../../utils/auth";

function StudentProfile() {
  const [viewPassword, setViewPassword] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [profile, setProfile] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const togglePassword = () => {
    setViewPassword((prev) => !prev);
  };


  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
    setCredentials({
      phone_number: userProfile.phone_number || "",
      email: userProfile.email || "",
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
    });
    setAvatarPreview(userProfile.avatar || null);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials({ ...credentials, [id]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await axios_instance.put("users/profile/avatar/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      goodNotify("Avatar atualizado com sucesso");
      if (response.data.avatar) {
        setProfile((prev) => ({ ...prev, avatar: response.data.avatar }));
      }
      setAvatarFile(null);
    } catch (error) {
      errorNotify("Falha ao enviar o avatar");
    }
  };

  const handleSubmit = async () => {
    if (credentials.password && credentials.password !== credentials.confirm_password) {
      return errorNotify("As senhas não coincidem");
    }

    try {
      await axios_instance.put("users/profile/", credentials);
      goodNotify("Perfil atualizado com sucesso");
      if (avatarFile) {
        await uploadAvatar();
      }
    } catch (error) {
      errorNotify(error?.message || "Erro desconhecido");
    }
  };

  const initials =
    profile.first_name && profile.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : "?";

  return (
    <div className="pr-5 px-3 pt-3">
      <p className="font-bold text-[22px] text-black">Gerenciamento de Perfil</p>
      <div className="flex justify-between items-start bg-main-light p-5 rounded-xl">
        <div className="flex lg:flex-row flex-col gap-3 justify-center items-center">
          {avatarPreview ? (
            <Avatar
              src={avatarPreview}
              alt={`${profile.first_name} ${profile.last_name}`}
              size="lg"
              variant="circular"
              className="mb-5"
              sx={{ width: 100, height: 100 }}
            />
          ) : (
            <Avatar size="lg" variant="circular" className="mb-5" sx={{ width: 100, height: 100 }}>
              {initials}
            </Avatar>
          )}
          <div className="flex flex-col lg:items-start items-center gap-1">
            <p className="font-medium text-lg">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="text-black/50">{profile.email}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer p-[10px] rounded-xl text-sm text-white bg-main-dark"
          >
            Upload Avatar
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

        </div>
      </div>

      <div className="grid px-3 lg:grid-cols-2 mt-4 gap-5">
        <label htmlFor="first_name" className="font-medium text-sm text-black">
          Nome
          <input
            type="text"
            autoComplete="off"
            placeholder="Alexa"
            className="text-black/50 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-black/50 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
            id="first_name"
            value={credentials?.first_name || ""}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="last_name" className="font-medium text-sm text-black">
          Sobrenome
          <input
            type="text"
            autoComplete="off"
            placeholder="Alexa"
            className="text-black/50 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-black/50 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
            id="last_name"
            value={credentials?.last_name || ""}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="email" className="font-medium text-sm text-black">
          E-mail
          <input
            type="email"
            autoComplete="on"
            placeholder="Alexa@gmail.com"
            className="text-black/50 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-black/50 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
            id="email"
            value={credentials?.email || ""}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="phone_number" className="font-medium text-sm text-black">
          Número (Opcional)
          <input
            type="text"
            autoComplete="on"
            placeholder="(11) 99999-9999"
            className="text-black/50 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-black/50 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
            id="phone_number"
            value={credentials?.phone_number || ""}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="password" className="relative font-medium text-sm text-black">
          Senha
          <input
            type={viewPassword ? "text" : "password"}
            autoComplete="off"
            placeholder=".........."
            className="text-main-black/50 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-black/50 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
            id="password"
            value={credentials?.password || ""}
            onChange={handleChange}
          />
          <p
            className="top-[60%] right-3 text-black/50 absolute cursor-pointer"
            onClick={togglePassword}
          >
            {!viewPassword ? <BsEyeFill size={18} /> : <AiFillEyeInvisible size={18} />}
          </p>
        </label>

        <label htmlFor="confirm_password" className="relative font-medium text-sm text-black">
          Confirmar Senha
          <input
            type={viewPassword ? "text" : "password"}
            autoComplete="off"
            placeholder=".........."
            className="text-main-black/50 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-black/50 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
            id="confirm_password"
            value={credentials?.confirm_password || ""}
            onChange={handleChange}
          />
          <p
            className="top-[60%] right-3 text-black/50 absolute cursor-pointer"
            onClick={togglePassword}
          >
            {!viewPassword ? <BsEyeFill size={18} /> : <AiFillEyeInvisible size={18} />}
          </p>
        </label>
      </div>

      <div className="flex w-full justify-end mt-5" onClick={handleSubmit}>
        <p className="flex w-fit cursor-pointer p-[10px] items-center rounded-xl text-sm gap-2 text-white bg-main-dark">
          Salvar
        </p>
      </div>
    </div>
  );
}

export default StudentProfile;
