import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    // Password will be required only for normal login users
    password: { type: String, required: function () { return this.provider === "local"; } },

    // For Google or other OAuth logins
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: { type: String }, // store Google sub ID (optional)
    picture: { type: String },  // Google profile picture

    department: { type: String, default: "Not Set" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Hash password only if local login & password is modified
userSchema.pre("save", async function (next) {
  if (this.provider !== "local" || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.provider !== "local") return false; // Google users don’t have a password
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
