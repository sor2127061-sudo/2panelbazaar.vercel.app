import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function NewProduct() {
  async function createProduct(formData: FormData) {
    'use server'
    const supabase = createClient()
    const { data } = await supabase.from('products').insert({
      name: formData.get('name'),
      description: formData.get('description'),
      product_type: formData.get('product_type'),
      category: formData.get('category'),
      stock_behavior: formData.get('stock_behavior'),
      is_active: formData.get('is_active') === 'on'
    }).select().single()
    if (data) redirect(`/admin/products/${data.id}`)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-white">New Product</h1><Link href="/admin/products" className="text-gray-400 hover:text-white">Cancel</Link></div>
      <form action={createProduct} className="space-y-6 bg-gray-900 p-6 rounded-lg border border-gray-800">
        <div><label className="block mb-2 text-sm text-gray-400">Name</label><input name="name" required className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white" /></div>
        <div><label className="block mb-2 text-sm text-gray-400">Description</label><textarea name="description" rows={4} className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block mb-2 text-sm text-gray-400">Type</label><select name="product_type" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"><option value="KEY">License Key</option><option value="LOGIN">Login Credentials</option><option value="SERVICE">Service</option></select></div>
          <div><label className="block mb-2 text-sm text-gray-400">Category</label><select name="category" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"><option value="ROOT">Root</option><option value="NON_ROOT">Non Root</option><option value="VIP">VIP</option></select></div>
        </div>
        <div><label className="block mb-2 text-sm text-gray-400">Stock Behavior</label><select name="stock_behavior" className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"><option value="SHOW_OUT_OF_STOCK">Show Out of Stock</option><option value="ALLOW_PENDING">Allow Pending Order</option></select></div>
        <div className="flex items-center gap-2"><input type="checkbox" name="is_active" id="ia" defaultChecked className="w-4 h-4" /><label htmlFor="ia" className="text-gray-300">Active</label></div>
        <button type="submit" className="px-6 py-2 bg-[#0070f3] text-white rounded">Create Product</button>
      </form>
    </div>
  )
}