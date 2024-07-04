module.exports = function filePathMiddleware(path) {
    return function(req, res, next) {
        req.filePath = path;
        console.log(path);
        next();
    }
}