const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Models
const User = require("../../models/user");

const transformBooking = (booking) => {
	return {
		...booking._doc,
		_id: booking._id,
		user: user.bind(this, booking._doc.user),
		event: singleEvent.bind(this, booking._doc.event),
		createdAt: dateToString(booking._doc.createdAt),
		updatedAt: dateToString(booking._doc.updatedAt),
	};
};

module.exports = {
	createUser: async (args) => {
		try {
			const existingUser = await User.findOne({
				email: args.userInput.email,
			});

			if (existingUser) {
				throw new Error("User exists already.");
			}

			const hashedPassword = await bcrypt.hash(
				args.userInput.password,
				12
			);

			const user = new User({
				email: args.userInput.email,
				password: hashedPassword,
			});

			const result = await user.save();
			return {
				...result._doc,
				password: null,
				_id: result.id,
			};
		} catch (err) {
			throw err;
		}
	},
	login: async ({ email, password }) => {
		const user = await User.findOne({ email: email });
		if (!user) {
			throw new Error("User does not exist");
		}
		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			throw new Error("Invalid");
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			"supersercretkey",
			{
				expiresIn: "1h",
			}
		);

		return {
			userId: user.id,
			token,
			tokenExpiration: 1,
		};
	},
};
