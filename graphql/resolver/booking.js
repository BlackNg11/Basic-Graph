const { singleEvent, user } = require("./merge.js");
const { transformBooking, transformEvent } = require("./merge.js");

//Models
const Booking = require("../../models/booking");
const Event = require("../../models/event");

module.exports = {
	bookings: async () => {
		try {
			const bookings = await Booking.find();
			return bookings.map((booking) => {
				return transformBooking(booking);
			});
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
		return transformBooking(result);
	},
	cancleBooking: async (args) => {
		try {
			const booking = await Booking.findById(args.bookingId).populate(
				"event"
			);
			const event = transformEvent(booking.event);
			await Booking.deleteOne({ _id: args.bookingId });
			return event;
		} catch (err) {
			throw err;
		}
	},
};
