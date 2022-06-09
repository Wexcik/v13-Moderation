const { Schema, model } = require("mongoose");

const schema = Schema({
    user: { type: String }, 
    tarih: { type: String, default: null},
    channelName: {type: String},
    channelID: {type: String},
    süre: {type: Number},
    dateNow: { type: Date, default: Date.now() },
    StNumara: {type: Number},
    sestekiler: {type: Array},
    sestekilerid: {type: Array},
    date: {type: Number, default: Date.now()},

});

module.exports = model("streamerUserStat", schema);
