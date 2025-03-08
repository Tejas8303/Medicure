import { useContext } from "react";
import Medicure1 from "../assets/Medicure1.png"
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");

    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };
  return (
    <div className="flex justify-between items-center py-3 mx-2 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-28 sm:w-40 cursor-pointer"
          src={Medicure1}
          alt=""
        />
        <p className="border px-5 py-1 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-primary text-white n text-sm px-5 py-1 sm:px-10 sm:py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
