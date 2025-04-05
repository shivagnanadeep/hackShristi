import { create } from 'zustand';
import axios from 'axios';
import { User, Document, ScanResult, AuthState } from '../types';

interface Store extends AuthState {
	documents: Document[];
	scanResults: ScanResult[];
	users: User[];
	register: (name: string, email: string, password: string) => void;
	login: (email: string, password: string) => void;
	logout: () => void;
	addDocument: (doc: Document) => void;
	addScanResult: (result: ScanResult) => void;
	updateUserCredits: (userId: string, credits: number) => void;
	incrementScansToday: (userId: string) => void;
	getTopUsers: () => User[];
	findMatchingDocuments: (doc: Document) => Document[];
}

const SIMILARITY_THRESHOLD = 0.8;

function cosineSimilarity(
	vecA: Record<string, number>,
	vecB: Record<string, number>
): number {
	const dotProduct = Object.keys(vecA).reduce(
		(sum, key) => sum + (vecA[key] || 0) * (vecB[key] || 0),
		0
	);
	const magnitudeA = Math.sqrt(
		Object.values(vecA).reduce((sum, val) => sum + val * val, 0)
	);
	const magnitudeB = Math.sqrt(
		Object.values(vecB).reduce((sum, val) => sum + val * val, 0)
	);
	if (magnitudeA === 0 || magnitudeB === 0) return 0;
	return dotProduct / (magnitudeA * magnitudeB);
}

const useStore = create<Store>((set, get) => ({
	isAuthenticated: false,
	currentUser: null,
	error: null,
	documents: [
		{
			id: 'built-in-1',
			userId: 'system',
			name: 'Sample Document 1',
			content: 'This is a sample document for testing document matching.',
			uploadDate: new Date().toISOString(),
			wordFrequency: {},
			isBuiltIn: true,
		},
	],
	scanResults: [],
	users: [],

	register: async (name, email, password) => {
		try {
			const response = await axios.post('http://localhost:3000/register/', {
				name,
				email,
				password,
			});
			const user: User = {
				id: response.data.id,
				email,
				password,
				role: email.endsWith('@admin.com') ? 'admin' : 'user',
				credits: 20,
				scansToday: 0,
				lastScanDate: new Date().toISOString(),
				totalScans: 0,
			};
			set((state) => ({
				users: [...state.users, user],
				currentUser: user,
				isAuthenticated: true,
				error: null,
			}));
		} catch (err: any) {
			set({ error: err.response?.data || 'Registration failed' });
		}
	},

	login: async (email, password) => {
		try {
			const response = await axios.post('http://localhost:3000/login/', {
				email,
				password,
			});
			const userData = response.data.user;
			const jwtToken = response.data.jwtToken;

			localStorage.setItem('token', jwtToken);

			const user: User = {
				id: userData.id,
				email: userData.email,
				password: '', // we don't store password on client
				role: userData.role,
				credits: userData.credits,
				scansToday: userData.scansToday,
				lastScanDate: userData.lastScanDate,
				totalScans: userData.totalScans,
			};

			set((state) => ({
				users: [...state.users, user],
				currentUser: user,
				isAuthenticated: true,
				error: null,
			}));
		} catch (err: any) {
			set({ error: err.response?.data || 'Login failed' });
		}
	},

	logout: () => {
		localStorage.removeItem('token');
		set({ currentUser: null, isAuthenticated: false, error: null });
	},

	addDocument: (doc) =>
		set((state) => ({
			documents: [...state.documents, doc],
		})),

	addScanResult: (result) =>
		set((state) => ({
			scanResults: [...state.scanResults, result],
		})),

	updateUserCredits: (userId, credits) =>
		set((state) => ({
			users: state.users.map((user) =>
				user.id === userId ? { ...user, credits } : user
			),
		})),

	incrementScansToday: (userId) =>
		set((state) => ({
			users: state.users.map((user) =>
				user.id === userId
					? {
							...user,
							scansToday: user.scansToday + 1,
							credits: user.credits - 1,
							totalScans: (user.totalScans || 0) + 1,
					  }
					: user
			),
		})),

	getTopUsers: () => {
		const { users } = get();
		return [...users]
			.sort((a, b) => (b.totalScans || 0) - (a.totalScans || 0))
			.slice(0, 5);
	},

	findMatchingDocuments: (doc: Document) => {
		const { documents } = get();
		const builtInDocs = documents.filter((d) => d.isBuiltIn);

		return builtInDocs.filter((builtInDoc) => {
			const similarity = cosineSimilarity(
				doc.wordFrequency,
				builtInDoc.wordFrequency
			);
			return similarity >= SIMILARITY_THRESHOLD;
		});
	},
}));

export default useStore;
