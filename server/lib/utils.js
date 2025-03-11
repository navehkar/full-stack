const jwt = require('jsonwebtoken');
function setTokenCookie(res, user, secret) {
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email
        },
        secret,
        { expiresIn: '24h' }
    );
    
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',// important for cross-site
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
}
module.exports ={
    setTokenCookie,
}