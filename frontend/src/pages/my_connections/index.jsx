import { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout';
import DashBoardLayout from '@/layout/DashBoardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { acceptConnectionRequest, getConnectionsRequest, getMyConnectionRequest } from '@/config/redux/action/authAction';
import Router from 'next/router';
import { BASE_URL } from '@/config';
import styles from './index.module.css';




export default function MyConnectionsPage() {

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
        dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
    }, [])

    return (
        <UserLayout>
            <DashBoardLayout>
                <div style={{flexDirection: "column", display: "flex", gap: "1.7rem"}}>
                    <h1>My Connections </h1>

                    {Array.isArray(authState.connections) && authState.connections.length === 0 && (
                        <p>No connection requests at the moment.</p>
                    )}

                    {Array.isArray(authState.connections) && authState.connections.length !== 0 && authState.connections.filter((connection) => connection.status_accepted === null).map((user, index) => {
                        const person = user.userId; // userId is the person who SENT the request
                        return (
                            <div onClick={() => {
                                Router.push(`/view_profile/${person.userName}`)
                            }}
                             className={styles.userCard} key={index}>
                                <div style={{ display: "flex", alignItems: "center" , gap: "1.2rem", justifyContent: "space-between"}}>
                                    <div className={styles.profilePicture}>
                                        <img src={`${BASE_URL}/uploads/${person.profilePicture}`} alt=""/>
                                        {/* <img src={`${BASE_URL}/${person.profilePicture}`} alt=""/> */}
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{person.name}</h3>
                                        <p>{person.userName}</p>
                                    </div>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(acceptConnectionRequest({
                                            connectionId: user._id,
                                            token: localStorage.getItem("token"),
                                            action: "accept"
                                        }))
                                    }} className={styles.connectedButton}>Accept</button>
                                </div>
                            </div>
                        )
                    })}      
                    <h1>My Networks</h1>              
                    {Array.isArray(authState.connections) && authState.connections.length !== 0 && authState.connections.filter((connection) => connection.status_accepted === "accepted").map((user, index) => {
                        const person = user.userId; // userId is the person who SENT the request
                        return (
                            <div onClick={() => {
                                Router.push(`/view_profile/${person.userName}`)
                            }}
                             className={styles.userCard} key={index}>
                                <div style={{ display: "flex", alignItems: "center" , gap: "1.2rem", justifyContent: "space-between"}}>
                                    <div className={styles.profilePicture}>
                                        <img src={`${BASE_URL}/uploads/${person.profilePicture}`} alt=""/>
                                        {/* <img src={`${BASE_URL}/${person.profilePicture}`} alt=""/> */}
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{person.name}</h3>
                                        <p>{person.userName}</p>
                                    </div>
                                    
                                </div>
                            </div>
                        )
                    })}
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
