import experss from "express";
import dotenv from "dotenv";

dotenv.config();

import appMain from "./Routes/Main"
import userRouter from "./Routes/auth";
import emailRouter from "./Routes/Email";


import cors from "cors";

app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use("/v1/api/auth", userRouter);
app.use("/v1/api/Main", appMain);
app.use("/v1/api/Email", emailRouter);


const app = experss();
const PORT = process.env.PORT;

app.use(experss.json());


app.listen(PORT, ()=>{
    console.log(`Running on ${PORT}`);
});

const connect = async()=>{
    await mongoose.connect("mongodb+srv://dodakartik26:LzEnLaLX8mejXN2q@cluster0.t5zhc.mongodb.net/RecBot");
}

connect();