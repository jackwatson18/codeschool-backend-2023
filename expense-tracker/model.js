const mongoose = require("mongoose");
const {Schema} = mongoose;
const dotenv = require('dotenv');

dotenv.config() // Import environmental variables

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_PASSWORD);


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

const JournalEntry = mongoose.model("JournalEntry", JournalEntrySchema);


module.exports = {
    JournalEntry: JournalEntry
}