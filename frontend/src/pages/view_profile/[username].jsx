import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clientServer, BASE_URL } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getConnectionsRequest, sendConnectionRequest, getMyConnectionRequest } from "@/config/redux/action/authAction";


export default function ViewProfilePage({ userProfile }) {

    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const postReducer = useSelector((state) => state.postReducer);

    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnections, setIsCurrentUserInConnections] = useState(false);
    const [isConnectionNull, setIsConnectionNull] = useState(true);

    const getUsersPosts = async () => {
        await dispatch(getAllPosts());
        await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
        await dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
    }

    useEffect(() => {
        if (postReducer.posts && Array.isArray(postReducer.posts)) {
            let post = postReducer.posts.filter((post) => {
                return post.userId.userName === router.query.username;
            });
            setUserPosts(post);
        }
    }, [postReducer.posts, router.query.username]);

    useEffect(() => {
        if (Array.isArray(authState.connections)) {
            const match = authState.connections.find((user) => user.connectionId?._id === userProfile.userId._id || user.userId?._id === userProfile.userId._id);
            if (match) {
                setIsCurrentUserInConnections(true);
                if (match.status_accepted === "accepted") {
                    setIsConnectionNull(false);
                }
            }
        }
        if (Array.isArray(authState.connectionRequests)) {
            const match = authState.connectionRequests.find((user) => user.connectionId?._id === userProfile.userId._id || user.userId?._id === userProfile.userId._id);
            if (match) {
                setIsCurrentUserInConnections(true);
                if (match.status_accepted === "accepted") {
                    setIsConnectionNull(false);
                }
            }
        }
    }, [authState.connections, authState.connectionRequests]);
    useEffect(() => {
        getUsersPosts();
    }, [])

    return (

        <UserLayout>
            <DashBoardLayout>
                <div className={styles.container}>
                    <div className={styles.backDropContainer}>


                        <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />
                        {/* <img className={styles.backDrop} src={`${BASE_URL}/uploads/${userProfile.userId.profilePicture}`} alt="backdrop" /> */}
                    </div>

                    <div className={styles.profileContainer_details}>
                        <div className={styles.profileContainer_flex}>
                            <div style={{ flex: "0.8" }}>

                                <div style={{ display: "flex", width: "fit-content", alignItems: "center" }}>
                                    <h2>{userProfile.userId.name}</h2>
                                    <p className={styles.userName}>@{userProfile.userId.userName}</p>
                                </div>


                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                    {isCurrentUserInConnections ?
                                        <button className={styles.connectedButton}>{isConnectionNull ? "Pending" : "Connected"}</button>
                                        :

                                        <button onClick={async () => {
                                            await dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), userId: userProfile.userId._id }))
                                        }} className={styles.connectBtn}>Connect</button>
                                    }
                                    <div onClick={async () => {
                                        const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                        window.open(`${BASE_URL}/uploads/${response.data.message}`, '_blank');

                                    }} style={{ cursor: "pointer" }}>
                                        <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>

                                    </div>
                                </div>

                                <div>
                                    <p>{userProfile.bio}</p>
                                </div>

                            </div>
                            <div style={{ flex: "0.2" }}>
                                <h3>Recent Activity</h3>
                                {userPosts.map((post) => {
                                    return (
                                        <div key={post._id} className={styles.postCard}>
                                            <div className={styles.card}>
                                                <div className={styles.card_profileContainer}>
                                                    {post.media !== "" ? <img src={`${BASE_URL}/uploads/${post.media}`}></img>
                                                        : <div style={{ width: "3.4em", height: "3.4rem" }} ></div>}
                                                </div>
                                            </div>
                                            <p>{post.body}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className={styles.workHistory}>
                        <h4>Work History</h4>
                        <div className={styles.workHistoryContainer}>
                            {userProfile.pastWork.map((work, index) => {
                                return (
                                    <div key={index} className={styles.workHistoryCard}>
                                        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>{work.company} - {work.position}</p>
                                        <p>{work.years}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}

export async function getServerSideProps(context) {
    const { username } = context.params;
    // Fetch user profile data based on the username
    // const res = await fetch(`http://localhost:9080/user/get_profile_based_on_username?username=${username}`);
    // const data = await res.json();

    try {
        const request = await clientServer.get("/user/get_profile_based_on_username", {
            params: {
                username: username
            }
        });
        return {
            props: {
                userProfile: request.data.profile
            }
        }
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        return {
            notFound: true
        }
    }
}
