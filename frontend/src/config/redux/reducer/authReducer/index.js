import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getAllUsers } from "@/config/redux/action/authAction";

const initialState = {
    user: undefined,
    isSuccess: false,
    isError: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetcher: false,
    connections: [],
    connectionReuqest: [],
    all_Users: [],
    all_profiles_fetched: false,
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false;
            dispatchSetTokenIsThere = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "loading..."
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.loggedIn = true;
                state.message = "login success"
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "loading..."
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.loggedIn = false;
                state.message = "Registration successful, please login"
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload
            })
            .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
                state.profileFetcher = false;
                state.message = "Fetching user data..."
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.profileFetcher = true;
                state.user = action.payload.userProfile;
            })
            .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.all_profiles_fetched = true;
                state.all_Users = action.payload.profiles;

            })
    }
})

export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;