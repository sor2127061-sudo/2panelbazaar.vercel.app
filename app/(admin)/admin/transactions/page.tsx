import { createClient } from '@/lib/supabase/server'

export default async function AdminTransactions() {
  const supabase = createClient()
  const { data: txns } = await supabase
    .from('transactions')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Transactions</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">User</th>
              <th className="p-4">Type</th>
              <th className="p-4">MFS</th>
              <th className="p-4">Amount</th>
              <th className="p-4">TrxID</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {txns?.map(t => (
              <tr key={t.id}>
                <td className="p-4 text-gray-400">{new Date(t.created_at).toLocaleString()}</td>
                <td className="p-4">{t.profiles?.email}</td>
                <td className="p-4">{t.type}</td>
                <td className="p-4">{t.mfs_type || '-'}</td>
                <td className="p-4 font-bold">৳ {t.amount}</td>
                <td className="p-4 font-mono text-xs">{t.vt_txn_id || '-'}</td>
                <td className="p-4">
                  <span className={t.status === 'VERIFIED' ? 'text-green-400' : 'text-yellow-400'}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}