const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const ejs=require("ejs");
require('dotenv').config()
let alert = require('alert'); 

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
var encrypt = require('mongoose-encryption');

mongoose.connect("mongodb+srv://akhtar-admin:pulsar150@atlascluster.ux104bi.mongodb.net/HealthCenterManagement",{ useNewUrlParser: true })

const dbSchema=new mongoose.Schema({
    Usn: String,
    Name: String,
    Branch: String,
    RegDate: String,
    Problem: String,
    MediComments: String
});
const details= mongoose.model("details",dbSchema);
const userSchema=new mongoose.Schema({
    email: String,
    password: String
 });
//  const secret="Thisisourlittlesecret."
 userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"] });
 const User=mongoose.model("User",userSchema);
 app.post("/register",(req,res)=>{
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Pass saved successfully");
            // res.render("secrets");
            res.sendFile(__dirname+"/index.html");
        }
    });
 });
 
 app.post("/login",(req,res)=>{
    const uname=req.body.username;
    const pass=req.body.password;
    User.findOne({email: uname},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===pass){
                    // res.render("secrets");
                    res.sendFile("/DocLanding.html", {root: __dirname });
                }
                else{
                    alert("Oops! Wrong credentials!")
                    // alert("Oops! Wrong credentials");
                    // res.render("home");
                    res.sendFile(__dirname+"/index.html");
                }
            }
            else{
                alert("Oops! Wrong credentials!")
                // alert("Oops! Wrong credentials");
                // res.render("home");
                res.sendFile(__dirname+"/index.html");
            }
        }
    });
 });
 app.post("/login2",(req,res)=>{
    const uname=req.body.username;
    const pass=req.body.password;
    User.findOne({email: uname},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===pass){
                    // res.render("secrets");
                    res.sendFile("/TeacherLanding.html", {root: __dirname });
                }
                else{
                    alert("Oops! Wrong credentials!")
                    // alert("Oops! Wrong credentials");
                    // res.render("home");
                    res.sendFile(__dirname+"/index.html");
                }
            }
            else{
                alert("Oops! Wrong credentials!")
                // alert("Oops! Wrong credentials");
                // res.render("home");
                res.sendFile(__dirname+"/index.html");
            }
        }
    });
 });
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
app.get("/login.ejs",(req,res)=>{
    res.render("login");
})
app.get("/teacherLogin.ejs",(req,res)=>{
    res.render("teacherLogin");
})
app.get("/register.ejs",(req,res)=>{
    res.render("register");
})
app.get("/detailsFromDoc",(req,res)=>{
    res.sendFile("/detailsFromDoc.html", {root: __dirname });
})
app.get("/index.ejs",(req,res)=>{
    details.find({},function(err,detailss){
        res.render("index",{detailedList: detailss});
    })
})
app.post("/",(req,res)=>{
    var todayy = new Date();
    var date = todayy.getDate();
    var month = todayy.getMonth()+1;
    var year= todayy.getFullYear();
    var dateFormat;
    if(month<10){
        month='0'+month;
    }
    if(date<10){
        date='0'+date;
    }
    dateFormat=  year+'-'+month+'-'+date;
    console.log(dateFormat)
    console.log(todayy)
    const newDetails=new details({
        Usn:req.body.usn,
        Name:req.body.stName,
        Branch:req.body.branch,
        RegDate: dateFormat ,
        Problem:req.body.problem,
        MediComments:req.body.medi
    })
    newDetails.save();
    res.redirect("/");
})
app.post("/search",(req,res)=>{
    details.find({Usn:req.body.usn},function(err,detailss){
        res.render("index",{detailedList: detailss});
    })
})
app.post("/search2",(req,res)=>{ 
    const tem=req.body.date;
    // console.log("Date Recieved ",tem);
    var ans=Date.parse(tem);
    var rcdate= new Date(ans);
    var searchDate=rcdate.toString();
    // var utcSeconds = 1234567890;
    // var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    // // d.setUTCSeconds(ans);
    // var fans=new Date(ans);
    console.log(tem);
    console.log(searchDate);
    // let temm=JSON.stringify(rcdate);
    // let text=temm.slice(0,10);
    // console.log(text);

    details.find({ 'RegDate':tem},function(err,detailss){
        console.log("Found");
        console.log("Detailss ",detailss);
        res.render("index",{detailedList: detailss});
    })
})
app.listen(3000,function(){
    console.log("Server started at port 3000.");
})