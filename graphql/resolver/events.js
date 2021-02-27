const { transformEvent } = require("./merge.js");

const Event = require("../../models/event");

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return events.map((event) => {
				return transformEvent(event);
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
			date: dateToString(args.eventInput.date),
			creator: "6038b5824d048e2d34f2ee9d",
		});
		let createdEvent;

		try {
			const result = await event.save();
			createdEvent = transformEvent(result);
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
};
