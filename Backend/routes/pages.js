import express from "express";
import {serveSite} from "../controllers/pages.js";

const router = express.Router();

router.get("/", serveSite);
router.get("/login", serveSite);
router.get("/register", serveSite);
router.get("/notes", serveSite);
router.get("/verification", serveSite);
router.get("/bad-token", serveSite);

export default router;