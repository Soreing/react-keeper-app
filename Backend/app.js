import express from "express";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import cors from "cors";

import { corsOptions, apiPort } from "./helpers/constants.js";
import auth from "./routes/auth.js";
import notes from "./routes/notes.js";

const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(bodyparser.raw());
app.use(cookieparser());
app.use(cors(corsOptions));

app.use(auth);
app.use(notes);

app.listen(apiPort);