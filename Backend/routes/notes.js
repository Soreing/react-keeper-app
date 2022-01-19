import express from "express";
import {verifyAuthToken} from "../middleware/verifyAuthToken.js";
import {
    getAllNotes,
    getOneNote,
    createOneNote,
    deleteAllNotes,
    deleteOneNote
} from "../controllers/notes.js";

const router = express.Router();

router.get("/api/notes", verifyAuthToken, getAllNotes);
router.get("/api/notes/:noteid", verifyAuthToken, getOneNote);
router.post("/api/notes", verifyAuthToken, createOneNote);
router.delete("/api/notes", verifyAuthToken, deleteAllNotes);
router.delete("/api/notes/:noteid", verifyAuthToken, deleteOneNote);

export default router;