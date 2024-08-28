const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  nickName: String,
  socketID: String,
  Color: String,
});
const GameSchema = new mongoose.Schema({
  gamecode: String,
  isOpen: {
    type: Boolean,
    default: true,
  },
  isOver: {
    type: Boolean,
    default: false,
  },
  players: [PlayerSchema],
});

module.exports = mongoose.model("Games", GameSchema);
