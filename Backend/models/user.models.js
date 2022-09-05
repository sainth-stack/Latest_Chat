const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  socketid: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false
  },
  unseenMessage: {
    type: Array,
    required: false
  },
  seenMessage:{
    type:Array,
    required:false
  },
  status: {
    type: String,
    required: true,
    enum: ["Online", "Offline"],
    default: "Online",
  },
  seen:{
    type:Boolean,
    enum:[true,false],
    default:false
  }
}, { timestamps: true });

module.exports = mongoose.model("usersData", Schema);
