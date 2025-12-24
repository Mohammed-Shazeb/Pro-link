import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

export const activeCheck = async(req, res) => {
    return res.status(200).json({ message: "RUNNING" });
}

export const createPost = async(req, res) => {
    const {token} = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file ? req.file.filename : '',
            fileType: req.file ? req.file.mimetype.split('/')[1] : '',
        })

        await post.save();
        return res.status(200).json({ message: "Post created successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getAllPosts = async(req, res) => {
    try {
        const post = await Post.find().populate('userId', 'name email userName profilePicture');
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const deletePost = async(req,res) =>{
    const {token, post_id} = req.body;

    try {
        const user = await User.findOne({ token: token }).select('_id');
        if(!user) return res.status(400).json({ message: "Invalid token" });

        const post = await Post.findOne({_id: post_id, userId: user._id });
        if(!post) return res.status(404).json({ message: "Post not found" });

        if(post.userId.toString() !== user._id.toString()){
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        await Post.deleteOne({_id: post_id});
        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const commentPost = async(req, res) => {
    const { token, postId, commentBody } = req.body;

    try {
        const user = await User.findOne({ token: token }).select('_id');
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const post = await Post.findOne({ _id: postId });
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = new Comment({
            userId: user._id,
            postId: post._id,
            body: commentBody,
        })

        await comment.save();

        return res.status(200).json({ message: "Comment added successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const get_comments_by_post = async(req, res) => {
    const { post_id } = req.query;

    try {
        const comments = await Comment
        .find({ postId: post_id })
        .populate('userId', 'name userName profilePicture');

        return res.status(200).json({ comments: comments.reverse() });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const  delete_comment_of_user = async(req, res) => {
    const { token, comment_id } = req.body;

    try {
        const user = await User.findOne({ token: token }).select('_id');
        if(!user) return res.status(400).json({ message: "Invalid token" });

        const comment = await Comment.findOne({'_id': comment_id});
        if(!comment) return res.status(404).json({ message: "Comment not found" });

        if(comment.userId.toString() !== user._id.toString()){
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await comment.deleteOne();
        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const increment_likes = async (req, res) => {
    const {post_id} = req.body;

    try {
        const post = await Post.findOne({_id: post_id});
        
        if(!post) return res.status(404).json({ message: "Post not found" });

        post.likes = post.likes + 1;
        await post.save();
        return res.status(200).json({ message: "Post liked successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}