import React, { use } from 'react'
import UserLayout from '@/layout/UserLayout';
import DashBoardLayout from '@/layout/DashBoardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllUsers } from '@/config/redux/action/authAction';
import styles from './index.module.css';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/config';


export default function Discoverpage() {

    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, [])
    const router = useRouter();
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
                                <div onClick={() =>{
                                    router.push(`view_profile/${user.userId.userName}`)
                                }} key={user._id} className={styles.userCard}>
                                    {/* <img className={styles.userCard_img} src={`${BASE_URL}/uploads/${user.userId.profilePicture}`} alt="profile" /> */}
                                    <img className={styles.userCard_img} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile" />
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
