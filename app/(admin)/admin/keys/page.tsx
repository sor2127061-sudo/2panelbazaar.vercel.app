import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminKeys() {
  const supabase = createClient()
  
  // Aggregate un-sold keys per product
  const { data: products } = await supabase
    .from('products')
    .select('id, name, product_type, license_keys(id)')
    .eq('license_keys.status', 'AVAILABLE')

  const stats = products?.map(p => ({
    ...p,
    availableCount: p.license_keys.length
  }))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">License Keys / Stock</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats?.map(p => (
          <div key={p.id} className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <h3 className="text-lg font-bold mb-2">{p.name}</h3>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
              <span>Type: {p.product_type}</span>
              <span>Available: <strong className="text-white">{p.availableCount}</strong></span>
            </div>
            <Link 
              href={`/admin/keys/${p.id}`}
              className="block text-center py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              Manage Stock
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}