import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../app/features/userSlice";
import { useNavigate } from "react-router-dom";

export default function UserWrapper({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state?.user?.user?.user);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      await dispatch(getUserProfile()).unwrap();
    } catch (err) {
      console.error("Error fetching user data:", err);
      navigate("/login");
    } finally {
      setLoading(false); // Ensure loading is set to false even if there's an error
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data on mount
  }, [dispatch, navigate]); // Include dispatch in dependency array

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login"); // Redirect to login if the user is not authenticated
  //   }
  // }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }
  if (!user) {
    navigate("/login"); // Redirect to login if the user is not authenticated
  }

  return <>{children}</>; // Render  children after loading is complete
}
