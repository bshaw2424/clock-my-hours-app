import { useEffect, useState } from "react";
import { useUser } from "../Context/useUser";
import axios from "axios";

interface User {
  username: string;
}

const Dashboard = () => {
  const [usernames, setUsernames] = useState<User>({});
  const { userId } = useUser();

  // const [csrfToken, setCsrfToken] = useState("");

  // useEffect(() => {
  //   const getCsrfToken = async () => {
  //     try {
  //       const response = await axios.get("http://127.0.0.1:8000/token/", {
  //         withCredentials: true, // ensures cookies (including csrf) are sent
  //       });
  //       setCsrfToken(response.data.csrfToken); // Make sure your backend returns the CSRF token as 'csrfToken'
  //     } catch (error) {
  //       console.error("Error fetching CSRF Token:", error);
  //     }
  //   };
  //   getCsrfToken();
  // }, []);
  console.log(`username ${userId}`);
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/user/${userId}/`,
          {
            withCredentials: true,
          },
        );
        console.log(usernames);
        setUsernames(response.data);
      } catch (error) {
        console.log("there was an error " + error);
      }
    };
    getUserInfo();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }} className="container">
      <h1 className=" mt-5 bg-dark text-white py-3 px-5">
        Welcome {usernames.username}
      </h1>
    </div>
  );
};

export default Dashboard;
