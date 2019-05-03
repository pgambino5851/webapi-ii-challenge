const express = require('express');
const db = require('../data/db')
const router = express.Router();
const sendUserError = (status, message, res) => {
    // This is just a helper method that we'll use for sending errors when things go wrong.
    res.status(status).json({ errorMessage: message });
    return;
  };


router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({error: "The posts information could not be retrieved"})
    })
})

router.get('/:id', (req, res) => {
    const postId = req.params.id;
    db.findById(postId)
    .then(post => {
        if(post.length === 0) {
            res.status(404).json({message: "The post with the specified ID does not exist."})
            return;
        }
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

router.post('/', (req, res) => {
    // const { title, contents } = req.body;
    const postInfo = req.body;
    console.log("Post info:", postInfo)
    if(!postInfo.title || !postInfo.contents) {
        sendUserError(400, "Please provide title and contents for the post.", res);
        return;
    }
    db.insert(postInfo)
    .then(post => {
        res.status(201).json(post);
    })
    .catch(err => {
        sendUserError(500, "There was an error while saving the post to the database", err)
    })
})

router.put('/:id', (req, res) => {
    const postId = req.params.id;
    const {title, contents} = req.body;
    const postInfo = req.body;
    if(!title || !contents) {
        sendUserError(400, "Please provide title and contents for the post.", res);
        return;
    }
    db.update(postId, {title, contents})
    .then(post => {
        if(post.length === 0) {
            sendUserError(404, "User with specified ID does not exist", res);
            return;
        }
    })
    .catch(err => {
        sendUserError(500, "post information could not be modifed", err)
    })

    db.findById(postId)
    .then(post => {
        if(post.length === 0) {
            sendUserError(404, 'Post with specified ID not found', res);
            return;
        }
        res.status(200).json(post)
    })
})

router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    db.remove(userId)
    .then(post => {
        if(post.length === 0) {
            res.status(404).json({message: "The post with the specified ID does not exist." })
            return;
        }
        res.status(200).json({message: `User ${postId} has successfully been deleted`})
    })
    .catch(err => {
        console.log("error:", err);
        res.status(500).json({error: "The post could not be removed"})
    })
})

// router.post("/", (req, res) => {
//     const post = req.body;
//     console.log("Post info:", post)
//     if (post.title && post.contents) {
//       db.insert(post)
//         .then(post => {
//           res.status(200).json(post);
//         })
//         .catch(err => {
//           res.status(500).json({
//             message: "Error retrieving the posts"
//           });
//         });
//     } else {
//       res.status(400).json({
//         errorMessage: "There was an error while saving the post to the database."
//       });
//     }
//   });



module.exports = router