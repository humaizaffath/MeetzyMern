const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    fullName: { type: String },
    dob: { type: Date },
    address: { type: String },
    phoneNumber: { type: String },
    website: { type: String },
    allInfo: { type: String }, // Optional field

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    groupsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    groupsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    adminOfGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }], // 👈 New field

   

    verified: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
  },
  
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
