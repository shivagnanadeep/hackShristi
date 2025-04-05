import { Component } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

class LoginForm extends Component {
	state = {
		email: '',
		password: '',
		showError: false,
		errorMsg: '',
	};

	onChangeEmail = (e) => this.setState({ email: e.target.value });
	onChangePassword = (e) => this.setState({ password: e.target.value });

	onLoginSuccess = (jwtToken) => {
		const { history } = this.props;
		Cookies.set('jwt_token', jwtToken, { expires: 30 });
		history.replace('/');
	};

	onLoginFailure = (errorMsg) => {
		this.setState({ showError: true, errorMsg });
	};

	onSubmitLogin = async (e) => {
		e.preventDefault();
		const { email, password } = this.state;
		const userDetails = { email, password };

		const response = await fetch('http://localhost:3001/login/', {
			method: 'POST',
			body: JSON.stringify(userDetails),
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.ok) {
			const data = await response.json();
			this.onLoginSuccess(data.jwtToken);
		} else {
			const data = await response.text();
			this.onLoginFailure(data);
		}
	};

	render() {
		const { email, password, showError, errorMsg } = this.state;
		const jwtToken = Cookies.get('jwt_token');
		if (jwtToken !== undefined) return <Redirect to="/" />;

		return (
			<div className="login-form-main-container">
				<form
					className="login-form"
					onSubmit={this.onSubmitLogin}
				>
					<h2 className="form-title">Login</h2>
					<div className="login-form-input-container">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							className="login-form-input"
							id="email"
							value={email}
							onChange={this.onChangeEmail}
							placeholder="Enter email"
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
							placeholder="Enter password"
							required
						/>
					</div>
					<button
						type="submit"
						className="login-button"
					>
						Login
					</button>
					{showError && <p className="login-error-msg">*{errorMsg}</p>}
					<p className="redirect-text">
						Don't have an account? <Link to="/register">Register here</Link>
					</p>
				</form>
			</div>
		);
	}
}

export default withRouter(LoginForm);
