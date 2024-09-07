"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="p-4 md:p-6 shadow-md fixed top-0 left-0 right-0 bg-white">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <Link href={"/"} className="text-xl font-bold mb-4 md:mb-0">
          <Image src="/SplitGo.svg" alt="logo" width={80} height={80}></Image>
        </Link>
        {session ? (
          <Button className="w-auto" onClick={() => signOut()}>
            Sign Out
          </Button>
        ) : (
          <Link href={"/sign-in"}>
            <Button className="w-auto">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
