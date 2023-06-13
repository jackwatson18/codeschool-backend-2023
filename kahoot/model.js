const mongoose = require("mongoose");
const {Schema} = mongoose;
const dotenv = require('dotenv');

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
    questions: [QuestionSchema]

},
{timestamps: true}
);

const Quiz = mongoose.model("Quiz", QuizSchema);
const Question = mongoose.model("Question", QuestionSchema);

module.exports = {
    Quiz: Quiz,
    Question: Question
}