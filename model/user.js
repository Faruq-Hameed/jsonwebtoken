// user.js
const Mongoose = require("mongoose")
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'username is required'],
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, 'password is required'],
  },
  role: {
    type: String,
    default: "beginner",
    enum: ['beginner', 'intermediate','admin', 'final'],
    required: [true, 'role is required'],
  },
},
  { timestamps: true }
)

const User = Mongoose.model("user", UserSchema)
module.exports = User