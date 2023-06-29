const mongoose = require("mongoose");
const {Schema} = mongoose;
const dotenv = require('dotenv');
const bcrypt = require("bcrypt")

dotenv.config();

mongoose.set("strictQuery",false);
mongoose.connect(process.env.DB_PASSWORD);



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

UserSchema.methods.setPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(plainPassword, 12).then(hashedPassword => {
            this.password = hashedPassword;
            resolve();
        }).catch(() => {
            reject();
        })
    })

    return promise;
}

UserSchema.methods.verifyPassword = function(plainPassword) {
    var promise = new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.password).then(result => {
            resolve(result);
        }).catch(() => {
            reject();
        })
    });

    return promise;
}



const User = mongoose.model("User", UserSchema);
const Question = mongoose.model("Question", QuestionSchema);
const Quiz = mongoose.model("Quiz", QuizSchema);



module.exports = {
    Quiz: Quiz,
    Question: Question,
    User: User
}