
  const express = require('express');
  const app = express();
  const mongoose = require('mongoose');
  const bcrypt= require('bcrypt');
  const User=require("./userModel");
  // to parse json data from request object
  app.use(express.json())


  mongoose.connect("mongodb://localhost:27017/userapi",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true


}).then(() =>{
    console.log("coonection is successful");
}).catch((e) =>{
    console.log("no connection");
})

app.post("/signup",async(req,res)=>{
    const body=req.body;
    if(!(body.email && body.password))
    {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    const user = new User(body);
    const salt= await bcrypt.genSalt(10);
    user.password= await bcrypt.hash(user.password,salt);
    user.save().then((doc)=> res.status(201).send(doc));
});

app.post("/login",async(req,res)=>{
    const body=req.body;
    const user = await User.findOne({email:req.email});
    if(user)
    {
        const validpassword=await bcrypt.compare(body.password,user.password);
    if(validpassword)
    {
        res.status(200).json({Message:"valid password"});
    }else
    {
        res.status(400).json({Message:"invalid password"});

    }
    }else{
        res.status(401).json({Message:"user doesnot exist"});
    }
});

app.listen(3000, () => console.log("Running on port 3000"))