import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AdminRequest from "../models/AdminRequest.js";
import { transporter } from "../config/email.js";
import nodemailer from "nodemailer";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* -------------------------------------------------------------------------- */
/*                           GOOGLE LOGIN / REGISTER                          */
/* -------------------------------------------------------------------------- */
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn’t exist, create one
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        provider: "google",
        googleId,
        department: "Not Set",
        role: "user",
      });
    }

    // Generate app token (JWT)
    const appToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token: appToken,
      user,
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(400).json({ error: "Invalid Google token" });
  }
};

/* -------------------------------------------------------------------------- */
/*                            REQUEST ADMIN ACCESS                            */
/* -------------------------------------------------------------------------- */
export const requestAdminAccess = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department)
      return res.status(400).json({ message: "All fields required" });

    const exists = await AdminRequest.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Request already submitted" });

    const newRequest = await AdminRequest.create({ name, email, department });
    res.status(201).json({
      message: "Request submitted successfully",
      newRequest,
    });
  } catch (err) {
    console.error("Error in requestAdminAccess:", err);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                               REGISTER USER                                */
/* -------------------------------------------------------------------------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;
    console.log("Registration request:", { name, email, department, role });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({
      name,
      email,
      password, // handled by pre-save hook
      department,
      role: role === "admin" ? "admin" : "user",
      provider: "local",
    });

    console.log("User registered:", newUser.email, "-", newUser.role);
    res.status(201).json({
      message: `${newUser.role.toUpperCase()} registered successfully!`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message || "Server error during registration" });
  }
};

/* -------------------------------------------------------------------------- */
/*                                LOGIN USER                                  */
/* -------------------------------------------------------------------------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials: user not found" });

    // Prevent password login for Google users
    if (user.provider === "google")
      return res.status(400).json({ message: "Please log in using Google" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`${user.role.toUpperCase()} login successful`);
    res.json({
      message: `${user.role.toUpperCase()} login successful`,
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 GET PROFILE                                */
/* -------------------------------------------------------------------------- */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                        FETCH ADMIN REQUESTS (SUPERADMIN)                   */
/* -------------------------------------------------------------------------- */
export const getAdminRequests = async (req, res) => {
  try {
    const requests = await AdminRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error in getAdminRequests:", err);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                      HANDLE ADMIN REQUEST (ACCEPT/REJECT)                  */
/* -------------------------------------------------------------------------- */
export const handleAdminRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const request = await AdminRequest.findById(id);
    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (action === "accept") {
      const existingUser = await User.findOne({ email: request.email });

      if (existingUser && existingUser.role === "admin") {
        request.status = "Accepted";
        await request.save();
        return res.json({ message: "User already an admin" });
      }

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      if (existingUser) {
        existingUser.role = "admin";
        await existingUser.save();
      } else {
        await User.create({
          name: request.name,
          email: request.email,
          password: hashedPassword,
          department: request.department,
          role: "admin",
          provider: "local",
        });
      }

      request.status = "Accepted";
      await request.save();

      // Send approval email
      await transporter.sendMail({
        from: `"NITC Job Portal" <${process.env.SMTP_USER}>`,
        to: request.email,
        subject: "Your Admin Access Approved",
        html: `
          <h3>Hello ${request.name},</h3>
          <p>Your admin access has been approved.</p>
          <p><b>Temporary Password:</b> ${tempPassword}</p>
          <p>Please log in and change your password after first login.</p>
          <br/>
          <p>— NITC Job Portal Team</p>
        `,
      });

      return res.json({
        message: `Admin approved and email sent to ${request.email}`,
      });
    }

    if (action === "reject") {
      request.status = "Rejected";
      await request.save();

      await transporter.sendMail({
        from: `"NITC Job Portal" <${process.env.SMTP_USER}>`,
        to: request.email,
        subject: "Admin Request Rejected",
        html: `
          <h3>Hello ${request.name},</h3>
          <p>We regret to inform you that your admin request was rejected.</p>
          <p>Thank you for your interest.</p>
          <br/>
          <p>— NITC Job Portal Team</p>
        `,
      });

      return res.json({ message: "Admin request rejected and email sent" });
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error("Error in handleAdminRequest:", err);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                             UPDATE PASSWORD                                */
/* -------------------------------------------------------------------------- */
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent password updates for Google users
    if (user.provider === "google")
      return res.status(400).json({ message: "Google users cannot change password here" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error while updating password" });
  }
};

/* -------------------------------------------------------------------------- */
/*                             FORGOT PASSWORD                                */
/* -------------------------------------------------------------------------- */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found with that email." });

    if (user.provider === "google")
      return res.status(400).json({ message: "Google users cannot reset password this way." });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset Request - NITC Job Portal",
      text: `
Hi ${user.name || "User"},

You requested a password reset. Please click the link below to reset your password:

${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?email=${encodeURIComponent(email)}

If you did not request this, please ignore this email.
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);

    res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

/* -------------------------------------------------------------------------- */
/*                              RESET PASSWORD                                */
/* -------------------------------------------------------------------------- */
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword)
      return res.status(400).json({ message: "Email and new password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found." });

    if (user.provider === "google")
      return res.status(400).json({ message: "Google users cannot reset password here." });

    user.password = newPassword;
    await user.save();

    console.log(`Password reset for ${email} (${user.role})`);
    res.status(200).json({
      message: "Password reset successful.",
      role: user.role || "user",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error during password reset. Try again later." });
  }
};
