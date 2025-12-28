import { AiFillEyeInvisible } from "react-icons/ai";
import { BsEyeFill } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { errorNotify, goodNotify } from "../../../helper/ToastLogin";
import axios_instance from "../../utils/axios";

export default function Signup() {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [formData, setFormData] = useState({});
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const siteKey = "6Lf4inwqAAAAAD64ITgkHFsgBPk_qvE52l2_6ltd";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleFromQuery = queryParams.get("role");
    if (roleFromQuery) {
      setFormData((prev) => ({ ...prev, role: roleFromQuery }));
    }
  }, [location]);

  const handleCaptchaChange = (value) => setCaptchaValue(value);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async () => {
    if (!captchaValue) return alert("Por favor, complete o reCAPTCHA");
    if (formData.password !== formData.confirm_password)
      return errorNotify("As senhas não coincidem");

    try {
      const response = await axios_instance.post(
        "api/users/sign-up/",
        formData
      );
      goodNotify(response?.message || "Registro bem-sucedido");
      navigate(`/auth/sign_in?role=${formData.role}`);
    } catch (error) {
      const err = error?.response?.data;
      errorNotify(
        err?.non_field_errors?.[0] ||
          err?.subject_taught?.[0] ||
          "Erro desconhecido"
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left Illustration - Static */}
      <div className="hidden lg:block fixed h-screen w-[25.5%]">
        <div className="relative h-full w-full">
          <img
            src="/teacher/avagwhite.png"
            className="absolute w-28 left-7 bottom-0"
            alt="Avag"
          />
          <img
            src="/teacher/signup.png"
            className="h-full w-full object-cover"
            alt="Signup"
          />
        </div>
      </div>

      {/* Right Form Section - offset to the right */}
      <div className="lg:ml-[25.5%] flex-1 p-4 md:px-12 xl:px-24 2xl:px-32 flex flex-col items-center justify-start pt-10 lg:pt-0 overflow-auto">
        
        <div className="flex mb-5 lg:mb-0 w-full items-center justify-center">
          <h1 className="text-main-dark text-3xl font-semibold 2xl:text-5xl">
            Bem-vindo
          </h1>
          <img src="/teacher/hand.png" className="lg:size-24 size-20" />
        </div>
        <div className="w-[80%] max-w-2xl bg-main-light rounded-xl 2xl:rounded-3xl p-4 md:p-6 flex flex-col gap-4">
          {/* Input: Nome */}
          <label
            htmlFor="first_name"
            className="relative font-medium text-main-dark"
          >
            Nome de Usuário
            <input
              type="text"
              id="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              placeholder="Nome de Usuário"
              required
              className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
            />
          </label>

          {/* Input: Sobrenome */}
          <label htmlFor="last_name" className="font-medium text-main-dark">
            Sobrenome
            <input
              type="text"
              id="last_name"
              value={formData.last_name || ""}
              onChange={handleChange}
              placeholder="Sobrenome"
              className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
              required
            />
          </label>

          {/* Input: Email */}
          <label htmlFor="email" className="font-medium text-main-dark">
            Email
            <input
              type="email"
              id="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
              required
            />
          </label>

          {/* Input: Senha */}
          <label
            htmlFor="password"
            className="relative font-medium text-main-dark"
          >
            Senha
            <input
              type={viewPassword ? "text" : "password"}
              id="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Senha"
              className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
              onClick={() => setViewPassword((prev) => !prev)}
            >
              {viewPassword ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <BsEyeFill size={20} />
              )}
            </span>
          </label>

          {/* Input: Confirmar Senha */}
          <label
            htmlFor="confirm_password"
            className="relative font-medium text-main-dark"
          >
            Confirmar Senha
            <input
              type={viewConfirmPassword ? "text" : "password"}
              id="confirm_password"
              value={formData.confirm_password || ""}
              onChange={handleChange}
              placeholder="Confirmar Senha"
              className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
              onClick={() => setViewConfirmPassword((prev) => !prev)}
            >
              {viewConfirmPassword ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <BsEyeFill size={20} />
              )}
            </span>
          </label>

          {/* Role & Experience */}
          <div className="flex flex-col md:flex-row gap-4">
            <label htmlFor="role" className="font-medium text-main-dark w-full">
              Papel
              <select
                id="role"
                value={formData.role || ""}
                onChange={handleChange}
                className="text-main-dark/70 lg:mt-[10px] mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] 2xl:placeholder:text-base lg:placeholder:text-sm text-sm 2xl:text-base placeholder:text-main-dark/70 border-none active:border-none outline-none bg-input rounded-lg 2xl:rounded-xl w-full py-3 2xl:py-4"
                required
              >
                <option value="">Selecione um papel</option>
                <option value="teacher">Professor</option>
                <option value="student">Estudante</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            {formData.role === "teacher" && (
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
          {formData.role === "teacher" && (
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

          {/* reCAPTCHA */}
          <ReCAPTCHA
            className="g-recaptcha"
            data-size="compact"
            hl="pt-BR"
            sitekey={siteKey}
            onChange={handleCaptchaChange}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-main-dark hover:bg-main-dark/90 w-full rounded-xl text-white font-bold text-lg py-3 mt-2"
          >
            Cadastre-se
          </button>
        </div>

        <p className="text-center mt-3 text-sm">
          Já tem uma conta?{" "}
          <Link
            to={`/auth/sign_in?role=${formData?.role}`}
            className="text-main-dark font-semibold"
          >
            Entre
          </Link>
        </p>
      </div>
    </div>
  );
}
