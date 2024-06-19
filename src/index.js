const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const collection = require("./mongodb"); 
const templatePath = path.join(__dirname, "../template");

app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templatePath);

mongoose.connect("mongodb://localhost:27017/Login_signup", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
   res.render('Landingpage')
});

app.get("/Student", (req, res) => {
    res.render("login", { userType: 'student' });
});

app.get("/Admin", (req, res) => {
    res.render("login", { userType: 'admin' });
});

app.get("/Instructor", (req, res) => {
    res.render("login", { userType: 'instructor' });
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const { name, password, userType } = req.body;

    try {
        const data = { name, password, userType };
        await collection.insertMany([data]);

        if (userType === 'admin') {
            res.redirect("/udemy");
        } else if (userType === 'student') {
            res.redirect("/home");
        } else if (userType === 'instructor') {
            res.redirect("/instructor-dashboard");
        } else {
            res.redirect("/"); 
        }
    } catch (error) {
        console.error("Error signing up:", error);
        res.send("Error signing up");
    }
});

app.post("/login", async (req, res) => {
    const { name, password, userType } = req.body;

    try {
        const user = await collection.findOne({ name, userType });
        if (!user) {
            return res.send("User not found or incorrect user type");
        }

        if (user.password !== password) {
            return res.send("Err - wrong password");
        }

        if (userType === 'admin') {
            res.render("udemy");
        } else if (userType === 'student') {
            res.render("home", { name: user.name });
        } else if (userType === 'instructor') {
            const students = await collection.find({ userType: 'student' }).select('name -_id');
            res.render("instructor-dashboard", { name: user.name, students });
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.send("Error logging in");
    }
});

const PORT = 7000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
