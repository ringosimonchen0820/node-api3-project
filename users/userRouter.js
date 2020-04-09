const express = require('express');
const userDB = require('./userDb');
const postDB = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
	res.status(201).json(req.user);
});

router.post('/:id/posts', validateUserID, validatePost, (req, res) => {
	res.status(200).json({message: 'comment posted'});
});

router.get('/', (req, res) => {
	userDB
		.get()
		.then(users => {
			res.status(200).json({ querySting: req.query, users });
		})
		.catch(error => {
			res.status(500).json({message: 'Error retrieving users'});
		});
});

router.get('/:id', validateUserID, (req, res) => {
	res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserID, (req, res) => {
	userDB
		.getUserPosts(req.user.id)
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(error => {
			res.status(500).json({message: 'Error retrieving user posts'});
		});
});

router.delete('/:id', validateUserID, (req, res) => {
	res.status(200).json(req.user);
});

router.put('/:id', validateUserID, (req, res) => {
	const {id} = req.params;
	const changes = req.body;
	if (!changes.name) {
		res.status(400).json({message: 'Failed provide the name of user'});
	} else {
		userDB
			.update(id, changes)
			.then(user => {
				res.status(200).json(user);
			})
			.catch(error => {
				res.status(500).json({error: 'Failed to update user name'});
			});
	}
});

//custom middleware

function validateUserID(req, res, next) {
	userDB
		.getById(req.params.id)
		.then(user => {
			req.user = user;
			user.id
				? next()
				: res.status(400).json({error: 'User id not formated correctly'});
		})
		.catch(error => res.status(404).json({error: error}));
}

function validateUser(req, res, next) {
	!req.body
		? res.status(400).json({message: 'missing user data'})
		: !req.body.name
		? res.status(400).json({message: 'missing required name field'})
		: userDB
				.insert(req.body)
				.then(user => {
					req.user = user;
					next();
				})
				.catch(error => {
					res.status(500).json({message: 'Error retrieving user posts'});
				});
}

function validatePost(req, res, next) {
	!req.body
		? res.status(400).json({message: 'missing user data'})
		: !req.body.text
		? res.status(400).json({message: 'missing required text field'})
		: (req.post =
				req.body.text &
				postDB
					.insert(req.user)
					.then(next())
					.catch(err => res.status(500).json({error: 'error'})));
}

module.exports = router;