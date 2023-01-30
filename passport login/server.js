const express = require("express");
const app = express();
const passport = require("passport");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
// const res = require("express/lib/response");

//for storing user info because we have no data base here

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);
const users = [];

app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: "jdkcnsdc",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.render("index.ejs", { user: req.user.name });
});
app.get("/Register", (req, res) => {
  res.render("Register.ejs");
});
app.post("/Register", async (req, res) => {
  try {
    const hashedPasswd = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPasswd,
    });
    res.redirect("/Login");
  } catch {
    res.redirect("/Register");
  }
  console.log(users);
});

app.get("/Login", (req, res) => {
  res.render("Login.ejs");
});
app.post(
  "/Login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/Login",
    failureFlash: true,
  })
);
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/Login");
}
app.listen(3000);
