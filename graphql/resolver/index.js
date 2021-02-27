const bcrypt = require("bcryptjs");

//ModelsModels
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

// Just Return
const user = (userId) => {
	return User.findById(userId)
		.then((user) => {
			return {
				...user._doc,
				_id: userId.id,
				createdEvents: events.bind(this, user._doc.createdEvents),
			};
		})
		.catch((err) => {
			throw err;
			console.log("a");
		});
};

//Using asynce await
const events = async (eventIds) => {
	try {
		const events = await Event.find({ _id: { $in: eventIds } });

		return events.map((event) => {
			return {
				...event._doc,
				_id: event.id,
				creator: user.bind(this, event.creator),
			};
		});
	} catch (err) {
		throw err;
	}
};

const singleEvent = async (eventId) => {
	try {
		const event = await Event.findById(eventId);
		return {
			...event._doc,
			_id: event.id,
			creator: user.bind(this, event._doc.creator),
		};
	} catch (err) {
		throw err;
	}
};

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return events.map((event) => {
				return {
					...event._doc,
					_id: event.id,
					date: new Date(event._doc.date).toISOString(),
					creator: user.bind(this, event._doc.creator),
				};
			});
		} catch (err) {
			throw err;
		}
	},

	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map((booking) => {
				return {
					...booking._doc,
					_id: booking.id,
					user: user.bind(this, booking._doc.user),
					event: singleEvent.bind(this, booking._doc.event),
					createdAt: new Date(booking._doc.createdAt).toISOString(),
					updatedAt: new Date(booking._doc.updatedAt).toISOString(),
				};
			});
		} catch (err) {
			throw err;
		}
	},

	createEvent: async (args) => {
		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			creator: "6038b5824d048e2d34f2ee9d",
		});
		let createdEvent;

		try {
			await event.save();
			createdEvent = {
				...result._doc,
				_id: result._doc._id.toString(),
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, result._doc.creator),
			};
			const creator = await User.findById("6038b5824d048e2d34f2ee9d");

			if (!creator) {
				throw new Error("User not found.");
			}
			creator.createdEvents.push(event);
			await creator.save();

			return createdEvent;
		} catch (err) {
			throw err;
		}
	},
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
	bookEvent: async (args) => {
		const featchEvent = await Event.findOne({ _id: args.eventId });
		const booking = new Booking({
			user: "6038b5824d048e2d34f2ee9d",
			event: featchEvent,
		});
		const result = await booking.save();
		return {
			...result._doc,
			_id: result._id,
			user: user.bind(this, booking._doc.user),
			event: singleEvent.bind(this, booking._doc.event),
			createdAt: new Date(result._doc.createdAt).toISOString(),
			updatedAt: new Date(result._doc.updatedAt).toISOString(),
		};
	},
	cancleBooking: async (args) => {
		try {
			const booking = await Booking.findById(args.bookingId).populate(
				"event"
			);
			const event = {
				...booking.event._doc,
				_id: booking.event.id,
				creator: user.bind(this, booking._doc.creator),
			};
			await Booking.deleteOne({ _id: args.bookingId });
			return event;
		} catch (err) {
			throw err;
		}
	},
};
