import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [localUserData, setLocalUserData] = useState(userData);

  useEffect(() => {
    setLocalUserData(userData);
  }, [userData]);

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setLocalUserData((prev) => ({ ...prev, gender: selectedGender }));
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", localUserData.name);
      formData.append("phone", localUserData.phone);
      formData.append("address", JSON.stringify(localUserData.address));
      formData.append("gender", localUserData.gender);
      formData.append("dob", localUserData.dob);
      
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error details:", error.response);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    localUserData && (
      <div className="m-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : localUserData.image}
                alt=""
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={localUserData.image} alt="" />
        )}

        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            onChange={(e) =>
              setLocalUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={localUserData.name}
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {localUserData.name}
          </p>
        )}
        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email Id:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="email"
                onChange={(e) =>
                  setLocalUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                value={localUserData.email}
              />
            ) : (
              <p className="text-blue-500">{localUserData.email}</p>
            )}
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="tel"
                onChange={(e) =>
                  setLocalUserData((prev) => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, ""),
                  }))
                }
                value={localUserData.phone || ""}
                maxLength={10}
              />
            ) : (
              <p className="text-blue-400">{localUserData.phone}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <>
                <input
                  className="bg-gray-50"
                  type="text"
                  onChange={(e) =>
                    setLocalUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={localUserData.address?.line1 || ""}
                />
                <br />
                <input
                  className="bg-gray-50"
                  type="text"
                  onChange={(e) =>
                    setLocalUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={localUserData.address?.line2 || ""}
                />
              </>
            ) : (
              <p className="text-gray-500">
                {localUserData.address.line1}
                <br />
                {localUserData.address.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                onChange={handleGenderChange}
                value={localUserData.gender || "Select Gender"}
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">{localUserData.gender}</p>
            )}

            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="date"
                onChange={(e) =>
                  setLocalUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={localUserData.dob || ""}
              />
            ) : (
              <p className="text-gray-400">{localUserData.dob}</p>
            )}
          </div>

          <div className="mt-10">
            {isEdit ? (
              <button
                className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={updateUserProfileData}
              >
                Save Information
              </button>
            ) : (
              <button
                className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
