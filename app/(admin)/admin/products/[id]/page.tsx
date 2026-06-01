import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EditProduct({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single()
  
  if (!product) return <div>Not found</div>

  async function updateProduct(formData: FormData) {
    'use server'
    const s = createClient()
    await s.from('products').update({
      name: formData.get('name'),
      description: formData.get('description'),
      product_type: formData.get('product_type'),
      category: formData.get('category'),
      stock_behavior: formData.get('stock_behavior'),
      is_active: formData.get('is_active') === 'on'
    }).eq('id', params.id)
    redirect('/admin/products')
  }

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Link href="/admin/products" className="text-gray-400 hover:text-white">Cancel</Link>
      </div>
      
      <form action={updateProduct} className="space-y-6 bg-gray-900 p-6 rounded-lg border border-gray-800">
        <div>
          <label className="block mb-2 text-sm text-gray-400">Name</label>
          <input name="name" defaultValue={product.name} required className="w-full p-2 bg-gray-800 rounded border border-gray-700" />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-400">Description</label>
          <textarea name="description" defaultValue={product.description} rows={4} className="w-full p-2 bg-gray-800 rounded border border-gray-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm text-gray-400">Type</label>
            <select name="product_type" defaultValue={product.product_type} className="w-full p-2 bg-gray-800 rounded border border-gray-700">
              <option value="KEY">License Key</option>
              <option value="LOGIN">Login Credentials</option>
              <option value="SERVICE">Service (Manual)</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-400">Category</label>
            <select name="category" defaultValue={product.category} className="w-full p-2 bg-gray-800 rounded border border-gray-700">
              <option value="ROOT">Root</option>
              <option value="NON_ROOT">Non Root</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">Stock Behavior</label>
          <select name="stock_behavior" defaultValue={product.stock_behavior} className="w-full p-2 bg-gray-800 rounded border border-gray-700">
            <option value="SHOW_OUT_OF_STOCK">Show Out of Stock immediately</option>
            <option value="ALLOW_PENDING">Allow purchase as Pending (Manual fulfillment)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={product.is_active} className="w-4 h-4" />
          <label htmlFor="is_active">Product is Active (visible to users)</label>
        </div>

        <button className="px-6 py-2 bg-primary text-white rounded">Save Changes</button>
      </form>
    </div>
  )
}