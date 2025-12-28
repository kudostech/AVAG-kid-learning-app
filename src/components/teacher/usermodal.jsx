import React, { useEffect, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import axios_instance from "../../utils/axios";

import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export default function UserModal({
  open,
  handleOpen,
  requestType = "post",
  userId = null,
  data = null, // pre-filled data for edit
  usertype
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: usertype == 'teacher' ?"teacher" : "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fill form when editing
  useEffect(() => {
    if ((requestType === "put" || requestType === "patch") && data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        password: "",
        confirm_password: "",
      }));
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: usertype == 'teacher' ?"teacher" : "student",
      });
    }
  }, [open, requestType, data]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (formData.password !== formData.confirm_password) {
        alert("Passwords do not match.");
        return;
      }

      const dataToSend = { ...formData };
    console.log(dataToSend)
      let endpoint = 'api/users/sign-up/';
      if ((requestType === "put" || requestType === "patch") && userId !== null) {
        endpoint = `${'api/users/sign-up/'}/${userId}`;
      }

      const response = await axios_instance[requestType](endpoint, dataToSend);
      console.log(`${requestType.toUpperCase()} successful:`, response.data);
      handleOpen(); // Close dialog
    } catch (error) {
      console.error(`Error on ${requestType.toUpperCase()}:`, error);
    }
  };

  const renderPasswordField = (field, label, show, setShow) => (
    <label
      htmlFor={field}
      className="font-medium text-lg text-main-dark capitalize flex-1 relative"
    >
      {label}
      <input
        type={show ? "text" : "password"}
        id={field}
        value={formData[field]}
        onChange={handleChange}
        placeholder={label}
        autoComplete="off"
        className="text-main-dark/70 mt-2 px-3 placeholder:text-sm text-sm border-none outline-none bg-input rounded-lg w-full py-3 pr-10"
      />
      <span
        className="absolute right-3 top-11 cursor-pointer text-gray-600"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <IoEyeOffOutline /> : <IoEyeOutline />}
      </span>
    </label>
  );

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="xs"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="p-3 border-2 border-main-dark overflow-scroll h-[500px]"
    >
      <h1 className="text-2xl font-num font-bold text-main-dark mb-3 text-center">
        {requestType === "post" ? "Adicionar Novo Usuário" : "Atualizar Usuário"}
      </h1>

      <div className="2xl:p-[30px] w-full p-4 lg:p-5 flex flex-col gap-[18px] rounded-xl bg-main-light font-num">
        {/* First & Last Name */}
        <div className="flex gap-4">
          {["first_name", "last_name"].map((field) => (
            <label
              key={field}
              htmlFor={field}
              className="font-medium text-lg text-main-dark capitalize flex-1"
            >
              {field.replace("_", " ")}
              <input
                type="text"
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field.replace("_", " ")}
                autoComplete="off"
                className="text-main-dark/70 mt-2 px-3 placeholder:text-sm text-sm border-none outline-none bg-input rounded-lg w-full py-3"
               required
              />
            </label>
          ))}
        </div>

        {/* Email */}
        <label htmlFor="email" className="font-medium text-lg text-main-dark capitalize">
          Email
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="off"
            className="text-main-dark/70 mt-2 px-3 placeholder:text-sm text-sm border-none outline-none bg-input rounded-lg w-full py-3"
            required
          />
        </label>

        {/* Password & Confirm Password with toggle */}
        <div className="flex gap-4">
          {renderPasswordField("password", "Senha", showPassword, setShowPassword)}
          {renderPasswordField("confirm_password", "Confirmar Senha", showConfirm, setShowConfirm)}
        </div>

{/* Role & Experience */}
          <div className="flex flex-col md:flex-row gap-4">

            {usertype === "teacher" && (
              <label
                htmlFor="experience_years"
                className="font-medium text-lg text-main-dark"
              >
                Anos de Experiência
                <input
                  type="number"
                  id="experience_years"
                  min={0}
                  value={formData.experience_years || ""}
                  onChange={handleChange}
                  placeholder="Anos de Experiência"
                  className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
                  required
                />
              </label>
            )}
          </div>

          {/* Subject Taught */}
          {usertype === "teacher" && (
            <label
              htmlFor="subject_taught"
              className="relative font-medium text-main-dark"
            >
              Matéria
              <input
                type="text"
                id="subject_taught"
                value={formData.subject_taught || ""}
                onChange={handleChange}
                placeholder="Matéria"
                className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
                required
              />
            </label>
          )}

        {/* Submit Button */}
        <button
          className="bg-main-dark w-full rounded-xl text-white font-bold text-xl mt-2 2xl:text-2xl py-3"
          onClick={handleSubmit}
        >
          {requestType === "post"
            ? "Adicionar"
            : requestType === "put"
            ? "Update"
            : "Update"}
        </button>
      </div>
    </Dialog>
  );
}
