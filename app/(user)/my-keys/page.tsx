import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function MyKeysPage() {
  const supabase = createClient()
  const { data: keys } = await supabase
    .from('license_keys')
    .select('*, products(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center py-6 mb-8 border-b border-gray-800">
        <h1 className="text-2xl font-bold">My Keys</h1>
        <Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
      </header>

      <div className="space-y-4">
        {keys?.map(key => (
          <div key={key.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <h3 className="font-medium text-lg mb-2">{key.products?.name}</h3>
            {key.key_value && <p className="font-mono bg-black p-2 rounded text-primary">{key.key_value}</p>}
            {key.login_user && (
              <div className="space-y-1">
                <p>User: <span className="font-mono text-primary">{key.login_user}</span></p>
                <p>Pass: <span className="font-mono text-primary">{key.login_pass}</span></p>
              </div>
            )}
            {key.service_content && (
              <div className="mt-2 text-gray-300" dangerouslySetInnerHTML={{ __html: key.service_content }} />
            )}
            <p className="text-xs text-gray-500 mt-4">Expires: {new Date(key.expires_at).toLocaleDateString()}</p>
          </div>
        ))}
        {(!keys || keys.length === 0) && (
          <p className="text-gray-500 py-8 text-center">No keys found.</p>
        )}
      </div>
    </div>
  )
}