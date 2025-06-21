import { HydrateClient } from "~/trpc/server";

export default function Background({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <HydrateClient>
      <main className="h-screen bg-gradient-to-br from-primary to-accent">
        {children}
      </main>
    </HydrateClient>
  );
}
