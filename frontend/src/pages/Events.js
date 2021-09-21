import React, { Component } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop.js";
import AuthContext from "../context/auth-context";
import "./Events.css";

export class EventsPage extends Component {
	state = {
		creating: false,
	};

	constructor(props) {
		super(props);

		this.titleElRef = React.createRef();
		this.priceElRef = React.createRef();
		this.dateElRef = React.createRef();
		this.descElRef = React.createRef();
	}

	static contextType = AuthContext;

	startCreateEventHandler = () => {
		this.setState({ creating: true });
	};

	modalConfirmHandler = () => {
		this.setState({ creating: false });
		const title = this.titleElRef.current.value;
		const price = +this.priceElRef.current.value;
		const date = this.dateElRef.current.value;
		const description = this.descElRef.current.value;

		if (
			title.trim().length === 0 ||
			price <= 0 ||
			date.trim().length === 0 ||
			description.trim().length === 0
		) {
			return;
		}

		const event = {
			title,
			price,
			date,
			description,
		};

		const requestBody = {
			query: `
			mutation {
				createEvent(eventInput: {title: "${title}",description: "${description}",price: "${price}",date: "${date}"}) {
					_id
					title
					description
					date
					price
					creator {
						_id
						email
					}
				}
			}
		`,
		};

		const token = this.context.token;

		fetch("http://localhost:8080/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + token,
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("failed");
				}

				return res.json();
			})
			.then((resData) => {
				console.log(resData);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	modalCancelHandler = () => {
		this.setState({ creating: false });
	};

	render() {
		return (
			<>
				{this.state.creating && <Backdrop />}
				{this.state.creating && (
					<Modal
						title="Add Event"
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.modalConfirmHandler}
					>
						<form>
							<div className="form-control">
								<label htmlFor="title">Title</label>
								<input
									type="text"
									id="title"
									ref={this.titleElRef}
								/>
							</div>
							<div className="form-control">
								<label htmlFor="price">Price</label>
								<input
									type="number"
									id="price"
									ref={this.priceElRef}
								/>
							</div>
							<div className="form-control">
								<label htmlFor="date">Date</label>
								<input
									type="datetime-local"
									id="date"
									ref={this.dateElRef}
								/>
							</div>
							<div className="form-control">
								<label htmlFor="description">Description</label>
								<textarea
									id="description"
									type="text"
									row="4"
									ref={this.descElRef}
								></textarea>
							</div>
						</form>
					</Modal>
				)}
				<div className="events-control">
					<p>Share your event</p>
					<button
						className="btn"
						onClick={this.startCreateEventHandler}
					>
						Create Event
					</button>
				</div>
			</>
		);
	}
}

export default EventsPage;
