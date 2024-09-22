'use client';
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { BellDot, MessageCircle, User2 } from "lucide-react";
import NotificationsPage from "./Notification"; // Import the NotificationsPage

const Navbar = () => {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  return (
    <nav className="p-4 md:p-3 shadow-md fixed top-0 left-0 right-0 bg-white z-50">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <Link href={"/"} className="text-xl font-bold mb-4 md:mb-0">
            <Image src="/SplitGo.svg" alt="logo" width={100} height={100}></Image>
          </Link>

          <Link href={"/rides"} className="text-base font-bold mb-4 md:mb-0">
            Ride
          </Link>
          <Link href={"/about-us"} className="text-base font-bold mb-4 md:mb-0">
            About
          </Link>
          <Link href={"/help"} className="text-base font-bold mb-4 md:mb-0">
            Help
          </Link>
        </div>

        {session ? (
          <div className="flex flex-row items-center gap-4">
            <Link href={"/user/trips"} className="text-base font-bold mb-4 md:mb-0">
              Trip
            </Link>
            <div ref={notificationRef} className="relative">
              <BellDot
                className="cursor-pointer"
                onClick={() => setShowNotifications((prev) => !prev)}
              />
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
                  <NotificationsPage /> {/* Display the Notifications component here */}
                </div>
              )}
            </div>

            <Link href={"/chat-group-list"} className="text-base font-bold mb-4 md:mb-0">
              <MessageCircle />
            </Link>
            <Link href={"/user/profile"} className="text-base font-bold mb-4 md:mb-0">
              <User2 />
            </Link>
            <Button className="w-auto" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        ) : (
          <div>
            <Link href={"/sign-in"}>
              <Button variant={"ghost"} className="w-auto">Sign In</Button>
            </Link>
            <Link href={"/sign-up"}>
              <Button className="w-auto rounded-lg">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
