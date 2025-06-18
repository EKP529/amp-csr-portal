import Button from "./_components/button";

export default function LandingPage() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#00264B] to-[#0070DA] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
            <span className="text-[#0070DA]">AMP</span> Admin Portal
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <Button href="/api/auth/signin" text="Sign in"/>
            </div>
          </div>
        </div>
      </main>
  );
}
