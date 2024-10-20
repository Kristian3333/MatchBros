const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    name: String,
    comment: String,
    date: { type: Date, default: Date.now }
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
module.exports = Post;
