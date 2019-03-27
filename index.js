const express = require('express'),
    mongojs = require('mongojs'),
    uniqid = require('uniqid'),
    app = express(),
    http = require('http').Server(app)

const db = mongojs('localhost/react-todo', ['todo'])
const s = http.listen(process.env.PORT || 3001, function () { })

app.get("/api/", async (req, res) => res.json(createBody(null, { version: 1 })))

app.get("/api/todo/:id", async (req, res) => {
    db.todo.findOne({ id: req.params.id }, (err, doc) => {
        if(doc == null) return res.json(createBody('not found'))
        res.json(createBody(err, { text: doc }))
    })
})

app.get("/api/todo", async (req, res) => {
    db.todo.find((err, doc) => res.json(createBody(err, { text: doc })))
})

app.post("/api/todo", async (req, res) => {
    db.todo.insert({ id: uniqid() , text: req.body.text }, err => res.json(createBody(err, {})))
})

app.delete("/api/todo", async (req, res) => {
    db.todo.remove({ id: req.body.id }, err => res.json(createBody(err, {})))
})

app.put("/api/todo", async (req, res) => {
    db.todo.update({ id: req.body.id }, { $set: { "text": req.body.text } }, err =>  res.json(createBody(err, {})))
})

function createBody(err, obj) {
    return {
        ...obj,
        err,
        ok: err == null
    }
}