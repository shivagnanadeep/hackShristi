// import React, { useState } from 'react';
// import { UserPlus } from 'lucide-react';
// import useStore from '../../store/useStore';

// interface RegisterFormProps {
//   onToggleForm: () => void;
// }

// const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const { register, error } = useStore();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       useStore.setState({ error: 'Passwords do not match' });
//       return;
//     }
//     register(email, password);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         <div className="text-center">
//           <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an account</h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Join us to start scanning documents
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
//             {error}
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label htmlFor="email" className="sr-only">Email address</label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//             </div>
//             <div>
//               <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 required
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Confirm Password"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Create account
//             </button>
//           </div>
//         </form>

//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <button
//               onClick={onToggleForm}
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               Sign in here
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterForm;

import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import useStore from '../../store/useStore';

interface RegisterFormProps {
	onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
	const [name, setName] = useState(''); // Added state for name
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	// const { register, error } = useStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			useStore.setState({ error: 'Passwords do not match' });
			return;
		}
		const url = 'http://localhost:3000/register/';
		const userDetails = { name, email, password };
		const options = {
			method: 'POST',
			body: JSON.stringify(userDetails),
		};
		const response = await fetch(url, options);
		const data = await response.json();
		console.log(response, data);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
				<div className="text-center">
					<UserPlus className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Create an account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Join us to start scanning documents
					</p>
				</div>

				{/* {error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
						{error}
					</div>
				)} */}

				<form
					className="mt-8 space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label
								htmlFor="name"
								className="sr-only"
							>
								Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Name"
							/>
						</div>
						<div>
							<label
								htmlFor="email"
								className="sr-only"
							>
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="sr-only"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
						</div>
						<div>
							<label
								htmlFor="confirmPassword"
								className="sr-only"
							>
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Confirm Password"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Create account
						</button>
					</div>
				</form>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{' '}
						<button
							onClick={onToggleForm}
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Sign in here
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterForm;
