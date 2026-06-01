import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*, product_packages(*)')
    .eq('id', params.id)
    .single()

  if (!product) return <div>Product not found</div>

  async function handleBuy(formData: FormData) {
    'use server'
    const package_id = formData.get('package_id') as string
    const s = createClient()
    const { data: { user } } = await s.auth.getUser()
    
    if (!user) redirect('/login')
    
    const { data, error } = await s.rpc('process_purchase', {
      p_user_id: user.id,
      p_product_id: product.id,
      p_package_id: package_id
    })

    if (data?.error === 'INSUFFICIENT_BALANCE') {
      redirect(`/wallet/topup`)
    }
    
    if (data?.success) {
      redirect('/orders')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-block">&larr; Back to Products</Link>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="inline-block px-2 py-1 text-xs bg-gray-800 rounded mb-4">{product.category}</div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-400 mb-8 whitespace-pre-wrap">{product.description}</p>
          
          <form action={handleBuy} className="space-y-6">
            <h3 className="text-lg font-medium">Select Package</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.product_packages?.map((pkg: any) => (
                <label key={pkg.id} className="relative flex cursor-pointer rounded-lg border bg-gray-800 border-gray-700 p-4 shadow-sm focus:outline-none has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary">
                  <input type="radio" name="package_id" value={pkg.id} className="sr-only" required />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-white">{pkg.duration_days} Days</span>
                      <span className="mt-1 flex items-center text-sm text-gray-400">৳ {pkg.price}</span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <button className="w-full py-4 bg-primary text-white rounded hover:bg-blue-600 font-medium text-lg">
                Buy Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}