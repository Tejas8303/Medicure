import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    try {
      const endpoint = state === "Sign Up" ? "/api/user/register" : "/api/user/login";
      const userData = state === "Sign Up" ? { name, password, email } : { password, email };
  
      // console.log("Sending data to:", backendUrl + endpoint); // Debugging line
      // console.log("User Data:", userData); // Debugging line
  
      const { data } = await axios.post(backendUrl + endpoint, userData);
  
      // console.log("Response from backend:", data); // Debugging line
  
      if (data.success) {
        // console.log("Token received:", data.token); // Debugging line
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(state === "Sign Up" ? "Account created!" : "Logged in!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      console.error("Error:", error); // Debugging line
      toast.error(errorMsg);
    }
  };
  

  useEffect(() => {
    // console.log("Token in useEffect:", token); // Debugging line
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);
  

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book an appointment.
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
