import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProductPackages({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: product } = await supabase.from('products').select('name').eq('id', params.id).single()
  const { data: packages } = await supabase.from('product_packages').select('*').eq('product_id', params.id).order('duration_days')

  async function addPackage(formData: FormData) {
    'use server'
    const s = createClient()
    await s.from('product_packages').insert({ product_id: params.id, duration_days: Number(formData.get('duration_days')), price: Number(formData.get('price')), is_active: formData.get('is_active') === 'on' })
    redirect(`/admin/products/${params.id}/packages`)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-white">Packages: {product?.name}</h1><Link href="/admin/products" className="text-gray-400 hover:text-white">&larr; Back</Link></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form action={addPackage} className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Add Package</h2>
          <div><label className="block text-sm text-gray-400 mb-1">Duration</label><select name="duration_days" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"><option value="1">1 Day</option><option value="3">3 Days</option><option value="7">7 Days</option><option value="15">15 Days</option><option value="30">30 Days</option></select></div>
          <div><label className="block text-sm text-gray-400 mb-1">Price (৳)</label><input name="price" type="number" step="0.01" min="1" required className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked className="w-4 h-4" /><label className="text-gray-300">Active</label></div>
          <button type="submit" className="w-full py-2 bg-[#0070f3] text-white rounded">Add Package</button>
        </form>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Existing ({packages?.length || 0})</h2>
          {packages?.map((pkg: any) => (
            <div key={pkg.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg flex justify-between items-center">
              <div><div className="font-bold text-white">{pkg.duration_days} Days</div><div className="text-gray-400">৳ {pkg.price}</div></div>
              <span className={pkg.is_active ? 'text-green-400 text-sm' : 'text-gray-500 text-sm'}>{pkg.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}