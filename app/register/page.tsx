import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  async function signUp(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    const phone = formData.get('phone') as string
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { username, phone } } })
    if (!error) redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-[#0a0a0a]">
      <form action={signUp} className="p-8 bg-gray-900 rounded-lg w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-white">Create Account</h2>
        <div className="space-y-4">
          <input name="username" type="text" placeholder="Username" required className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
          <input name="phone" type="text" placeholder="Phone Number" required className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
          <input name="email" type="email" placeholder="Email" required className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
          <input name="password" type="password" placeholder="Password" required className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
          <button type="submit" className="w-full py-3 bg-[#0070f3] text-white rounded hover:bg-blue-600">Register</button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">Already have an account? <Link href="/login" className="text-[#0070f3]">Login here</Link></p>
      </form>
    </div>
  )
}