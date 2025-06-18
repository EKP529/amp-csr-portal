// import { auth } from "~/server/auth";
// import { redirect } from "next/navigation";
// import type { Session } from "next-auth";
// import { HydrateClient } from "~/trpc/server";
import Button from "../_components/button";

export default function HomePage() {
  // let session: Session | null | undefined;

  // void (async () => {
  //   session = await auth();
  // })().catch((error) => {
  //   console.error("Error fetching session:", error);
  // });

  // if (!session?.user) {
  //   console.log('Session.user: ', session?.user)
  //   // If the user is not authenticated, redirect to the landing page
  //   redirect("/customers");
  // }

  return (
    // <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#00264B] to-[#0070DA] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Welcome to the <span className="text-[#0070DA]">AMP</span> Customer
            Service Rep Portal
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-row items-center justify-center">
                <Button href="/customers" text="View All Customers"/>
                <Button href="/customers/search" text="Find a Customer"/>
              </div>
            </div>
          </div>
          <Button href="/api/auth/signout" text="Sign out"/>
        </div>
      </main>
    // </HydrateClient>
  );
}
