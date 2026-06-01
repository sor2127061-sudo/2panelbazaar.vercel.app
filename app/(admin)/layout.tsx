import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-primary mb-8">Admin Panel</h2>
        <Link href="/admin" className="text-gray-300 hover:text-white">Overview</Link>
        <Link href="/admin/products" className="text-gray-300 hover:text-white">Products</Link>
        <Link href="/admin/keys" className="text-gray-300 hover:text-white">License Keys</Link>
        <Link href="/admin/orders" className="text-gray-300 hover:text-white">Orders</Link>
        <Link href="/admin/users" className="text-gray-300 hover:text-white">Users</Link>
        <Link href="/admin/transactions" className="text-gray-300 hover:text-white">Transactions</Link>
        <Link href="/admin/settings" className="text-gray-300 hover:text-white">Settings</Link>
        <div className="mt-auto pt-8">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300">&larr; Back to App</Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}