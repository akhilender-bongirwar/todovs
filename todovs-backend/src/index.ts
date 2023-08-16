import "reflect-metadata";
import express from "express";
require("dotenv-safe").config();
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { join } from 'path'
import { User } from "./entities/User";
import passport from 'passport';
import { Strategy as GitHubStrategy } from "passport-github";
import jwt  from 'jsonwebtoken';

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/auth/github/callback"
},
    async (_, __, profile, cb) => {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
            user.name = profile.displayName;
            await user.save();
        } else {
            user = await User.create({ 
                name: profile.displayName,
                githubId: profile.id,
            }).save();
        }

        cb(null, { accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1y", }), });
    }
));

const main = async () => {
    await createConnection({
        type: 'postgres',
        username: 'postgres',
        password: 'Akhil099',
        entities: [join(__dirname, "./entities/*.*")],
        logging: !__prod__,
        synchronize: !__prod__,
    });

    const app = express();

    passport.serializeUser((user: any, done) => {
        done(null, user.accessToken);
    });
    app.use(passport.initialize());
    app.get('/auth/github', passport.authenticate('github', { session: false }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { session: false }),
        (req:any, res) => {
            res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
        });

    app.get("/", (_req, res) => {
        res.send("Hello");
    });
    app.listen(5001, () => {
        console.log("listening on 5001");
    });
};
main();