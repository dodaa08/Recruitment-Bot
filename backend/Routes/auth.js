import { Router } from "express";
import User from "../db.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 10;

const secret = "kartik123";

const userRouter = Router();

const Signup = async (req, res)=>{
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    try{       
        await User.create({
            name : name,
            email : email,
            password : hashedPassword
        });
        
        res.json({
            message : "Signed Up"
    });
}
catch(Error){
    console.log("Error", Error);
    res.send("Error :", Error);
}
}

const Signin = async(req, res)=>{
    const {email, password} = req.body;

    try{
        const verify = await User.findOne({ email }).select('+password');

        if (!verify) {
            return res.status(401).send("Invalid Credentials");
        }

        const isPassword = await bcrypt.compare(password, verify.password);
        if(!isPassword){
            return res.send("The creds are invalid...");
        }
            const token = await jwt.sign({id: verify._userid}, secret);
            console.log(token);
            res.setHeader('Authorization', `Bearer ${token}`);
            res.status(200).send(token);
        }

    catch(Error){
        console.log(Error);
        res.send(Error);
    }
}

userRouter.post("/signup", Signup);
userRouter.post("/signin", Signin);

export default userRouter;      

