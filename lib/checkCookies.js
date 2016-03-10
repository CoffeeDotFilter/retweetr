const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

module.exports = (request, reply, callback) => {
	if (!request.state.access_token) {
		reply.redirect('/login');
	} else {
		const token = request.state.access_token;
		const decodedDataToSend = jwt.verify(token, jwtSecret);
		return callback(decodedDataToSend);
	}
};
