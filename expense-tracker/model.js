const mongoose = require("mongoose");
const {Schema} = mongoose;

mongoose.set('strictQuery', false);
mongoose.connect('key_goes_here');


const ExpenseSchema = Schema({
    description: {
        type: String,
        required: [true, "Expense must have a description."]
    },

    amount: {
        type: Number,
        required: [true, "Expense must have a value"]
    },

    catagory: {
        type: String,
        required: [true, "Expense must have a category"]
    }
},
{ timestamps: true }
);

const Expense = mongoose.model("Expense", ExpenseSchema);


module.exports = {
    Expense: Expense
}