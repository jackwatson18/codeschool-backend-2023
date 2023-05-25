const express = require('express');
const cors = require('cors');
const model = require('./model');

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(cors());


// GET

app.get("/expenses", function(req, res) {
    model.JournalEntry.find().then(entries => {
        res.json(entries);
    });
});

// POST

app.post("/expenses", function(req, res) {
    const newEntry = new model.JournalEntry({
        description: req.body.description,
        amount: req.body.amount,
        category: req.body.category
    });

    newEntry.save().then(() => {
        console.log("New expense/journal entry added.");
        res.status(201).send("Added expense/journal entry");
    }).catch((errors) => {
        let error_list = [];
        for (var key in errors.errors) {
            error_list.push(errors.errors[key].message)
        }
        res.status(422).send(error_list);
    })

})

// PUT

// DELETE

app.listen(port, function() {
    console.log(`Running server on port ${port}...`);
});