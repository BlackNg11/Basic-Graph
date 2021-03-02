import React from "react";
import Modal from "../components/Modal/Modal";

export class EventsPage extends React.Component {
	render() {
		return (
			<>
				<Modal title="Add Event" canCancel canConfirm>
					<p>Modal Cotent</p>
				</Modal>
				<div className="events-control">
					<p>Share your event</p>
					<button className="btn">Create Event</button>
				</div>
			</>
		);
	}
}

export default EventsPage;
