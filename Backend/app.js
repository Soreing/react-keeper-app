import http from "http";
import https from "https";
import express from "express";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import cors from "cors";

import { corsOptions, apiPort, credentials } from "./helpers/constants.js";
import auth from "./routes/auth.js";
import notes from "./routes/notes.js";
import pages from "./routes/pages.js";

const app = express();
const server = process.env.SSL ? 
      https.createServer(credentials, app) 
    : http.createServer(app);

app.use(express.static(__dirname+ "/public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(bodyparser.raw());
app.use(cookieparser());
app.use(cors(corsOptions));

app.use(auth);
app.use(notes);
app.use(pages);

server.listen(apiPort);