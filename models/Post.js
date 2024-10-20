const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },    // Assuming 'name' as a String directly. Adjust if it's a reference.
    ccomments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],  
    date: { type: Date, default: Date.now }    // 'date' will automatically set to current date/time if not provided.
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

 