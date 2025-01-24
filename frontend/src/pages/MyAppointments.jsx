import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error("Failed to fetch appointments.");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Debugging: Check the response from the server
      // console.log("Cancel Appointment Response:", data);
  
      if (data.success) {
        toast.success("Appointment cancelled successfully.");
        getUserAppointment(); // Refresh appointments
        getDoctorsData(); // Refresh doctor data if needed
      } else {
        toast.error(data.message || "Failed to cancel appointment."); // Use message from server if exists
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error); // Log the error for debugging
      toast.error("An error occurred.");
    }
  };
  
  

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img className="w-32 bg-indigo-50" src={item?.docData?.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600 ">
              <p className="text-neutral-800 font-semibold">{item?.docData?.name}</p>
              <p className="text-zinc-700 font-medium mt-1">{item?.docData?.speciality}</p>
              <p>Address:</p>
              <p className="text-xs">{item?.docData?.address?.line1}</p>
              <p className="text-xs">{item?.docData?.address?.line2}</p>
              <p className="text-xs mt-1 ">
                <span className="text-sm text-neutral-700 font-medium ">Date & Time</span>{" "}
                {item.slotDate} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-500 "
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="sm-min-w-48 py-2 px-2 border border-red-500 rounded text-red-500 ">
                  Appointment Cancelled
                </button>
              )}
              {item.isCompleted && (
                <button className="sm-min-w-48 py-2 px-2 border border-green-300 rounded text-green-500 ">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
