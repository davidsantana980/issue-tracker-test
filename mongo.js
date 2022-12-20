let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, console.log("success in connecting to mongodb"));
mongoose.set('strict', true);

let issueSchema = new mongoose.Schema({
    project:{type:String, required:true},
    issue_title: {type: String, required:true},
    issue_text:  {type: String, required:true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date, required: true},
    created_by: {type: String, required:true},
    assigned_to: {type: String, required:false, default: ""},
    open: {type: Boolean, required:false, default: true},
    status_text: {type: String, required:false, default: ""}
}, {versionKey : false})

exports.issueSchema = issueSchema;