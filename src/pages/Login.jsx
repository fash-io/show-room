import { useState } from "react";
import { login, signup } from "../utils/firebase";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [signState, setSignState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [c_password, setC_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleC_passwordChange = (e) => setC_password(e.target.value);

  const handleSignState = () => {
    setSignState((prevState) =>
      prevState === "Sign Up" ? "Login" : "Sign Up"
    );
  };

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (signState === "Sign Up") {
        if (name.trim().length < 1) {
          throw new Error("Please enter your name");
        }
        if (email.trim().length < 1) {
          throw new Error("Please enter your email");
        }
        if (password.trim().length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }
        if (password.trim().length > 20) {
          throw new Error("Password must be less than 20 characters long");
        }
        if (!/[A-Z]/.test(password)) {
          throw new Error(
            "Password must contain at least one uppercase letter"
          );
        }
        if (!/[a-z]/.test(password)) {
          throw new Error(
            "Password must contain at least one lowercase letter"
          );
        }
        if (!/[0-9]/.test(password)) {
          throw new Error("Password must contain at least one number");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          throw new Error(
            "Password must contain at least one special character"
          );
        }
        if (password !== c_password) {
          throw new Error("Passwords do not match");
        }
        await signup(name, email, password);
        toast.success("Sign up successful.");
        navigator("/");
      } else {
        if (email.trim().length < 1) {
          toast.error("Please enter your email");
          return;
        }
        if (password.trim().length < 1) {
          toast.error("Please enter your password");
          return;
        }
        await login(email, password);
        toast.success("Login successful.");
        navigator("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen login py-5 lg:px-[8%] px-2 bg-gradient flex">
      <Link to={"/"}>
        <span
          className="text-xl sm:text-4xl font-bold bg-clip-text text-transparent absolute"
          style={{
            backgroundImage: "linear-gradient(to right, #ff7e5f, #1a2a6c)",
          }}
        >
          ShowRoom
        </span>
      </Link>
      <div className="w-full max-w-md bg-black bg-opacity-75 rounded py-16 px-10 sm:p-16 m-auto">
        <h1 className="text-3xl font-medium mb-7">{signState}</h1>
        <form onSubmit={user_auth}>
          {signState === "Sign Up" && (
            <input
              value={name}
              onChange={handleNameChange}
              type="text"
              placeholder="Your Name"
              className="w-full h-12 bg-[#333] text-white my-3 mx-0 rounded py-4 px-5 font-medium placeholder:font-medium placeholder:text"
            />
          )}

          <input
            value={email}
            onChange={handleEmailChange}
            type="email"
            placeholder="Email"
            className="w-full h-12 bg-[#333] text-white my-3 mx-0 rounded py-4 px-5 font-medium placeholder:font-medium placeholder:text"
          />

          <div className="relative w-full">
            <input
              value={password}
              onChange={handlePasswordChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full h-12 bg-[#333] text-white my-3 mx-0 rounded py-4 px-5 font-medium placeholder:font-medium placeholder:text"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {signState === "Sign Up" && (
            <input
              value={c_password}
              onChange={handleC_passwordChange}
              type="password"
              placeholder="Confirm Password"
              className="w-full h-12 bg-[#333] text-white my-3 mx-0 rounded py-4 px-5 font-medium placeholder:font-medium placeholder:text"
            />
          )}

          <button
            className="w-full p-4 bg-[#e50914] rounded text font-medium mt-5 mb-2 cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : signState}
          </button>
        </form>

        <div className="mt-10 text-[#737373]">
          {signState === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={handleSignState}
                className="ml-1.5 text-white font-medium cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <>
              <p className="text-sm">
                New to ShowRoom?{" "}
                <span
                  onClick={handleSignState}
                  className="ml-1.5 text-white font-medium cursor-pointer"
                >
                  Sign Up Now
                </span>
              </p>
              <Link className="" to={"/"}>
                Continue without Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
