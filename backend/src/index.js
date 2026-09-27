import "dotenv/config"
import express from "express";
const app=express();

console.log(process.env.DB_URL);

app.listen(process.env.PORT,()=>{
    console.log("Server is running on 3000");
})