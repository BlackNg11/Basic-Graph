const jwt = require("jsonwebtoken");

module.exports = (res, req, next) => {
	const authHeader = req.get("Authorization");

	if (!authHeader) {
		req.isAuth = false;
		return next();
	}

	const token = authHeader.split(" ")[1]; //Authorization: "Bearer 1234qdcawe21"
	if (!token || token === "") {
		req.isAuth = false;
		return next();
	}

	let decodedToken;

	try {
		decodedToken = jwt.verify(token, "supersercretkey");
	} catch (err) {
		req.isAuth = false;
		return next();
	}

	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}

	req.isAuth = true;
	req.userId = decodedToken.userId;
	next();
};
