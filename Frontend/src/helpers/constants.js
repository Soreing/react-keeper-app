// Email format regular expression
const emailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Password format regulat expression
// Must contain a digit, lowercase, uppercase letter
// Must contain a special character from  $ % @ ^ & ; ! ? . + - * = _
// Must be between 8 and 32 characters
const passwordformat = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[$%@^&;!?.+\-*=_]).{8,32}$/;


const authServerDomain = process.env.AUTH_SERVER;   // Base URL of the authentication server
const apiServerDomain  = process.env.API_SERVER;    // Base URL of the api server

// Error message constants
const Error = {
    missingFields: "Missing required fields",
    pwdRepeatMismatch: "Passwords entered do not match",
    invalidEmailFormat: "Email address entered is not valid",
    invalidPasswordFormat: "Passwords must be between 8-32 characters and contain digits, lowercase and uppercase letters and a special character ($%@^&;!?.+-*=_)",
}

export {Error, emailformat, passwordformat, authServerDomain, apiServerDomain}