import { createClient } from '@/lib/supabase/server'

export default async function AdminUsers() {
  const supabase = createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Wallet</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users?.map(u => (
              <tr key={u.id}>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.phone}</td>
                <td className="p-4 font-mono text-green-400">৳ {u.wallet_balance}</td>
                <td className="p-4">{u.is_admin ? 'Admin' : 'User'}</td>
                <td className="p-4">
                  {u.is_banned ? <span className="text-red-500">Banned</span> : 'Active'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}