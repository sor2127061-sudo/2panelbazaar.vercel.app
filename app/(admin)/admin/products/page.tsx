import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminProducts() {
  const supabase = createClient()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-primary text-white rounded">Add Product</Link>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products?.map(p => (
              <tr key={p.id}>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.product_type}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">
                  <span className={p.is_active ? 'text-green-400' : 'text-gray-500'}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/admin/products/${p.id}`} className="text-primary hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}