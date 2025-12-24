import Head from "next/head";
// import Image from "next/image";
import styles from "../styles/Home.module.css"; // relative path instead of '@'

// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return ( 
    <UserLayout>
      <div className={styles.container}>

        <div className={styles.mainContainer}>

          <div className={styles.mainContainer_left}>

            <p>Connect with Friends</p>
            <p>A platform to connect with like-minded professionals.</p>

            <div onClick={() => {
              router.push('/login')
              
            }} className={styles.buttonJoin  }>
              <p>Join Now</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            {/* <img src="/images/homePage_connection.jpg" alt="" /> */}
            <img src="/images/homePage_connection.jpg" alt="" />
          </div>
        </div>
      </div>
    </UserLayout >
  );
}
