import React, { Component } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
export default function NavBarComponent() {

    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)
    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>

                <h1 style={{ cursor: 'pointer' }} onClick={() => {
                    router.push('/')
                }} >Pro Link</h1>

                <div className={styles.navBarOptionContainer}>

                    {authState.profileFetcher && <div>
                        <div style={{ display: "flex", gap: "1.2rem" }}>
                            <p>Hey, {authState.user?.userId?.name}</p>
                            <p style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>


                            <p onClick={() =>{
                                localStorage.removeItem("token");
                                router.push('/login');
                                dispatch(reset())
                            }} style={{ fontWeight: "bold", cursor: "pointer" }}>Logout</p>

                        </div>
                    </div>}

                    {!authState.profileFetcher && <div onClick={() => {
                        router.push('/login')
                    }} className={styles.buttonJoin}>
                        <p>Be a part</p>
                    </div>}


                </div>
            </nav>
        </div>
    )
}
