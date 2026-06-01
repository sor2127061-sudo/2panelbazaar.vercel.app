import { createClient } from '@/lib/supabase/server'

export default async function AdminSettings() {
  const supabase = createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').order('key')

  async function updateSettings(formData: FormData) {
    'use server'
    const s = createClient()
    for (const [key, value] of formData.entries()) {
      await s.from('site_settings').update({ value: value.toString() }).eq('key', key)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      <form action={updateSettings} className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-6">
        {settings?.map(setting => (
          <div key={setting.key}>
            <label className="block mb-2 text-sm text-gray-400 font-mono">{setting.key}</label>
            {setting.key === 'site_notice' ? (
              <textarea name={setting.key} defaultValue={setting.value} rows={4} className="w-full p-2 bg-gray-800 rounded border border-gray-700 font-mono" />
            ) : (
              <input name={setting.key} defaultValue={setting.value} className="w-full p-2 bg-gray-800 rounded border border-gray-700 font-mono" />
            )}
          </div>
        ))}
        <button className="px-6 py-2 bg-primary text-white rounded">Save Settings</button>
      </form>
    </div>
  )
}