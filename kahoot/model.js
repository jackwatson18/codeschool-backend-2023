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
    questions: [{type: Schema.Types.ObjectId, ref: "Question"}]

},
{timestamps: true}
);

const Question = mongoose.model("Question", QuestionSchema);
const Quiz = mongoose.model("Quiz", QuizSchema);


module.exports = {
    Quiz: Quiz,
    Question: Question
}