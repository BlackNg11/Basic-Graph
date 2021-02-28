import React from "react";
import "./Auth.css";

export class AuthPage extends React.Component {
	constructor(props) {
		super(props);
		this.emailEl = React.createRef();
		this.passwordEl = React.createRef();
	}

	state = {
		isLogin: true,
	};

	switchModeHandler = () => {
		this.setState((preveState) => {
			return {
				isLogin: !preveState.isLogin,
			};
		});
	};

	submitHandler = (event) => {
		console.log(this.isLogin);
		event.preventDefault();

		const email = this.emailEl.current.value;
		const password = this.passwordEl.current.value;

		if (email.trim().length === 0 || password.trim().length === 0) {
			return;
		}

		let requestBody = {
			query: `
			query {
				login(email: "${email}",password: "${password}") {
					userId
					token
					tokenExpiration
				}
			}
		`,
		};

		if (!this.state.isLogin) {
			requestBody = {
				query: `
				mutation {
					createUser(userInput: {email: "${email}", password: "${password}"}) {
						_id
						email
					}
				}
			`,
			};
		}

		fetch("http://localhost:8080/graphql", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error("failed");
				}
				console.log(res);
				return res.json();
			})
			.then((resData) => {
				console.log(resData);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		return (
			<form className="auth-form" onSubmit={this.submitHandler}>
				<div className="form-control">
					<label htmlFor="email">Email</label>
					<input type="email" ref={this.emailEl} id="email" />
				</div>
				<div className="form-control">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						ref={this.passwordEl}
					/>
				</div>
				<div className="form-actions">
					<button type="button" onClick={this.switchModeHandler}>
						Switch To {this.state.isLogin ? "Signup" : "Login"}
					</button>
					<button type="submit">Submit</button>
				</div>
			</form>
		);
	}
}

export default AuthPage;
