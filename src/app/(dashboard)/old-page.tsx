// import { auth } from "~/server/auth";
// import { redirect } from "next/navigation";
// import type { Session } from "next-auth";
import Background from "../_components/background";
import LinkButton from "../_components/linkbutton";
import LogoutIcon from "@mui/icons-material/Logout";

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
      <Background>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="text-center text-white text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[#0070DA]">AMP</span><br/> Customer Service Representative<br/> Portal
          </div>
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-row items-center justify-center">
                <LinkButton href="/customers" text="View All Customers" />
              </div>
            </div>
          </div>
          <LinkButton
            href="/api/auth/signout"
            text="Sign out"
            endIcon={<LogoutIcon />}
          />
        </div>
      </Background>
  );
}
