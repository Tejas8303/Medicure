import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import stripe, { Stripe } from "stripe";
import razorpay from "razorpay";

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Unauthorized access. Invalid token.");
  }
};

// API to register a user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid Email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log(token)
    const decoded = verifyToken(token);
    const userData = await userModel.findById(decoded.id).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    const { name, phone, address, dob, gender } = req.body;
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data missing" });
    }

    await userModel.findByIdAndUpdate(decoded.id, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    const imgFile = req.file;
    if (imgFile) {
      const imageUpload = await cloudinary.uploader.upload(imgFile.path, { resource_type: "image" });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(decoded.id, { image: imageURL });
    }

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    const { docId, slotDate, slotTime } = req.body;
    if (!docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData || !docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }

    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime];
    const appointmentData = {
      userId: decoded.id,
      docId,
      userData: await userModel.findById(decoded.id).select("-password"),
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to list user appointments
const listAppointment = async (req, res) => {
  try {
    // console.log("Authorization Header:", req.headers.authorization); // Log the header
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    const appointments = await appointmentModel.find({ userId: decoded.id });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log("Error in listAppointment:", error); // More specific logging
    res.json({ success: false, message: error.message });
  }
};


// API to cancel an appointment
// API to cancel an appointment
const cancelAppointment = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Validate if appointment exists and if user is authorized
    if (!appointmentData || appointmentData.userId.toString() !== decoded.id) {
      return res.json({ success: false, message: "Unauthorized action" });
    } 

    // Mark the appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    // Check if doctorData and slots_booked exist
    if (doctorData && doctorData.slots_booked) {
      // Create a copy of slots_booked for modification
      const updatedSlotsBooked = { ...doctorData.slots_booked };

      // Initialize slotDate array if it doesn't exist
      if (!updatedSlotsBooked[slotDate]) {
        updatedSlotsBooked[slotDate] = [];
      }

      // Remove the canceled slot from the specific date
      updatedSlotsBooked[slotDate] = updatedSlotsBooked[slotDate].filter((e) => e !== slotTime);

      // Update the doctor's slots_booked in the database
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: updatedSlotsBooked });
    } else {
      // Error handling if slots_booked doesn't exist
      return res.json({ success: false, message: "Doctor's slots_booked data not found" });
    }

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log("Error in cancelAppointment:", error);
    res.json({ success: false, message: error.message });
  }
};




export default {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
};
