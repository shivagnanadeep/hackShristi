import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import LoginForm from './components/Loginform';
import Register from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
// import HomePage from './components/HomePage';
// import { Redirect } from 'react-router-dom';

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
	<BrowserRouter>
		<Switch>
			<Route
				path="/login"
				exact
				component={LoginForm}
			/>
			<Route
				path="/register"
				exact
				component={Register}
			/>
			<ProtectedRoute
				path="/"
				exact
				component={HomePage}
			/>
		</Switch>
	</BrowserRouter>
);

export default App;
