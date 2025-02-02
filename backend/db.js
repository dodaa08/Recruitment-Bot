import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name : {type : String},
    email : {type: String , unique : true},
    password : {type : String}
});

const User = mongoose.model("User",userSchema);

export default User;