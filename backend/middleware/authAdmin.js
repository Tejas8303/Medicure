import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    // Log the incoming request headers to check for the token
    // console.log("Request Headers:", req.headers);  

    const { atoken } = req.headers;

    // Check if the token is provided
    if (!atoken) {
      console.log("No token provided."); // Log if the token is missing
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // Verify the token using the secret
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    // console.log("Decoded Token:", token_decode); // Log the decoded token

    // Check if the decoded token email matches the ADMIN_EMAIL
    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      console.log("Unauthorized access: Token email does not match."); // Log if emails don't match
      return res.status(403).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in authAdmin middleware:", error); // Log any errors
    return res.status(500).json({
      success: false,
      message: "Server Error, Please try again",
    });
  }
};

export default authAdmin;
