import { useState, useEffect } from "react";
import { AiFillEyeInvisible, AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsEyeFill } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { sucessNotify, errorNotify } from "../../../helper/ToastLogin";
import ReCAPTCHA from "react-google-recaptcha";
import axios_instance from "../../utils/axios";

export default function SignIn() {
  const [captchaValue, setCaptchaValue] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState();

  const siteKey = "6Lf4inwqAAAAAD64ITgkHFsgBPk_qvE52l2_6ltd";
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleFromQuery = queryParams.get("role");
    if (roleFromQuery) setRole(roleFromQuery);
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => setViewPassword((prev) => !prev);

  const handleCaptchaChange = (value) => setCaptchaValue(value);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("CAPTCHA not completed");
      return;
    }

    setLoading(true);

    axios_instance
      .post("api/users/login/", { ...credentials, role })
      .then(({ data }) => {
        const { access, user: loggedInUser } = data;
        localStorage.setItem("USER_TOKEN", access);
        localStorage.setItem("USER_ROLE", loggedInUser.role);
        localStorage.setItem("USER_PROFILE", JSON.stringify(loggedInUser));
        sucessNotify();

        switch (loggedInUser.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "teacher":
            navigate("/teacher/dashboard");
            break;
          case "student":
            navigate("/student/dashboard");
            break;
          default:
            navigate("/");
        }
      })
      .catch((error) => {
        const fallbackMessage = "Erro desconhecido";
        console.error("Login error:", error);
        const errorMessage =
          error?.response?.data?.non_field_errors?.[0] ||
          error?.response?.data?.detail ||
          fallbackMessage;
        errorNotify(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <div className="hidden lg:block fixed h-screen w-[25.5%]">
        <img
          src="/teacher/avagwhite.png"
          className="absolute w-28 left-7 bottom-0"
        />
        <img src="/teacher/signin.png" className="h-full w-full object-cover" />
      </div>

      <div className="lg:ml-[25.5%] flex-1 p-4 md:px-12 xl:px-24 2xl:px-32 flex flex-col items-center justify-start pt-10 lg:pt-0 overflow-auto">
        <div className="flex mb-5 lg:mb-0 w-full items-center justify-center">
          <h1 className="text-main-dark text-3xl font-semibold 2xl:text-5xl">
            Bem-vindo de volta
          </h1>
          <img src="/teacher/hand.png" className="lg:size-24 size-20" />
        </div>

        <form
          onSubmit={handleLogin}
          className="w-[80%] max-w-2xl bg-main-light rounded-xl 2xl:rounded-3xl p-4 md:p-6 flex flex-col gap-4"
        >
          <label htmlFor="email" className="font-medium text-lg text-main-dark">
            Email
            <input
              type="email"
              autoComplete="off"
              placeholder="Email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="text-main-dark/70 mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] placeholder:text-main-dark/70 outline-none bg-input rounded-lg w-full py-3"
              id="email"
              required
            />
          </label>

          <label
            htmlFor="password"
            className="relative font-medium text-lg text-main-dark"
          >
            Senha
            <input
              name="password"
              value={credentials.password}
              onChange={handleChange}
              type={viewPassword ? "text" : "password"}
              autoComplete="off"
              placeholder="Senha"
              className="text-main-dark/70 mt-[7px] 2xl:px-[18px] lg:px-[10px] px-[7px] placeholder:text-main-dark/70 outline-none bg-input rounded-lg w-full py-3"
              id="password"
              required
            />
            <p
              className="top-[60%] right-3 absolute cursor-pointer"
              onClick={togglePassword}
              aria-label="Toggle password visibility"
            >
              {viewPassword ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <BsEyeFill size={20} />
              )}
            </p>
          </label>

          <p
            onClick={() => navigate("/auth/forgot-password")}
            className="text-main-dark/70 text-sm cursor-pointer"
          >
            Forgot Password?
          </p>

          <ReCAPTCHA
            hl="pt-BR"
            sitekey={siteKey}
            onChange={handleCaptchaChange}
            theme="light"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-main-dark w-full cursor-pointer rounded-xl text-white font-bold text-xl mt-2 py-3 flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

          <div className="flex flex-col gap-2 items-center">
            <p className="text-main-dark/70 text-sm">
              Not registered yet?
              <span
                onClick={() => navigate(`/auth/sign_up?role=${role}`)}
                className="text-main-dark cursor-pointer font-semibold ml-2"
              >
                Create an account
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
