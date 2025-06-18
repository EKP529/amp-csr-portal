"use client";

// import Link from "next/link";
import Button from "./_components/button";

// import {HydrateClient } from "~/trpc/server";

export default function LandingPage() {
  return (
    // <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#00264B] to-[#0070DA] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
            <span className="text-[#0070DA]">AMP</span> Admin Portal
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <Button href="/api/auth/signin" text="Sign in"/>
              {/* <Link
                href={"/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                Sign in
              </Link> */}
            </div>
          </div>
        </div>
      </main>
    // </HydrateClient>
  );
}
