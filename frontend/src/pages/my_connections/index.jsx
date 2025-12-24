import React from 'react'
import UserLayout from '@/layout/UserLayout';
import DashBoardLayout from '@/layout/DashBoardLayout';

export default function MyConnectionsPage() {
    return (
        <UserLayout>
            <DashBoardLayout>
                <div>
                    <h1>My Connections </h1>
                </div>
            </DashBoardLayout>
        </UserLayout>
    )
}
