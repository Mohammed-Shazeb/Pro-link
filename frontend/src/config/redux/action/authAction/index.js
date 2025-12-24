import {clientServer} from "@/config";
import {createAsyncThunk} from "@reduxjs/toolkit";

/* loginUser is an async function (API call).
It sends email + password to your backend (/login).
If successful → save token in localStorage → return data.
If failed → return error message.*/
export const loginUser = createAsyncThunk("user/login",
    async(user,thunkAPI) =>{
        try {
            const response = await clientServer.post('/login', {
                email: user.email,
                password: user.password
            });

            if(response.data.token){
                localStorage.setItem("token", response.data.token);
                return thunkAPI.fulfillWithValue(response.data);
            }
            else{
                return thunkAPI.rejectWithValue("Login Failed");
            }

        } catch (error) {
            return thunkAPI.rejectWithValue("Login failed: " + (error.response?.data?.message || error.message));
        }
    }
)


export const registerUser = createAsyncThunk("user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/register', {
                name: user.name,
                userName: user.userName,
                email: user.email,
                password: user.password
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            return thunkAPI.rejectWithValue("Registration failed: " + (error.response?.data?.message || error.message));
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/get_all_users");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)