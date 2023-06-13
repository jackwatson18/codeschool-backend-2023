const express = require('express');
const cors = require('cors');
const model = require('./model');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(cors());

// GET

app.get("/quizes", function(req, res) {
    model.Quiz.find().populate("questions").then(quizes => {
        res.json(quizes);
    });
});

app.get("/quizes/:quizID", function(req, res) {
    model.Quiz.findOne( { "_id": req.params.quizID }).populate("questions").then(quiz => {
        if (quiz) {
            console.log(quiz);
            res.json(expense);
        }
        else {
            console.log("Quiz not found.");
            res.status(404).send("Quiz not found.");
        }
    }).catch(() => {
        console.log("Bad request (GET quiz).");
        res.status(400).send("Quiz not found.");
    });
});

app.get("/questions", function(req, res) {
    model.Question.find().then(questions => {
        res.json(questions);
    });
});

app.get("/questions/:questionID", function(req, res) {
    model.Question.findOne( { "_id":req.params.questionID }).then(question => {
        if (question) {
            console.log(question);
            res.json(question);
        }

        else {
            console.log("Question not found.");
            res.status(404).send("Question not found.");
        }
    }).catch(() => {
        console.log("Bad request (GET question).");
        res.status(400).send("Question not found.");
    });
});

// POST

app.post("/quizes", function(req, res) {
    const newQuiz = new model.Quiz({
        title: req.body.title,
        description: req.body.description,
        questions: req.body.questions
    });

    newQuiz.save().then(() => {
        console.log("New quiz added.");
        res.status(201).send("Created quiz.");
    }).catch((errors) => {
        let error_list = [];
        for (var key in error.errors) {
            error_list.push(errors.errors[key].message);
        }
        res.status(422).send(error_list);
    });
});

app.post("/questions", function(req,res) {
    const newQuestion = new model.Question({
        questionText: req.body.questionText,
        possibleChoices: req.body.possibleChoices
    });

    newQuestion.save().then(() => {
        console.log("New question created.");
        res.status(201).send("New question created.");
    }).catch((errors) => {
        console.log(errors);
        let error_list = [];
        for (var key in errors.errors) {
            error_list.push(errors.errors[key].message)
        }
        res.status(422).send(error_list);
    });
});

// PUT

app.put("/quizes/:quizID", function(req,res) {
    const updatedQuiz = {
        title: req.body.title,
        questions: req.body.questions
    }

    model.Quiz.findByIdAndUpdate({ "_id": req.params.quizID }, updatedQuiz, {"new":true}).then(quiz => {
        if (quiz) {
            res.status(204).send("Quiz updated.");
        }
        else {
            res.status(404).send("Quiz not found.");
        }
    }).catch((errors) => {
        console.log(errors);
        res.status(422).send("Unable to update quiz.");
    });
});

app.put("/questions/:questionID", function(req, res) {
    const updatedQuestion = {
        questionText: req.body.questionText,
        possibleChoices: req.body.possibleChoices
    }

    model.Question.findByIdAndUpdate({ "_id": req.params.questionID }, updatedQuestion, {"new":true}).then(question => {
        if (question) {
            res.status(204).send("Question updated.");
        }
        else {
            res.status(404).send("Question not found.");
        }
    }).catch((errors) => {
        console.log(errors);
        res.status(422).send("Unable to update question.");
    });
}); // TODO: Fix valdiation on updates.

// DELETE
app.delete("/quizes/:quizID", function(req, res) {
    model.Quiz.findOneAndDelete({ "_id": req.params.quizID }).then(quiz => {
        if (quiz) {
            res.status(204).send("Quiz deleted.");
        }
        else {
            res.status(404).send("Quiz not found");
        }
    }).catch(() => {
        res.status(422).send("Unable to delete question.");
    })
});

app.delete("/questions/:questionID", function(req, res) {
    model.Question.findOneAndDelete({ "_id":req.params.questionID }).then(question => {
        if (question) {
            res.status(204).send("Question deleted.");
        }
        else {
            res.status(404).send("Question not found.");
        }
    }).catch(() => {
        res.status(422).send("Unable to delete question.");
    });
});


app.listen(port, function() {
    console.log(`Running server on port ${port}...`);
})