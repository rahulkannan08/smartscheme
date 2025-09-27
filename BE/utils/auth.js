function authenticateToken(req, res, next) {
    // Allow all requests for now
    next();
}

function isAdmin(req, res, next) {
    // Allow all requests for now
    next();
}

module.exports = { authenticateToken, isAdmin };