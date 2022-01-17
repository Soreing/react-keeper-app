import express from "express";
import {logout, refreshAuthToken} from "../controllers/auth/common-auth.js";
import {login, register, verify} from "../controllers/auth/local-auth.js";
import {googleAuth, googleCallback} from "../controllers/auth/google-auth.js";
import {facebookAuth, facebookCallback} from "../controllers/auth/facebook-auth.js";
import {discordAuth, discordCallback} from "../controllers/auth/discord-auth.js";

const router = express.Router();

router.post("/auth/logout", logout);
router.get("/auth/refresh-token", refreshAuthToken);

router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/verify/:verCode", verify);

router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback);

router.get("/auth/facebook", facebookAuth);
router.get("/auth/facebook/callback", facebookCallback);

router.get("/auth/discord", discordAuth);
router.get("/auth/discord/callback", discordCallback);

export default router;