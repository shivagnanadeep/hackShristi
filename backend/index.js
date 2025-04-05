// const express = require('express');
// const app = express();
// const cors = require('cors');
// app.use(cors());
// app.use(express.json());
// const path = require('path');
// const databasePath = path.join(__dirname, 'database.db');
// const { open } = require('sqlite');
// const sqlite3 = require('sqlite3');
// let database = null;
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const cron = require('node-cron');
// const fs = require('fs');
// const { spawn } = require('child_process');
// const natural = require('natural');
// const { WordNet } = require('natural');
// const { TfIdf } = require('natural');

// const DB_PATH = 'database.db';
// const MATCH_THRESHOLD = 0.7;

// class WordNetMatcher {
// 	constructor() {
// 		this.db = new sqlite3.Database(DB_PATH);
// 		this.wordnet = new WordNet();
// 	}

// 	getSynonyms(word) {
// 		return new Promise((resolve) => {
// 			this.wordnet.lookup(word, (results) => {
// 				const synonyms = new Set();
// 				results.forEach((result) => {
// 					result.synonyms.forEach((syn) => {
// 						synonyms.add(syn);
// 					});
// 				});
// 				resolve(Array.from(synonyms));
// 			});
// 		});
// 	}

// 	async preprocess(text) {
// 		const tokenizer = new natural.WordTokenizer();
// 		const words = tokenizer.tokenize(text.toLowerCase());
// 		const expandedWords = [];

// 		for (const word of words) {
// 			expandedWords.push(word);
// 			const synonyms = await this.getSynonyms(word);
// 			expandedWords.push(...synonyms);
// 		}

// 		return expandedWords.join(' ');
// 	}

// 	loadDocumentsFromDb() {
// 		return new Promise((resolve, reject) => {
// 			this.db.all('SELECT filename, content FROM document', [], (err, rows) => {
// 				if (err) {
// 					reject(err);
// 				} else {
// 					const filenames = rows.map((row) => row.filepath);
// 					const contents = rows.map((row) => row.content);
// 					resolve({ contents, filenames });
// 				}
// 			});
// 		});
// 	}

// 	async matchDocument(uploadedText, docs, filenames) {
// 		const processedDocs = await Promise.all(
// 			docs.map((doc) => this.preprocess(doc))
// 		);
// 		const processedUploaded = await this.preprocess(uploadedText);

// 		const tfidf = new TfIdf();
// 		processedDocs.forEach((doc) => tfidf.addDocument(doc));
// 		tfidf.addDocument(processedUploaded);

// 		const similarityScores = [];
// 		for (let i = 0; i < processedDocs.length; i++) {
// 			const score = tfidf.tfidfs[i];
// 			similarityScores.push(score);
// 		}

// 		for (let i = 0; i < similarityScores.length; i++) {
// 			if (similarityScores[i] >= MATCH_THRESHOLD) {
// 				return {
// 					matched_file: filenames[i],
// 					match_percentage: Math.round(similarityScores[i] * 100),
// 					matched_content: docs[i],
// 				};
// 			}
// 		}

// 		return {
// 			matched_file: null,
// 			match_percentage: 0.0,
// 			matched_content: null,
// 		};
// 	}

// 	async run(content) {
// 		const uploadedText = content;

// 		if (!uploadedText) {
// 			return {
// 				matched_file: null,
// 				match_percentage: 0.0,
// 				matched_content: null,
// 			};
// 		}

// 		const { contents: docs, filenames } = await this.loadDocumentsFromDb();

// 		if (!docs.length) {
// 			return {
// 				matched_file: null,
// 				match_percentage: 0.0,
// 				matched_content: null,
// 			};
// 		}

// 		const result = await this.matchDocument(uploadedText, docs, filenames);
// 		this.db.close();
// 		return result;
// 	}
// }

// const initializeDatabaseAndServer = async () => {
// 	try {
// 		database = await open({
// 			filename: databasePath,
// 			driver: sqlite3.Database,
// 		});
// 		app.listen(3001, () => {
// 			console.log('server running succesfully in 3001......');
// 		});
// 	} catch (e) {
// 		console.log(`DATABASE ERROR : ${e}`);
// 		process.exit(1);
// 	}
// };

// initializeDatabaseAndServer();

