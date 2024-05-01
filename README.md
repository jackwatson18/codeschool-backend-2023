# Code School 2023 Backend Demos
Backend code for 2023 Code School student projects. These are the working demos meant for the students to implement their own versions of. Expense Tracker is a simple Express backend meant to be a basic introduction to REST APIs and using MongoDB to create persistent data. The Kahoot project explores authentication for REST endpoints and how servers store authentication information. It also explores more complex data schemas for the database portion of the demo.


# EXPENSE TRACKER

## Expense
- GET /expenses
- GET /expenses/:expenseID
- POST /expenses
- PUT /expenses/:expenseID
-DELETE /expenses/:expenseID

## Expense Tracker Schema
```javascript
const JournalEntrySchema = Schema({
    description: {
        type: String,
        required: [true, "Journal entry must have a description."]
    },

    amount: {
        type: Number,
        required: [true, "Journal entry must have a value."]
    },

    category: {
        type: String,
        required: [true, "Journal entry must have a category."]
    }
},
{ timestamps: true }
);
```

# KAHOOT

## User
- GET /user (password hashes redacted)
- GET /user/:userID (password hashes redacted)
- POST /user
- PUT /user/:userID (Authenticated)
- DELETE /user/:userID (Authenticated)

## Session
- GET /session
- POST /session
- DELETE /session

## Quiz
- GET /quiz
- GET /quiz/:quizID
- POST /quiz (Authenticated)
- PUT /quiz/:quizID (Authenticated)
- DELETE /quiz/:quizID (Authenticated)

## Question
- GET /question
- GET /question/:questionID
- POST /question (Authenticated)
- PUT /question/:questionID (Authenticated)
- DELETE /question/:questionID (Authenticated)

## Kahoot Schema
```javascript
const QuestionSchema = Schema({
    questionText: {
        type: String,
        required: [true, "Question cannot be blank."]
    },
    possibleChoices: [{
        answerText: {
            type: String,
            required: [true, "Possible answer choice cannot be blank."]
        },
        isCorrect: {
            type:Boolean,
            required: [true, "An answer must be correct or not (true/false)."]
        }
    }]
});

const QuizSchema = Schema({
    title: {
        type: String,
        required: [true, "Quiz must have a title."]
    },
    description: String,
    questions: [{type: Schema.Types.ObjectId, ref: "Question"}]

},
{timestamps: true}
);

const UserSchema = Schema({
    email: {
        type: String,
        required: [true, "User must have an email."]
    },
    name: String,
    password: {
        type: String,
        required: [true, "User must have a password."]
    }
});
```
