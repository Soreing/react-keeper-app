import fs from "fs";

// Email format regular expression
const emailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Password format regulat expression
// Must contain a digit, lowercase, uppercase letter
// Must contain a special character from  $ % @ ^ & ; ! ? . + - * = _
// Must be between 8 and 32 characters
const passwordformat = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[$%@^&;!?.+\-*=_]).{8,32}$/;

// Error message constants
const Error = {
    missingFields: "Missing required fields",
    invalidFields: "Invalid input details",
    invalidLogin: "Invalid Username or Password",
    userNotVerified: "You need to verify your email address before you can log in",
    emailNotValid: "This email address is not valid",
    alreadyRegistered: "This email is already registered",
}

// Header Options for Cross Origin Resource Sharing
const corsOptions = {
    origin: process.env.HOSTING_DOMAIN,
    credentials: true,
    optionsSuccessStatus: 200
}

const cookieOptions = {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    sameSite: true,
}

const privateKey  = process.env.SSL ? fs.readFileSync(process.env.SSLKEY_PATH, "utf8")  : "";
const certificate = process.env.SSL ? fs.readFileSync(process.env.SSLCERT_PATH, "utf8") : "";
const credentials = {key: privateKey, cert: certificate};

const tokenSecret  = process.env.TOKENSECRET;   // Secret to sign JWT tokens with
const refTokenTTL  = 30;                        // Time To Live expiry in seconds for the Refresh Token
const authTokenTTL = 10;                        // Time To Live expiry in seconds for the Auth Token

const dbPort = process.env.DBPORT;              // Port number of the Mongoose Database
const dbName = process.env.DBNAME;              // Name of the Mongoose Database
const dbUser = {                                 // Username and Password to connect to the Database
    user: process.env.DBUSER,
    pass: process.env.DBPASS,
};

const apiPort = process.env.API_PORT;           // Port number the API is running on

export {
    Error,
    emailformat,
    passwordformat,
    corsOptions,
    cookieOptions,
    privateKey,
    certificate,
    credentials,
    tokenSecret,
    refTokenTTL,
    authTokenTTL,
    dbPort,
    dbName,
    dbUser,
    apiPort,
}