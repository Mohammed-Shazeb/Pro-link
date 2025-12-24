import React, { use } from 'react'
import UserLayout from '@/layout/UserLayout';
import DashBoardLayout from '@/layout/DashBoardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllUsers } from '@/config/redux/action/authAction';
import styles from './index.module.css';



export default function Discoverpage() {

    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, [])
    return (
        <UserLayout>
            <DashBoardLayout>
                <div>
                    <h1>Discover Page</h1>

                    <div className={styles.allUserProfile}>
                        {authState.all_profiles_fetched && authState.all_Users.map((user) => {
                            // Skip profiles with no userId (incomplete profiles)
                            if (!user.userId) return null;

                            return (
                                <div key={user._id} className={styles.userCard}>
                                    <img className={styles.userCard_img} src={`http://localhost:9080/${user.userId.profilePicture?.includes('uploads/') ? user.userId.profilePicture : `uploads/${user.userId.profilePicture}`}`} alt="profile" />
                                    <div>
                                        <p>{user.userId.name}</p>
                                        <p>@{user.userId.userName}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
