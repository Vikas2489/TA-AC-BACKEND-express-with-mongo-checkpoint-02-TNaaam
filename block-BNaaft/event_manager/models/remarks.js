var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Event = require("./events");

var remarksSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String },
    likes: { type: Number, default: 0 },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" }
}, { timestamps: true });

var Remark = mongoose.model("Remark", remarksSchema);

module.exports = Remark;