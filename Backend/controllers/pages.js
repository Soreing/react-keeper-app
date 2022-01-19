// Capture the URL and render the React App
exports.serveSite = (req, res, next) => {
    res.sendFile("/Public/index.html", {root: __dirname + "/.."});
};
