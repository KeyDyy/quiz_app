'use client'
import FriendList from "@/components/FriendList";
import "./index.css";

export default function Home() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex justify-center">
            <FriendList />
        </div>
    );
}
