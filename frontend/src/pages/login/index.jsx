import UserLayout from '@/layout/UserLayout'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { registerUser, loginUser } from '@/config/redux/action/authAction/index.js';
import {emptyMessage} from '@/config/redux/reducer/authReducer/index.js';
function LoginComponent() {

    const authState = useSelector((state) => state.auth)
    const router = useRouter();
    const [userLoginMethod, setUserLoginMethod] = useState(false);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        if (authState.loggedIn) {
            router.push('/dashboard')
        }
    }, [authState.loggedIn, router]);

    useEffect(() => {
        dispatch(emptyMessage());
    }, [userLoginMethod, dispatch]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            // Only redirect if already logged in from Redux state
            if (token && authState.loggedIn) {
                router.push('/dashboard')
            }
        }
    }, [router, authState.loggedIn]);

    // Additional effect to handle successful login redirect
    useEffect(() => {
        if (authState.isSuccess && authState.loggedIn && typeof window !== 'undefined' && localStorage.getItem('token')) {
            // Clear form inputs
            setName('');
            setUsername('');
            setEmailAddress('');
            setPassword('');
            // Redirect to dashboard
            router.push('/dashboard');
        }
    }, [authState.isSuccess, authState.loggedIn, router]);

    const handleRegister = () => {
        console.log("registering..");
        dispatch(registerUser({ name, userName: username, email, password }));
    }

    const handleLogin = () => {
        console.log("logging in..");
        dispatch(loginUser({ email, password }));
    }

    return (
        <UserLayout>

            <div className={styles.container}>

                <div className={styles.cardContainer}>

                    <div className={styles.cardContainer_left}>

                        <p className={styles.cardleft_heading}> {userLoginMethod ? "Sign In" : "Sign Up"} </p>
                        <p style={{ color: authState.isError ? 'red' : 'green' }}>
                            {typeof authState.message === 'object' 
                                ? authState.message?.message || JSON.stringify(authState.message)
                                : authState.message}
                        </p>

                        <div className={styles.inputContainers}>

                            {!userLoginMethod && <div className={styles.inputRow}>

                                <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='Username' />
                                <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder='Name' />
                            </div>}
                            <input onChange={(e) => setEmailAddress(e.target.value)} className={styles.inputField} type="text" placeholder='Email' />
                            <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="text" placeholder='Password' />

                            <div onClick={() => {
                                if (userLoginMethod) {
                                    handleLogin();
                                } else {
                                    handleRegister();
                                }
                            }}
                                className={styles.buttonWithOutline}>
                                <p>{userLoginMethod ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</p>
                            </div>

                        </div>
                    </div>

                    <div className={styles.cardContainer_right}>

                        {userLoginMethod ? <p>Don't have an account</p> : <p>Already have an account</p>}
                        <div onClick={() => {
                            setUserLoginMethod(!userLoginMethod);
                        }} style={{ color: "Black", textAlign: "center" }} className={styles.buttonWithOutline}>
                            <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
                        </div>

                    </div>

                </div>

            </div>

        </UserLayout>
    )
}

export default LoginComponent