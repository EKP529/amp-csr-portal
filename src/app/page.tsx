import LinkButton from "./_components/linkbutton";
import LoginIcon from "@mui/icons-material/Login";
import Background from "./_components/background";

export default function LandingPage() {
  return (
    <Background>
      <div className="h-full flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-accent">AMP</span> Admin Portal
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <LinkButton
              href="/api/auth/signin"
              text="Sign in"
              endIcon={<LoginIcon />}
            />
          </div>
        </div>
      </div>
    </Background>
  );
}
