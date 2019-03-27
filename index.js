const express = require('express'),
    mongojs = require('mongojs'),
    uniqid = require('uniqid'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app)

const db = mongojs('localhost/react-todo', ['todo'])
const s = http.listen(process.env.PORT || 3001, function () { })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/", async (req, res) => res.json(createBody(null, { version: 1 })))

app.get("/api/todo/:id", async (req, res) => {
    db.todo.findOne({ id: req.params.id }, (err, doc) => {
        if (doc == null) return res.json(createBody('not found'))
        delete doc._id
        res.json(createBody(err, {
            todo: doc
        }))
    })
})

app.get("/api/todo", async (req, res) => {
    db.todo.find((err, doc) => {
        res.json(createBody(err, {
            todo_list: doc.map(i => {delete i._id; return i})
        }))
    })
})

app.post("/api/todo", async (req, res) => {
    const id = uniqid()
    db.todo.insert({ id, text: req.body.text }, (err, doc) => res.json(createBody(err, { id: doc.id })))
})

app.delete("/api/todo", async (req, res) => {
    db.todo.remove({ id: req.body.id }, err => res.json(createBody(err, {})))
})

app.put("/api/todo", async (req, res) => {
    db.todo.update({ id: req.body.id }, { $set: { "text": req.body.text } }, err => res.json(createBody(err, {})))
})

function createBody(err, obj) {
    return {
        ...obj,
        err,
        ok: err == null
    }
}