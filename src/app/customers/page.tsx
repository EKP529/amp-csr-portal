/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { api } from "~/trpc/server"

export default async function UserList() {
  const users = await api.customer.getAll();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#00264B] to-[#0070DA] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-center">
          <span className="text-[#0070DA]">AMP</span> Admin Portal
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-lg mb-4">User List Page</div>
            <ul>
              {users ? users.map((user) => (
                <li key={user.id}>
                  <div className="flex flex-row items-center justify-center gap-2 border-amber-950 border-2 rounded-lg p-4 mb-4">
                    <span className="text-lg font-semibold">{user.name}</span>
                    <span className="text-sm text-gray-300">{user.email}</span>
                  </div>
                </li>
              )) : <li> No users found</li>}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}