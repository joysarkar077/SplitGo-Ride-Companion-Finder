"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Dashboard = () => {
  const session = useSession();
  const user = session.data?.user;
  console.log(user);
  return (
    <div className="p-4 mt-96">
      <h1>Welcome {user?.username}</h1>
    </div>
  );
};

export default Dashboard;
