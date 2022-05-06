const express = require('express');
const { find, findById, insert, update, remove } = require("./users/model");

const server = express();

server.use(express.json());

server.route('/api/users')
    .get( (req, res) => {
        find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(() => {
            res.status(500).json({message: "The users information could not be retrieved"});
        })
    })
    .post( (req, res) => {
        const {name, bio} = req.body;
        if (!name || !bio) {
            res.status(400).json({message: "Please provide name and bio for the user"});
        } else {
        insert({name, bio})
        .then(confirm => res.status(201).json(confirm))
        .catch(() => res.status(500).json({message: "There was an error while saving the user to the database"}))
        }
    });

    server.route('/api/users/:userId')
    .get( (req, res) => {
        findById(req.params.userId)
        .then(user => {
            res.status(user ? 200 : 404).json(user ? user : {message: "The user with the specified ID does not exist"});
        })
        .catch(() => {
            res.status(500).json({message: "The user information could not be retrieved"});
        })
    })
    .put( (req, res) => {
        const {name, bio} = req.body;
        if (!name || !bio) {
            res.status(400).json({message: "Please provide name and bio for the user"});
        } else {
        update(req.params.userId,{name, bio})
        .then(confirm => res.status(confirm ? 200 : 404).json(confirm ? confirm : {message: "The user with the specified ID does not exist"}))
        .catch(() => res.status(500).json({message: "The user information could not be modified"}))
        }
    })
    .delete( (req, res) => {
        remove(req.params.userId)
        .then(user => {
            res.status(user ? 200 : 404).json(user ? user : {message: "The user with the specified ID does not exist"});
        })
        .catch(() => {
            res.status(500).json({message: "The user information could not be removed"});
        })
    });



module.exports = server;