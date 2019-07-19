const fs = require("fs");
exports.deleteFile = path => {
    fs.unlink(path, err => {
        if (err) {
            err.httpStatusCode = 500;
            throw err;
        }
    });
};
