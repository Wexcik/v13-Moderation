const mongoose = require("mongoose")
let Schema = mongoose.Schema;
const inviterData = mongoose.Schema({
    _id: String,
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    total: { type: Number, default: 0, min: 0 },
    regular: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    leave: { type: Number, default: 0, min: 0 },
    fake: { type: Number, default: 0, min: 0 },
});
module.exports = mongoose.model("inviterData", inviterData);
