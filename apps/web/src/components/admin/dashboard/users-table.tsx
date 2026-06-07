import type { PublicUser } from "@app/shared";
import { formatDate } from "@/lib/utils";

interface Props {
  users: PublicUser[];
  total: number;
}

export function UsersTable({ users, total }: Props) {
  return (
    <div className="card overflow-hidden">
      <h2 className="border-b border-ink-800 px-5 py-4 font-semibold">
        Usuarios ({total})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-900/60 text-ink-200">
            <tr>
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Alta</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-ink-800">
                <td className="px-5 py-3">{u.name}</td>
                <td className="px-5 py-3 text-ink-200">{u.email}</td>
                <td className="px-5 py-3">{u.role}</td>
                <td className="px-5 py-3 text-ink-200">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
