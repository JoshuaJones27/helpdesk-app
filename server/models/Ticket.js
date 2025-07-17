const mongoose = require('mongoose'); // Import the mongoose library for MongoDB object modeling

// Define the schema for a Ticket document in MongoDB
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true }, // The title of the ticket (required field)
    description: String, // A description of the ticket (optional)
    status: {
        type: String,
        enum: ['open', 'in progress', 'closed'], // Allowed values for status
        default: 'open' // Default status is 'open'
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp when the ticket was created (defaults to now)
    updatedAt: { type: Date, default: Date.now }, // Timestamp when the ticket was last updated (defaults to now)
    createdBy: String, // The user who created the ticket (optional)
    assignedTo: String // The user assigned to the ticket (optional)
});

// Export the Ticket model based on the schema, to be used in other parts of the app
module.exports = mongoose.model('Ticket', ticketSchema);
