import "reflect-metadata";
import express from "express";
require("dotenv-safe").config();
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import {join} from 'path'
import { User } from "./entities/User";
import passport from 'passport';
import { Strategy as GitHubStrategy } from "passport-github";

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
const main = async () =>{
    await createConnection({
        type:'postgres',
        username:'postgres',
        password:'Akhil099',
        entities:[join(__dirname,"./entities/*.*")],
        logging:!__prod__,
        synchronize:!__prod__,
    });
   
    const app = express();

    const user = await User.create({content:"This is test code content.."}).save();
    console.log({user});
    passport.serializeUser((user:any,done)=>{
        done(null, user.accessToken);
    });
    app.use(passport.initialize());
     
   app.get("/",(_req,res)=>{
    res.send("Hello");
   });
    app.listen(5001,()=>{
        console.log("listening on 5001");
    });
};
main();