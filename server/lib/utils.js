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
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // important for cross-site
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.full-stack-z8dl.onrender.com' : 'localhost'
    });
}
module.exports ={
    setTokenCookie,
}