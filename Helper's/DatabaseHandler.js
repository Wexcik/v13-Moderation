const mongoose = require("mongoose")
const Settings = require("../Helper's/Settings.json")
mongoose.connect(Settings.DatabaseCenter, {
useNewUrlParser: true,});
mongoose.connection.on("connected", () => {
console.log('Mongoose Has been Connected')})
mongoose.connection.on("eror", () => {
console.log('Mongoose Has been not Connected')})