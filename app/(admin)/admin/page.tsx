import { createClient } from '@/lib/supabase/server'

export default async function AdminOverview() {
  const supabase = createClient()
  
  const [{ count: usersCount }, { count: ordersCount }, { data: revenue }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('amount_paid').eq('status', 'COMPLETED')
  ])

  const totalRevenue = revenue?.reduce((sum, order) => sum + Number(order.amount_paid), 0) || 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-400">৳ {totalRevenue}</p>
        </div>
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="text-gray-400 mb-2">Total Orders</h3>
          <p className="text-4xl font-bold">{ordersCount || 0}</p>
        </div>
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="text-gray-400 mb-2">Total Users</h3>
          <p className="text-4xl font-bold">{usersCount || 0}</p>
        </div>
      </div>
    </div>
  )
}