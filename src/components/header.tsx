import React from "react";
import Link from "next/link";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function MainHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold">Sweat Station</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;
