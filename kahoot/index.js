const express = require('express');
const cors = require('cors');
const model = require('./model');
const dotenv = require('dotenv');
const session = require("express-session");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        callback(null, origin);
    }
}));

app.use(session({
    secret: "jhgfoweriwoerodfkvxcvmxvxm12340fsdfkl32f0y0reofasf",
    saveUninitialized: true,
    resave: false
}));

// custom middleware

function AuthMiddleware(req, res, next) {
    if (req.session && req.session.userId) {
        model.User.findOne({ "_id": req.session.userId}).then(user => {
            if (user) {
                req.user = user;
                next();
            }
            else {
                res.status(401).send("Unauthenticated.");
            }
        })
    }
    else {
        res.status(401).send("Unauthenticated.");
    }
}

// authentication stuff

app.get("/users", function(req, res) {
    model.User.find({}, {"password":0}).then(users => {
        res.send(users);
    })
})

app.get("/users/:userID", function(req, res) {
    model.User.findOne({ "_id":req.params.userID }, {"password":0}).then(user => {
        if (user) {
            res.send(user);
        }
        else {
            res.status(404).send("User not found.");
        }
    }).catch(() => {
        res.status(400).send("User not found.");
    })
})

app.post("/users", function(req, res) {
    var newUser = new model.User({
        email: req.body.email,
        name: req.body.name,
    })
    newUser.setPassword(req.body.password).then(function() {
        newUser.save().then(() => {
            res.status(201).send("New user created.");
        }).catch(errors => {
            let error_list = [];
            for (var key in errors.errors) {
                error_list.push(errors.errors[key].message);
            }
            res.status(422).send(error_list);
        })
    })
})

app.put("/users/:userID", AuthMiddleware, function(req, res) {
    model.User.findOne({ "_id":req.params.userID }).then(user => {
        if (user) {
            user.email = req.body.email;
            user.name = req.body.name;
            if (req.body.password) {
                user.setPassword(req.body.password).then(() => {
                    user.save().then(() => {
                        res.status(204).send();
                    }).catch(errors => {
                        let error_list = [];
                        for (var key in errors.errors) {
                            error_list.push(errors.errors[key].message);
                        }
                        res.status(422).send(error_list);
                    })
                })
            }
            else {
                user.save().then(() => {
                    res.status(204).send();
                }).catch(errors => {
                    let error_list = [];
                    for (var key in errors.errors) {
                        error_list.push(errors.errors[key].message);
                    }
                    res.status(422).send(error_list);
                })
            }
        }
        else {
            res.status(404).send("User not found.");
        }
    }).catch(() => {
        res.status(400).send("User not found.");
    })
})

app.delete("/users/:userID", AuthMiddleware, function(req, res) {
    model.User.findOneAndDelete({ "_id":req.params.userID }).then(user => {
        if (user) {
            res.status(204).send();
        }
        else {
            res.status(404).send("User not found.");
        }
    }).catch(() => {
        res.status(400).send("User not found.");
    })
})

app.get("/session", function(req, res) {
    res.send(req.session);
})

app.delete("/session", function(req, res) {
    req.session.userId = undefined;
    req.session.name = undefined;
    res.status(204).send();
})

app.post("/session", function(req, res) {
    model.User.findOne({ "email":req.body.email }).then(user => {
        if (user) {
            user.verifyPassword(req.body.password).then(result => {
                if (result) {
                    req.session.userId = user._id;
                    req.session.name = user.name;
                    res.status(201).send("Session created.");
                }
                else {
                    res.status(401).send("Authentication failure.");
                }
            })
        }
        else {
            res.status(401).send("Authentication failure.");
        }
    }).catch(() => {
        res.status(400).send("Not found. (Bad email format?)");
    })
})

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
            res.json(quiz);
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

app.post("/quizes", AuthMiddleware, function(req, res) {
    const newQuiz = new model.Quiz({
        title: req.body.title,
        description: req.body.description,
        questions: req.body.questions
    });

    console.log(newQuiz);

    newQuiz.save().then(() => {
        console.log("New quiz added.");
        res.status(201).send("Created quiz.");
    }).catch((errors) => {
        let error_list = [];
        for (var key in errors.errors) {
            error_list.push(errors.errors[key].message);
        }
        res.status(422).send(error_list);
    });
});

app.post("/questions", AuthMiddleware, function(req,res) {
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

app.put("/quizes/:quizID", AuthMiddleware, function(req,res) {
    model.Quiz.findOne({ "_id":req.params.quizID }).then(quiz => {
        if (quiz) {
            quiz.title = req.body.title;
            quiz.description = req.body.description;
            quiz.questions = req.body.questions;

            quiz.save().then(() => {
                res.status(204).send();
            }).catch(errors => {
                let error_list = [];
                for (var key in errors.errors) {
                    error_list.push(errors.errors[key].message)
                }
                res.status(422).send(error_list);
            })
        }
        else {
            res.status(404).send("Quiz not found.");
        }
    }).catch(() => {
        res.status(400).send("Quiz not found.");
    })
});

app.put("/questions/:questionID", AuthMiddleware, function(req, res) {
    model.Question.findOne({ "_id": req.params.questionID }).then(question => {
        if (question) {
            question.questionText = req.body.questionText;
            question.possibleChoices = req.body.possibleChoices;

            question.save().then(() => {
                res.status(204).send();
            }).catch(errors => {
                let error_list = [];
                for (var key in errors.errors) {
                    error_list.push(errors.errors[key].message)
                }
                res.status(422).send(error_list);
            })
        }
        else {
            res.status(404).send("Question not found.");
        }
    }).catch(() => {
        res.status(400).send("Question not found.");
    })
}); 

// DELETE
app.delete("/quizes/:quizID", AuthMiddleware, function(req, res) {
    model.Quiz.findOneAndDelete({ "_id": req.params.quizID }).then(quiz => {
        if (quiz) {
            res.status(204).send("Quiz deleted.");
        }
        else {
            res.status(404).send("Quiz not found");
        }
    }).catch(() => {
        res.status(400).send("Unable to delete question.");
    })
});

app.delete("/questions/:questionID", AuthMiddleware, function(req, res) {
    model.Question.findOneAndDelete({ "_id":req.params.questionID }).then(question => {
        if (question) {
            res.status(204).send("Question deleted.");
        }
        else {
            res.status(404).send("Question not found.");
        }
    }).catch(() => {
        res.status(400).send("Unable to delete question.");
    });
});


app.listen(port, function() {
    console.log(`Running server on port ${port}...`);
})