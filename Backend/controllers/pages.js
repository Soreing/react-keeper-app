// Capture the URL and render the React App
exports.serveSite = (req, res, next) => {
    res.sendFile("/public/index.html", {root: __dirname + "/.."});
};
