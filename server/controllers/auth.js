const User = require('../models/auth');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
	'566574949302-tuboieq1re2v5purare2brfp4jr2n14p.apps.googleusercontent.com'
);

exports.googleLogin = (req, res) => {
	const { tokenId } = req.body;
	client
		.verifyIdToken({
			idToken: tokenId,
			audience:
				'566574949302-tuboieq1re2v5purare2brfp4jr2n14p.apps.googleusercontent.com'
		})
		.then((response) => {
			const { email, email_verified, name } = response.payload;
			if (email_verified) {
				User.findOne({ email }).exec((err, user) => {
					if (err) {
						return res.status(400).json({
							error: 'something went wrong'
						});
					} else {
						if (user) {
							const token = jwt.sign(
								{ _id: user.id },
								process.env.JWT_SECRET,
								{ expiresIn: '7d' }
							);
							const { _id, name, email } = user;
							res.json({ token, user: { _id, name, email } });
						} else {
							let password = email + process.env.JWT_SECRET;
							let newUser = new User({ name, email, password });
							newUser.save((err, data) => {
								if (err) {
									return res.status(400).json({
										error: 'something went wrong'
									});
								}
								const token = jwt.sign(
									{ _id: data.id },
									process.env.JWT_SECRET,
									{ expiresIn: '7d' }
								);
								const { _id, name, email } = newUser;
								res.json({ token, user: { _id, name, email } });
							});
						}
					}
				});
			}
		});
};

exports.facebookLogin = (req, res) => {
	const { accessToken, userId } = req.body;
	let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
	fetch(urlGraphFacebook, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((response) => {
			const { email, name } = response;
			User.findOne({ email }).exec((err, user) => {
				if (err) {
					return res.status(400).json({
						error: 'something went wrong'
					});
				} else {
					if (user) {
						const token = jwt.sign(
							{ _id: user.id },
							process.env.JWT_SECRET,
							{ expiresIn: '7d' }
						);
						const { _id, name, email } = user;
						res.json({ token, user: { _id, name, email } });
					} else {
						let password = email + process.env.JWT_SECRET;
						let newUser = new User({ name, email, password });
						console.log(newUser);
						newUser.save((err, data) => {
							if (err) {
								return res.status(400).json({
									error: 'something went wrong'
								});
							}
							const token = jwt.sign(
								{ _id: data._id },
								process.env.JWT_SECRET,
								{ expiresIn: '7d' }
							);
							const { _id, name, email } = data;
							res.json({ token, user: { _id, name, email } });
						});
					}
				}
			});
		});
};
