import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
  try {
    // Extract the Authorization header
    const authHeader = req.headers["authorization"];

    // Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header is missing" });
    }

    // Split and validate the header format
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res
        .status(401)
        .json({ error: "Invalid Authorization header format" });
    }

    const token = tokenParts[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded data to the request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
