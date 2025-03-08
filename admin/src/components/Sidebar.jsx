import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

function Sidebar() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return (
    <>
      {aToken && (
        <div className="h-screen min-w-16 md:min-w-52 bg-white shadow-sm rounded-lg">
          <ul className="text-[#515151] p-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 md:px-3 rounded-lg transition-all duration-200 ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-medium" : "hover:bg-gray-50"
                }`
              }
              to={"/admin-dashboard"}
            >
              <img src={assets.home_icon} alt="" className="w-5 h-5" />
              <p className="hidden md:block text-sm">Dashboard</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 md:px-3 rounded-lg mt-1 transition-all duration-200 ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-medium" : "hover:bg-gray-50"
                }`
              }
              to={"/all-appointments"}
            >
              <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
              <p className="hidden md:block text-sm">Appointments</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 md:px-3 rounded-lg mt-1 transition-all duration-200 ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-medium" : "hover:bg-gray-50"
                }`
              }
              to={"/add-doctor"}
            >
              <img src={assets.add_icon} alt="" className="w-5 h-5" />
              <p className="hidden md:block text-sm">Add Doctor</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 md:px-3 rounded-lg mt-1 transition-all duration-200 ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-medium" : "hover:bg-gray-50"
                }`
              }
              to={"/doctor-list"}
            >
              <img src={assets.people_icon} alt="" className="w-5 h-5" />
              <p className="hidden md:block text-sm">Doctors list</p>
            </NavLink>
          </ul>
        </div>

      )}
      {dToken && (
        <div className="h-screen min-w-16 md:min-w-52 bg-white shadow-sm rounded-lg">
          <ul className="text-[#515151] p-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 md:px-3 rounded-lg transition-all duration-200 ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-medium" : "hover:bg-gray-50"
                }`
              }
              to={"/doctor-dashboard"}
            >
              <img src={assets.home_icon} alt="" className="w-5 h-5" />
              <p className="hidden md:block">Dashboard</p>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 md:px-3 rounded-lg transition-all duration-200 ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-medium" : "hover:bg-gray-50"
                }`
              }
              to={"/doctor-appointments"}
            >
              <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
              <p className="hidden md:block">Appointments</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-1 md:px-3 rounded-lg transition-all duration-200 ${isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-primary font-medium" : "hover:bg-gray-50"
                }`
              }
              to={"/doctor-profile"}
            >
              <img src={assets.people_icon} alt="" className="w-5 h-5" />
              <p className="hidden md:block">Profile</p>
            </NavLink>
          </ul>
        </div>
      )}
    </>
  );
}

export default Sidebar;
