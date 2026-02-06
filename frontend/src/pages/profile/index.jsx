import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { use } from 'react'
import styles from './index.module.css'
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getAboutUser, getUserProfile } from '@/config/redux/action/authAction'
import { clientServer, BASE_URL } from "@/config";
import { getAllPosts } from '@/config/redux/action/postAction'
// import { clientServer } from '@/config/server/clientServer'



export default function ProfilePage() {

    // const [userProfile, setUserProfile] = useState({
    //     userId: { name: '', userName: '', profilePicture: ''
    //     },
    //     bio: '',
    //     pastWork: []
    // });

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);

    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [inputData, setInputData] = useState({ company: '', position: '', years: '' });

    const handleWorkInputChange = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
    }


    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllPosts());
    }, [])

    useEffect(() => {
        if (authState.user) {
            setUserProfile(authState.user)
        }
        if (postReducer.posts && Array.isArray(postReducer.posts)) {
            const currentUserName = authState.user?.userId?.userName;
            if (!currentUserName) {
                setUserPosts([]);
                return;
            }
            let post = postReducer.posts.filter((post) => {
                return post.userId?.userName === currentUserName;
            });
            setUserPosts(post);
        }
    }, [authState.user, postReducer.posts])



    // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


    const uploadProfilePicture = async (file) => {

        const formData = new FormData();
        formData.append('profile_picture', file);
        formData.append('token', localStorage.getItem('token'));

        const response = await clientServer.post('/upload_profile_picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    const updateProfileData = async () => {
        const request = await clientServer.post('/user_update', {
            token: localStorage.getItem('token'),
            name: userProfile.userId.name,
        })

        const response = await clientServer.post('/update_profile_data', {
            token: localStorage.getItem('token'),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            eduction: userProfile.education,
        })
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }




    return (
        <UserLayout>
            <DashBoardLayout>
                {authState.user && userProfile?.userId &&
                    <div className={styles.container}>
                        <div className={styles.backDropContainer}>
                            <label htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
                                <p> Edit</p>
                            </label>
                            <input onChange={(e) => {
                                uploadProfilePicture(e.target.files[0])
                            }} hidden type="file" id="profilePictureUpload" />
                            <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />
                        </div>

                        <div className={styles.profileContainer_details}>
                            <div className={styles.profileContainer_flex}>
                                <div style={{ flex: "0.8" }}>

                                    <div style={{ display: "flex", width: "fit-content", alignItems: "center" }}>

                                        <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => {
                                            setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                                        }} />
                                        {/* <h2>{userProfile.userId.name}</h2> */}
                                        <p style={{ marginLeft: "0.5rem", color: "gray" }}>@{userProfile.userId.userName}</p>
                                    </div>

                                    <div>
                                        <textarea  value={userProfile.bio} onChange={(e) => {
                                            setUserProfile({ ...userProfile, bio: e.target.value })
                                        }}
                                            row={Math.max(3, userProfile.bio?.length / 80)}
                                            className={styles.bioEdit}
                                            style={{ width: "100%" }}
                                        />

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
                                <button className={styles.addWorkButton} onClick={() => {
                                    setIsModalOpen(true);
                                }}>
                                    Add Work
                                </button>
                            </div>
                        </div>

                        {userProfile != authState.user &&
                            <div onClick={() => {
                                updateProfileData()
                            }} className={styles.updateProfileBtn}>Update Profile</div>
                        }

                    </div>
                }

                {
                    isModalOpen &&
                    <div
                        onClick={() => {
                            setIsModalOpen(false)
                        }}
                        className={styles.commentsContainer}>
                        <div onClick={(e) => {
                            e.stopPropagation()
                        }} className={styles.allCommentsContainer}>
                            <input onChange={handleWorkInputChange} name='company' className={styles.inputField} type="text" placeholder='Enter Company' />
                            <input onChange={handleWorkInputChange} name='position' className={styles.inputField} type="text" placeholder='Enter Position' />
                            <input onChange={handleWorkInputChange} name='years' className={styles.inputField} type="number" placeholder='Enter Work Years' />

                            <div onClick={() => {
                                setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]})
                                setIsModalOpen(false)
                            }} className={styles.updateProfileBtn}> Add work</div>

                        </div>
                    </div>
                }

            </DashBoardLayout>
        </UserLayout>
    )
}