// const authenticateJwtToken = (request, response, next) => {
// 	const authHeaders = request.headers['authorization'];
// 	let jwtToken;
// 	if (authHeaders !== undefined) {
// 		jwtToken = authHeaders.split(' ')[1];
// 	}
// 	if (jwtToken === undefined) {
// 		response.status(401);
// 		response.send('Invalid JWT Token');
// 	} else {
// 		jwt.verify(jwtToken, 'MYSECRETKEY', (error, payload) => {
// 			if (error) {
// 				response.status(401);
// 				response.send('Invalid JWT Token');
// 			} else {
// 				request.email = payload.email;
// 				request.credits = payload.credits;
// 				next();
// 			}
// 		});
// 	}
// };

// app.post('/register/', async (request, response) => {
// 	const { name, password, email } = request.body;
// 	userGetQuery = `
// 	SELECT * FROM users WHERE email LIKE '${email}';`;
// 	const dbUser = await database.get(userGetQuery);
// 	if (dbUser !== undefined) {
// 		response.status(400);
// 		response.send('User already exists');
// 	} else {
// 		if (password.length < 6) {
// 			response.status(400);
// 			response.send('Password is too short');
// 		} else {
// 			const hashedPassword = await bcrypt.hash(password, 10);
// 			const createNewUserQuery = `
//       INSERT INTO users(name,email,password)
//        VALUES ('${name}','${email}','${hashedPassword}');
//       `;
// 			const dbResponse = await database.run(createNewUserQuery);
// 			console.log(dbResponse.id);
// 			response.status(200);
// 			response.send('User created succesfully');
// 		}
// 	}
// });

// app.post('/login/', async (request, response) => {
// 	const { email, password } = request.body;
// 	const checkUserQuery = `
//   	SELECT * FROM users WHERE email LIKE '${email}';`;
// 	const dbUser = await database.get(checkUserQuery);
// 	if (dbUser === undefined) {
// 		response.status(400);
// 		response.send('Invalid user');
// 	} else {
// 		const isMatched = await bcrypt.compare(password, dbUser.password);
// 		if (isMatched === true) {
// 			const payload = {
// 				email: email,
// 				credits: dbUser.credits,
// 			};
// 			const jwtToken = jwt.sign(payload, 'MYSECRETKEY');
// 			response.send({ jwtToken });
// 		} else {
// 			response.status(400);
// 			response.send('Invalid password');
// 		}
// 	}
// });

// // POST endpoint to receive file content and filename
// app.post('/process', authenticateJwtToken, async (req, res) => {
// 	const { filename, content } = req.body;

// 	if (!filename || !content) {
// 		return res.status(400).json({ error: 'Filename and content are required' });
// 	}

// 	try {
// 		const matcher = new WordNetMatcher();
// 		const result = await matcher.run(content);
// 		res.send(result);
// 	} catch (err) {
// 		console.error('Error in processing:', err);
// 		res.status(500).send({ error: 'Internal Server Error' });
// 	}
// });

// // This runs every day at 12:00 AM
// cron.schedule('0 0 * * *', () => {
// 	clearUploadsFolder();
// 	database.run('UPDATE users SET credits = 20', function (err) {
// 		if (err) {
// 			console.error('Error resetting credits:', err.message);
// 		} else {
// 			console.log('Credits reset to 20 for all users');
// 		}
// 	});
// });
// module.exports = app;
const express = require('express');
const cors = require('cors');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const natural = require('natural');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const databasePath = path.join(__dirname, 'database.db');
let database = null;

const DB_PATH = 'database.db';
const MATCH_THRESHOLD = 0.7;
const JWT_SECRET = 'MYSECRETKEY';
const DEFAULT_CREDITS = 20;

// ---------------------- WordNetMatcher Class ----------------------

class WordNetMatcher {
	constructor(db) {
		this.db = db;
		this.wordnet = new natural.WordNet();
		this.tokenizer = new natural.WordTokenizer();
	}

	getSynonyms(word) {
		return new Promise((resolve) => {
			this.wordnet.lookup(word, (results) => {
				const synonyms = new Set();
				results.forEach((result) => {
					result.synonyms.forEach((syn) => synonyms.add(syn));
				});
				resolve(Array.from(synonyms));
			});
		});
	}

	async preprocess(text) {
		const words = this.tokenizer.tokenize(text.toLowerCase());
		const expandedWords = [];

		for (const word of words) {
			expandedWords.push(word);
			const synonyms = await this.getSynonyms(word);
			expandedWords.push(...synonyms);
		}

		return expandedWords.join(' ');
	}

