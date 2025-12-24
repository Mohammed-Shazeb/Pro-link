import { createSlice } from "@reduxjs/toolkit"
import { getAllPosts, createPost, deletePost, getAllComments } from "../../action/postAction"


const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
}


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: initialState,
        resetPostId: (state) => {
            state.postId = ""
        },
    },
    extraReducers: (builder) => {
        
        builder.addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
            state.message = "Fetching all the posts....";
        })
        builder.addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;
            state.posts = action.payload.post.reverse() || [];
        })
        builder.addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(createPost.pending, (state) => {
            state.isLoading = true;
            state.message = "Creating post...";
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.message = action.payload;
        })
        .addCase(createPost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAllComments.fulfilled, (state, action) => {
            state.comments = action.payload.comments;
            state.postId = action.payload.postId;
        })
    }
})

export const { resetPostId } = postSlice.actions;

export default postSlice.reducer;