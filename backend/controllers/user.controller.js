import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";


const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);
    doc.image('uploads/' + userData.userId.profilePicture, { align: 'center', width: 100 });
    doc.fontSize(14).text(`Name${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.userName}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);

    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`);
        doc.fontSize(14).text(`Years: ${work.years}`);
    });
    doc.end();
    return outputPath;
}

export const register = async (req, res) => {
    try {
        const { name, userName, email, password } = req.body;

        if (!name || !userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            userName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });

        await profile.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.log("Registration error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = crypto.randomBytes(32).toString("hex");

        await User.findOneAndUpdate({ _id: user._id }, { token });
        await user.save();
        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token: token });

        if (!user) return res.status(400).json({ message: "Invalid token" });

        // user.profilePicture = req.file.path;
        user.profilePicture = `uploads/${req.file.filename}`;
        await user.save();

        return res.status(200).json({ message: "Profile picture updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const { userName, email } = newUserData;

        const exisitingUser = await User.findOne({ $or: [{ userName: userName }, { email: email }] });
        if (exisitingUser && String(exisitingUser._id) !== String(user._id)) {
            return res.status(400).json({ message: "Username or Email already in use" });
        }

        Object.assign(user, newUserData);

        await user.save();
        return res.json({ message: "Profile updated successfully" });


    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ token });

        if (!user) return res.status(400).json({ message: "Invalid token" });

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email userName profilePicture');

        return res.json({ userProfile });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { token, ...newUserProfile } = req.body;
        const userProfile = await User.findOne({ token: token });

        if (!userProfile) return res.status(400).json({ message: "Invalid token" });

        const profile_to_update = await Profile.findOne({ userId: userProfile._id });
        if (!profile_to_update) return res.status(404).json({ message: "Profile not found" });

        Object.assign(profile_to_update, newUserProfile);

        await profile_to_update.save();

        return res.json({ message: "Profile updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('userId', 'name email userName profilePicture');
        return res.json({ profiles });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}

export const downloadProfile = async (req, res) => {
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user._id })
        .populate('userId', 'name email userName profilePicture');

    let outputPath = await convertUserDataToPDF(userProfile);
    return res.json({ "message": outputPath })
}

export const sendConnectionRequest = async (req, res) => {    // let user allow to send a connection request to another user
    const { token, connectionId } = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionId
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }
        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionId,
        });

        await request.save();
        return res.status(200).json({ message: "Connection request sent successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getMyConnectionsRequests = async (req, res) => {  // To tell the user whom they have sent connection requests to
    const { token } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate('connectionId', 'name userName email profilePicture');

        return res.json({ connections });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const whatAreMyConnections = async (req, res) => {     // requests sent to the current user   Shows the user who has sent connection requests to them.
    const { token } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const connections = await ConnectionRequest.find({ connectionId: user._id })
            .populate('connectionId', 'name userName email profilePicture');

        return res.json(connections);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const acceptConnectionRequest = async (req, res) => {    // let a user accept or decline a connection request  
    const { token, requestId, action_type } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const connection = await ConnectionRequest.findOne({ _id: requestId })

        if (!connection) return res.status(404).json({ message: "Connection request not found" });

        if (action_type === 'accept') {
            connection.status_accepted = true;

        } else {
            connection.status_accepted = false;
        }
        await connection.save();
        return res.json({ message: "Connection request accepted" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body;
    try {

        const user = await User.findOne({ token: token }).select('_id');

        if (!user) return res.status(404).json({ message: "User not found" });

        const post = await Post.findOne({ _id: post_id });

        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = new Comment({
            userId: user._id,
            postId: post._id,
            comment: commentBody,
        });

        await comment.save();

        return res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
}