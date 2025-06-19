/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { api } from "~/trpc/server"
import Table from "../_components/table";

export default async function UserList() {
  const users = await api.customer.getAllDisplay();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#00264B] to-[#0070DA] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
          <span className="text-[#0070DA]">AMP</span> Admin Portal
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <Table items={users as object[]} />
          </div>
        </div>
      </div>
    </main>
  );
}