const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const databasePath = path.join(__dirname, 'database.db');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
let database = null;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const multer = require('multer');
const fs = require('fs');
uploadFolder = path.join(__dirname, 'uploads');
const upload = multer({ dest: uploadFolder });

const clearUploadsFolder = () => {
	const uploadDir = path.join(__dirname, 'uploads');

	fs.readdir(uploadDir, (err, files) => {
		if (err) {
			console.error('Error reading upload folder:', err);
			return;
		}

		for (const file of files) {
			const filePath = path.join(uploadDir, file);
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(`Error deleting file ${filePath}:`, err);
				} else {
					console.log(`Deleted file: ${filePath}`);
				}
			});
		}
	});
};

const initializeDatabaseAndServer = async () => {
	try {
		database = await open({
			filename: databasePath,
			driver: sqlite3.Database,
		});
		app.listen(3000, () => {
			console.log('server running succesfully in 3000......');
		});
	} catch (e) {
		console.log(`DATABASE ERROR : ${e}`);
		process.exit(1);
	}
};

initializeDatabaseAndServer();

const authenticateJwtToken = (request, response, next) => {
	const authHeaders = request.headers['authorization'];
	let jwtToken;
	if (authHeaders !== undefined) {
		jwtToken = authHeaders.split(' ')[1];
	}
	if (jwtToken === undefined) {
		response.status(401);
		response.send('Invalid JWT Token');
	} else {
		jwt.verify(jwtToken, 'MYSECRETKEY', (error, payload) => {
			if (error) {
				response.status(401);
				response.send('Invalid JWT Token');
			} else {
				request.email = payload.email;
				request.credits = payload.credits;
				next();
			}
		});
	}
};

app.post('/register/', async (request, response) => {
	const { name, password, email } = request.body;
	userGetQuery = `
	SELECT * FROM users WHERE email LIKE '${email}';`;
	const dbUser = await database.get(userGetQuery);
	if (dbUser !== undefined) {
		response.status(400);
		response.send('User already exists');
	} else {
		if (password.length < 6) {
			response.status(400);
			response.send('Password is too short');
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const createNewUserQuery = `
      INSERT INTO users(name,email,password)
       VALUES ('${name}','${email}','${hashedPassword}');
      `;
			const dbResponse = await database.run(createNewUserQuery);
			console.log(dbResponse.id);
			response.status(200);
			response.send('User created succesfully');
		}
	}
});

app.post('/login/', async (request, response) => {
	const { email, password } = request.body;
	const checkUserQuery = `
  	SELECT * FROM users WHERE email LIKE '${email}';`;
	const dbUser = await database.get(checkUserQuery);
	if (dbUser === undefined) {
		response.status(400);
		response.send('Invalid user');
	} else {
		const isMatched = await bcrypt.compare(password, dbUser.password);
		if (isMatched === true) {
			const payload = {
				email: email,
				credits: dbUser.credits,
			};
			const jwtToken = jwt.sign(payload, 'MYSECRETKEY');
			response.send({ jwtToken });
		} else {
			response.status(400);
			response.send('Invalid password');
		}
	}
});

app.post('/upload', authenticateJwtToken, upload.single('file'), (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).send('No file uploaded');
		}

		const filePath = req.file.path;
		const originalName = req.file.originalname;

		console.log(`File uploaded by ${req.email}:`, originalName);
		console.log('Temporarily saved at:', filePath);

		// TODO: Run ML processing here...

		// Clear all files after processing (optional: delay or on success)
		clearUploadsFolder();

		res.status(200).send({
			message: 'File uploaded and processed successfully',
			originalName,
			savedPath: filePath,
		});
	} catch (error) {
		console.error('Upload Error:', error);
		res.status(500).send('Internal Server Error');
	}
});

// This runs every day at 12:00 AM
cron.schedule('0 0 * * *', () => {
	clearUploadsFolder();
	db.run('UPDATE users SET credits = 20', function (err) {
		if (err) {
			console.error('Error resetting credits:', err.message);
		} else {
			console.log('Credits reset to 20 for all users');
		}
	});
});
module.exports = app;
