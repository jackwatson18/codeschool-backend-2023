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

app.get("/expenses/:expenseID", function(req, res) {
    model.JournalEntry.findOne({ "_id": req.params.expenseID }).then(expense => {
        if (expense) {
            res.json(expense);
        }
        else {
            console.log("Expense not found.")
            res.status(404).send("Expense not found.");
        }
    }).catch(() => {
        console.log("Bad request (GET by ID).");
        res.status(400).send("Expense not found.");
    })
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

app.put("/expenses/:expenseID", function (req, res) {
    const updatedExpense = {
        description: req.body.description,
        amount: req.body.amount,
        category: req.body.category
    }

    model.JournalEntry.findByIdAndUpdate({ "_id": req.params.expenseID }, updatedExpense, {"new":true}).then(expense => {
        if (expense) {
            res.status(204).send("Expense updated.");
        }
        else {
            res.status(404).send("Expense not found.");
        }
    }).catch(() => {
        res.status(422).send("Unable to update.");
    });
});

// DELETE

app.delete("/expenses/:expenseID", function (req, res) {
    model.JournalEntry.findOneAndDelete({ "_id": req.params.expenseID }).then(expense => {
        if (expense) {
            res.status(204).send("Expense Deleted.");
        }
        else {
            res.status(404).send("Expense not found.");
        }
    }).catch(() => {
        res.status(422).send("Unable to delete.");
    });
});

app.listen(port, function() {
    console.log(`Running server on port ${port}...`);
});