const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

module.exports = (request, reply, callback) => {
	// If cookie is not present, redirect to login.
	if (!request.state.access_token) {
		reply.redirect('/login');
	} else {
		// verify JWT and pass decoded oauth data to callback
		const token = request.state.access_token;
		const decodedDataToSend = jwt.verify(token, jwtSecret);
		return callback(decodedDataToSend);
	}
};
