// pages/api/posts.js
import dbConnect from '../../lib/dbConnect';
import Post from '../../models/Post';

export default async function handler(req, res) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const posts = await Post.find({});
                res.status(200).json(posts);
            } catch (error) {
                res.status(500).json({ error: 'Server error', message: error.message });
            }
            break;
        case 'POST':
            try {
                const post = new Post(req.body);
                await post.save();
                res.status(201).json(post);
            } catch (error) {
                res.status(400).json({ error: 'Bad request', message: error.message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}