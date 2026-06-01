import { createClient } from '@/lib/supabase/server'

export default async function AdminOrders() {
  const supabase = createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(email), products(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Orders</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">User</th>
              <th className="p-4">Product</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders?.map(o => (
              <tr key={o.id}>
                <td className="p-4 text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-4">{o.profiles?.email}</td>
                <td className="p-4">{o.products?.name}</td>
                <td className="p-4">৳ {o.amount_paid}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded ${o.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-500' : 'bg-gray-800'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4">
                  {o.status === 'PENDING' && (
                    <button className="text-primary text-sm hover:underline">Fulfill</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}