import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminKeysManage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single()
  const { data: packages } = await supabase.from('product_packages').select('*').eq('product_id', params.id)
  const { data: keys } = await supabase.from('license_keys').select('*').eq('product_id', params.id).order('created_at', { ascending: false })
  if (!product) return <div className="text-white p-8">Product not found</div>

  async function addKeys(formData: FormData) {
    'use server'
    const s = createClient()
    const package_id = (formData.get('package_id') as string) || null
    if (product.product_type === 'KEY') {
      const bulk = (formData.get('bulk_keys') as string).split('\n').map(k => k.trim()).filter(Boolean)
      await s.from('license_keys').insert(bulk.map(key_value => ({ product_id: product.id, package_id, key_value })))
    } else if (product.product_type === 'LOGIN') {
      await s.from('license_keys').insert({ product_id: product.id, package_id, login_user: formData.get('login_user'), login_pass: formData.get('login_pass') })
    } else {
      await s.from('license_keys').insert({ product_id: product.id, package_id, service_content: formData.get('service_content') })
    }
    redirect(`/admin/keys/${product.id}`)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-white">Stock: {product.name}</h1><Link href="/admin/keys" className="text-gray-400 hover:text-white">&larr; Back</Link></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form action={addKeys} className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Add Stock</h2>
          <div><label className="block text-sm text-gray-400 mb-1">Package</label><select name="package_id" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"><option value="">Any (Global)</option>{packages?.map((p: any) => <option key={p.id} value={p.id}>{p.duration_days}d - ৳{p.price}</option>)}</select></div>
          {product.product_type === 'KEY' && <div><label className="block text-sm text-gray-400 mb-1">Keys (one per line)</label><textarea name="bulk_keys" rows={8} className="w-full p-2 bg-gray-800 rounded border border-gray-700 font-mono text-white" required /></div>}
          {product.product_type === 'LOGIN' && <><div><label className="block text-sm text-gray-400 mb-1">Username</label><input name="login_user" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white" required /></div><div><label className="block text-sm text-gray-400 mb-1">Password</label><input name="login_pass" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white" required /></div></>}
          {product.product_type === 'SERVICE' && <div><label className="block text-sm text-gray-400 mb-1">Content (HTML)</label><textarea name="service_content" rows={8} className="w-full p-2 bg-gray-800 rounded border border-gray-700 font-mono text-white" required /></div>}
          <button type="submit" className="w-full py-2 bg-[#0070f3] text-white rounded">Add Stock</button>
        </form>
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Current ({keys?.length || 0})</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-y-auto max-h-[600px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800 text-gray-400 sticky top-0"><tr><th className="p-3">Data</th><th className="p-3">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-800">
                {keys?.map((k: any) => <tr key={k.id}><td className="p-3 font-mono text-gray-300 truncate max-w-[200px]">{k.key_value || k.login_user || 'Service'}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded ${k.status === 'AVAILABLE' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>{k.status}</span></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}