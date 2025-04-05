import { Redirect, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const jwtToken = Cookies.get('jwt_token');
	return (
		<Route
			{...rest}
			render={(props) =>
				jwtToken !== undefined ? (
					<Component {...props} />
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

export default ProtectedRoute;
