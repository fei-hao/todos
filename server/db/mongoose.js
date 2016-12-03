/**
 * Created by feiha on 12/3/2016.
 */
var mongoose = require("mongoose");

const url = "mongodb://localhost:27017/Todos";

mongoose.connect(url);

module.exports = {mongoose};