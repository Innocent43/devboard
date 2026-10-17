"use client";
import React, { useState } from "react";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "../lib/auth-context";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { dashboardPathFor } from "../lib/auth-context";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { user, loading, logout } = useAuth();

  const router = useRouter();
  const dashboardHref = user ? dashboardPathFor(user.role) : "/auth/login";

  const showPostJob = !user || user.role == "employer";

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.push("/");
  };
  return (
    <>
      <Link className="font-bold text-[16px]" href="/jobs" onClick={onNavigate}>
        Find Jobs
      </Link>

      {showPostJob && (
        <Link
          className="font-bold text-[16px]"
          href="/company/postjobs"
          onClick={onNavigate}
        >
          Post a Job
        </Link>
      )}

      {loading ? null : user ? (
        <>
          <Link
            className="font-bold text-[16px]"
            href={dashboardHref}
            onClick={onNavigate}
          >
            Dashboard
          </Link>
          <button
            type="button"
            className="font-bold text=[16px]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          className="font-bold text-[16px]"
          href="/auth/login"
          onClick={onNavigate}
        >
          Login
        </Link>
      )}
    </>
  );
}

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="hidden sm:flex md:max-w-[1460px] w-full sm:py-5 bg-white text-black  justify-between sm:px-10 items-center">
      <div>
        <Link href="/">
          <h3 className={`font-bold text-[20px] `}>JobBoard</h3>
        </Link>
      </div>
      {/*  */}
      {/*  */}
      <nav className="flex gap-[24px]">
        {/* <Link className={`font-bold text-[16px]`} href="/jobs">
          Find Jobs
        </Link>
        <Link className="font-bold text-[16px]" href="/company/postjobs">
          Post a Job
        </Link>
        <Link className="font-bold text-[16px]" href="/auth/login">
          Login
        </Link> */}

        <NavLinks />
      </nav>
    </header>
  );
}

export const MobileHeader = () => {
  const [isopen, setisopen] = useState<boolean>(false);

  const toggleburger = () => {
    setisopen((prev) => !prev);
  };
  return (
    <header className="block bg-white  sm:hidden">
      <div className="flex justify-between items-center p-4">
        <Link href="/">
          <h3 className="font-bold text-[20px]">JobBoard</h3>
        </Link>

        <div>
          <button type="button" className="text-3xl" onClick={toggleburger}>
            <RxHamburgerMenu />
          </button>
        </div>
      </div>

      {/*  */}

      {/*  */}

      <nav
        className={`flex flex-col absolute shadow-xl text-center transition-all duration-300 ease-in-out z-50 bg-white p-4 w-full left-0  gap-[24px] invisible ${isopen ? "visible" : "invisible"}
        ${isopen ? "top-[0px] opacity-100 pointer-events-auto" : "top-[-200px] opacity-0 pointer-events-none"} `}
      >
        {/* <Link className="font-bold text-[16px]" href="/jobs">
          Find Jobs
        </Link>
        <Link className="font-bold text-[16px]" href="/company/postjobs">
          Post a Job
        </Link>
        <Link className="font-bold text-[16px]" href="/auth/login">
          Login
        </Link> */}
        {/* <NavLinks /> */}
        <NavLinks onNavigate={() => setisopen(false)} />
      </nav>
      {isopen && (
        <div
          onClick={toggleburger}
          className="w-full h-screen fixed bg-black/40"
        ></div>
      )}
    </header>
  );
};
