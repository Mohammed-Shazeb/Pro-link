import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
    "posts/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const createPost = createAsyncThunk(
    "posts/createPost",
    async (userData, thunkAPI) => {

        const { file, body } = userData;

        try {
            const formData = new FormData();

            formData.append("token", localStorage.getItem("token"));
            formData.append("media", file);
            formData.append("body", body);

            const response = await clientServer.post("/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post created successfully");
            } else {
                return thunkAPI.rejectWithValue("Failed to create post");
            }


        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (post_id, thunkAPI) => {
        try {
            const response = await clientServer.post("/delete_post", {
                token: localStorage.getItem("token"),
                post_id: post_id.post_id
            });
            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post deleted successfully");
            } else {
                return thunkAPI.rejectWithValue("Failed to delete post");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const incrementPostLikes = createAsyncThunk(
    "posts/incrementLikes",
    async (post_id, thunkAPI) => {
        try {

            const response = await clientServer.post("/increment_post_like", {
                post_id: post_id.post_id
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (post_id, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_comments", {
                params: {
                    post_id: post_id.post_id
                }
            });
            return thunkAPI.fulfillWithValue({
                comments: response.data.comments,
                postId: post_id.post_id
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
       try {
            console.log({
                post_id: commentData.post_id,
                body: commentData.body
            })
            const response = await clientServer.post("/comment", {
                token: localStorage.getItem("token"),
                postId: commentData.post_id,
                commentBody: commentData.body
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)