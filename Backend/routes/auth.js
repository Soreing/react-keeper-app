import express from "express";
import {logout, refreshAuthToken} from "../controllers/auth/common-auth.js";
import {login, register} from "../controllers/auth/local-auth.js";
import {discordAuth, discordCallback} from "../controllers/auth/discord-auth.js";

const router = express.Router();

router.post("/auth/logout", logout);
router.get("/auth/refresh-token", refreshAuthToken);

router.post("/auth/login", login);
router.post("/auth/register", register);

router.get("/auth/discord", discordAuth);
router.get("/auth/discord/callback", discordCallback);

export default router;