	async loadDocumentsFromDb() {
		const rows = await this.db.all('SELECT filename, content FROM document');
		return {
			filenames: rows.map((row) => row.filename),
			contents: rows.map((row) => row.content),
		};
	}

	async matchDocument(uploadedText, docs, filenames) {
		const tfidf = new natural.TfIdf();
		const processedDocs = await Promise.all(
			docs.map((doc) => this.preprocess(doc))
		);
		const processedUploaded = await this.preprocess(uploadedText);

		processedDocs.forEach((doc) => tfidf.addDocument(doc));
		tfidf.addDocument(processedUploaded);

		let bestMatchIndex = -1;
		let bestScore = 0;

		processedDocs.forEach((_, i) => {
			const score = tfidf.tfidf(processedUploaded, i);
			if (score > bestScore) {
				bestScore = score;
				bestMatchIndex = i;
			}
		});

		if (bestScore >= MATCH_THRESHOLD) {
			return {
				matched_file: filenames[bestMatchIndex],
				match_percentage: Math.round(bestScore * 100),
				matched_content: docs[bestMatchIndex],
			};
		}

		return {
			matched_file: null,
			match_percentage: 0.0,
			matched_content: null,
		};
	}

	async run(content) {
		if (!content) {
			return {
				matched_file: null,
				match_percentage: 0.0,
				matched_content: null,
			};
		}

		const { contents, filenames } = await this.loadDocumentsFromDb();
		if (!contents.length) {
			return {
				matched_file: null,
				match_percentage: 0.0,
				matched_content: null,
			};
		}

		return await this.matchDocument(content, contents, filenames);
	}
}

// ---------------------- JWT Middleware ----------------------

const authenticateJwtToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) return res.status(401).send('Invalid JWT Token');

	const jwtToken = authHeader.split(' ')[1];
	jwt.verify(jwtToken, JWT_SECRET, (error, payload) => {
		if (error) return res.status(401).send('Invalid JWT Token');
		req.user = payload;
		next();
	});
};

// ---------------------- API Routes ----------------------

app.post('/register/', async (req, res) => {
	const { name, password, email } = req.body;
	if (password.length < 6) return res.status(400).send('Password is too short');

	const userExists = await database.get(`SELECT * FROM users WHERE email = ?`, [
		email,
	]);
	if (userExists) return res.status(400).send('User already exists');

	const hashedPassword = await bcrypt.hash(password, 10);
	await database.run(
		`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
		[name, email, hashedPassword]
	);

	res.status(200).send('User created successfully');
});

app.post('/login/', async (req, res) => {
	const { email, password } = req.body;
	const dbUser = await database.get(`SELECT * FROM users WHERE email = ?`, [
		email,
	]);

	if (!dbUser) return res.status(400).send('Invalid user');

	const isMatched = await bcrypt.compare(password, dbUser.password);
	if (!isMatched) return res.status(400).send('Invalid password');

	const payload = { email: dbUser.email, credits: dbUser.credits };
	const jwtToken = jwt.sign(payload, JWT_SECRET);
	res.send({ jwtToken });
});

app.post('/process', authenticateJwtToken, async (req, res) => {
	const { filename, content } = req.body;
	if (!filename || !content) {
		return res.status(400).json({ error: 'Filename and content are required' });
	}

	try {
		const matcher = new WordNetMatcher(database);
		const result = await matcher.run(content);
		res.send(result);
	} catch (err) {
		console.error('Processing error:', err);
		res.status(500).send({ error: 'Internal Server Error' });
	}
});

// ---------------------- Daily Cron Job ----------------------

cron.schedule('0 0 * * *', () => {
	console.log('Running daily reset task...');
	fs.rmSync(path.join(__dirname, 'uploads'), { recursive: true, force: true });

	database.run(`UPDATE users SET credits = ?`, [DEFAULT_CREDITS], (err) => {
		if (err) {
			console.error('Credit reset error:', err.message);
		} else {
			console.log('Credits reset to', DEFAULT_CREDITS);
		}
	});
});

// ---------------------- Server Init ----------------------

const initializeDatabaseAndServer = async () => {
	try {
		database = await open({
			filename: databasePath,
			driver: sqlite3.Database,
		});
		app.listen(3001, () => console.log('Server running on port 3001...'));
	} catch (error) {
		console.error(`DB Error: ${error.message}`);
		process.exit(1);
	}
};

initializeDatabaseAndServer();

module.exports = app;
