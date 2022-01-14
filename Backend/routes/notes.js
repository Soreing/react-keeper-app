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

router.get("/notes", verifyAuthToken, getAllNotes);
router.get("/notes/:noteid", verifyAuthToken, getOneNote);
router.post("/notes", verifyAuthToken, createOneNote);
router.delete("/notes", verifyAuthToken, deleteAllNotes);
router.delete("/notes/:noteid", verifyAuthToken, deleteOneNote);

export default router;