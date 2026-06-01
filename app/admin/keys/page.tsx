import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminKeys() {
  const supabase = createClient()
  const { data: products } = await supabase.from('products').select('id, name, product_type')
  const { data: availableKeys } = await supabase.from('license_keys').select('product_id').eq('status', 'AVAILABLE')

  const countMap: Record<string, number> = {}
  availableKeys?.forEach((k: any) => { countMap[k.product_id] = (countMap[k.product_id] || 0) + 1 })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">License Keys / Stock</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((p: any) => (
          <div key={p.id} className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-white">{p.name}</h3>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
              <span>Type: {p.product_type}</span>
              <span>Available: <strong className="text-white">{countMap[p.id] || 0}</strong></span>
            </div>
            <Link href={`/admin/keys/${p.id}`} className="block text-center py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white">Manage Stock</Link>
          </div>
        ))}
      </div>
    </div>
  )
}