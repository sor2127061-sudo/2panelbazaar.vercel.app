import { verifyRedirectSignature } from '@/lib/verifytaka'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function WalletSuccess({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const isValid = verifyRedirectSignature({
    txn_id: searchParams.txn_id,
    amount: searchParams.amount,
    merchant_order_id: searchParams.merchant_order_id,
    session_id: searchParams.session_id,
    timestamp: searchParams.timestamp,
    signature: searchParams.signature,
  })

  if (isValid) {
    const supabase = createAdminClient()
    const { data: txn } = await supabase.from('transactions').select('user_id').eq('merchant_order_id', searchParams.merchant_order_id).single()
    
    if (txn?.user_id) {
      await supabase.rpc('credit_wallet', {
        p_user_id: txn.user_id,
        p_amount: searchParams.amount,
        p_merchant_order_id: searchParams.merchant_order_id,
        p_vt_txn_id: searchParams.txn_id,
        p_mfs_type: 'BKASH',
      })
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-12 text-center">
      <div className={`p-8 rounded-lg border ${isValid ? 'bg-green-900/20 border-green-900' : 'bg-red-900/20 border-red-900'}`}>
        <h1 className="text-2xl font-bold mb-4">{isValid ? 'Payment Successful' : 'Payment Verification Failed'}</h1>
        <p className="text-gray-400 mb-6">
          {isValid 
            ? `Successfully added ৳${searchParams.amount} to your wallet.` 
            : 'The payment signature could not be verified. If money was deducted, contact support.'}
        </p>
        <Link href="/dashboard" className="px-6 py-2 bg-gray-800 rounded hover:bg-gray-700">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}