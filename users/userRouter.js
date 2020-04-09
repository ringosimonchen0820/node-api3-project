const express = require('express');
const Data = require("./userDb.js")
const Post = require("../posts/postDb.js")
const router = express.Router();

router.post('/',validatePost, (req, res) => {
  // do your magic!
  const newUser = req.body

    if(newUser){
        Post.insert(newUser)
        .then(post=> {
            res.status(201).json(post)
        }).catch(err => {
        console.log(err)
        res.status(500).json({error: "There was an error while saving the user to the database"})
    })
  } else {
    res.status(400).json({ errorMessage: "Please provide name."})
  }
});

router.post('/:id/posts',validateUserId, validatePost, (req, res) => {
  // do your magic!
        Post.insert(req.body).then(response => {
            res.status(201).json(response);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({errorMessage:
                "There was an error while saving the comment to the database"
            });
          });
      })


router.get('/', (req, res) => {
  // do your magic!
  Data.get().then(data => {
    res.status(200).json(data)
  }).catch(err => {
    console.log(err)
    res.status(500).json({error: "resources could not be retrieved"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const { id } = req.params;

  Data.getById(id).then(found => {
    if(found){
      res.status(200).json(found)
    } else {
      res.status(404).json({message: "User with that id does not exist"})
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({error: "resources could not be retrieved"})
  });
})

router.get('/:id/posts',validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;

  Data.getUserPosts(id).then(found => {
      res.status(200).json(found)
  }).catch(err => {
    console.log(err)
    res.status(500).json({error: "resources could not be retrieved"})
  })
});

router.delete('/:id',validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;

  Data.remove(id).then(found => {
    if(found){
        res.status(200).json(found)
    } else {
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }
}).catch(err => {
    console.log(err)
    res.status(500).json({error: "The post could not be removed"})
})
});

router.put('/:id',validateUserId,validateUser, (req, res) => {
  // do your magic!
  const changes = req.body;
  const { id } = req.params;
        
    if(changes.name){
        Data.update(id, changes)
        .then(post => {
            if(post){
                res.status(200).json(post)
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: "The post information could not be modified." })
    })
    } else {
    res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id }= req.params;
    Data.getById(id).then(found => {
      if(found){
        next()
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
}

function validateUser(req, res, next) {
  // do your magic!
  const valUser = req.body
  const valUserName = req.body.name

  if(valUser && valUserName){
    next()
  } else if(!valUser) {
    res.status(400).json({message: "missing user data"})
  } else {
    res.status(400).json({ message: "missing required name field"})
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const valPost = req.body
  const valPostText = req.body.text

  if(valPost && valPostText){
    next()
  } else if(!valPost) {
    res.status(400).json({message: "missing user data"})
  } else {
    res.status(400).json({ message: "missing required text field"})
  }
}

//Examples
// function logger(req, res, next) {
//   console.log(`${req.method} Request to ${req.originalUrl} `);
//   next()
// }

// function gatekeeper(guess) {
//   return function(req, res, nancy) {
//     const password = req.headers.password;

//     console.log("gk headers", req.headers);

//     if (password && password.toLowerCase() === guess) {
//       nancy();
//     } else {
//       res.status(401).json({ you: "shall not pass!" });
//     }
//   };
// }
module.exports = router;