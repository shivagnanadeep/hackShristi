import { Component } from 'react';
import { Link } from 'react-router-dom';

class RegisterForm extends Component {
	state = {
		name: '',
		email: '',
		password: '',
		showError: false,
		errorMsg: '',
	};

	onChangeName = (e) => this.setState({ name: e.target.value });
	onChangeEmail = (e) => this.setState({ email: e.target.value });
	onChangePassword = (e) => this.setState({ password: e.target.value });

	onSubmitRegister = async (e) => {
		e.preventDefault();
		const { name, email, password } = this.state;
		const userDetails = { name, email, password };

		const response = await fetch('http://localhost:3001/register/', {
			method: 'POST',
			body: JSON.stringify(userDetails),
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await response.text();

		if (response.ok) {
			alert('Registered Successfully');
			this.setState({ name: '', email: '', password: '', showError: false });
		} else {
			this.setState({ showError: true, errorMsg: data });
		}
	};

	render() {
		const { name, email, password, showError, errorMsg } = this.state;

		return (
			<div className="login-form-main-container">
				<form
					className="login-form"
					onSubmit={this.onSubmitRegister}
				>
					<h2 className="form-title">Register</h2>
					<div className="login-form-input-container">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							className="login-form-input"
							id="name"
							value={name}
							onChange={this.onChangeName}
							placeholder="Enter your name"
							required
						/>
					</div>
					<div className="login-form-input-container">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							className="login-form-input"
							id="email"
							value={email}
							onChange={this.onChangeEmail}
							placeholder="Enter your email"
							required
						/>
					</div>
					<div className="login-form-input-container">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							className="login-form-input"
							id="password"
							value={password}
							onChange={this.onChangePassword}
							placeholder="Password (min 6 chars)"
							required
						/>
					</div>
					<button
						type="submit"
						className="login-button"
					>
						Register
					</button>
					{showError && <p className="login-error-msg">*{errorMsg}</p>}
					<p className="redirect-text">
						Already have an account? <Link to="/login">Login here</Link>
					</p>
				</form>
			</div>
		);
	}
}

export default RegisterForm;
