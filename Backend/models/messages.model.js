const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  username: {
    type: String,
    require:true
  },
  message: {
    type: String,
    require:true
  },
  msgid: {
    type: String,
    require:true
  },
  type: {
    type: String,
    require:true
  },
  date: {
    type: String,
    require:true
  },
  from: {
    type: String,
    require:true
  },
  to: {
    type: String,
    require:true
  },
  seen: {
    type: Boolean,
    enum: [true, false],
    default: false
  },

}, { timestamps: true });

module.exports = mongoose.model("messages", Schema);
