import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({success: false, message: 'Unauthorized: No token provided'});
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (!tokenDecode.isAdmin) {
            return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
        }

        req.user = tokenDecode;
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }

    // try {
    //     const authHeader = req.headers.authorization;

    //     if (!authHeader) {
    //         return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    //     }

    //     const token = authHeader.split(" ")[1];
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //     if (!decoded.isAdmin) {
    //         return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    //     }

    //     req.user = decoded;
    //     next();

    // } catch (error) {
    //     return res.status(401).json({ success: false, message: "Invalid token" });
    // }
};

export default adminAuth;
