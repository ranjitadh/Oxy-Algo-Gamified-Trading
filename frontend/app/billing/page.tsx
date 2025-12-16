'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditBadge } from '@/components/CreditBadge'
import api from '@/lib/api'

export default function BillingPage() {
  const { data: balance } = useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: async () => {
      const response = await api.get('/credits/balance')
      return response.data.balance as number
    },
  })

  const { data: ledger } = useQuery({
    queryKey: ['credits', 'ledger'],
    queryFn: async () => {
      const response = await api.get('/credits/ledger')
      return response.data.ledger
    },
  })

  const { data: subscriptions } = useQuery({
    queryKey: ['billing', 'subscriptions'],
    queryFn: async () => {
      const response = await api.get('/billing/subscriptions')
      return response.data
    },
  })

  const creditPacks = [
    { credits: 100, price: 9.99 },
    { credits: 500, price: 39.99 },
    { credits: 1000, price: 69.99 },
    { credits: 5000, price: 299.99 },
  ]

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Credits</h1>
        <p className="text-gray-600 mt-2">Manage your credits and subscriptions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Credit Packs</CardTitle>
            <CardDescription>Purchase credits to use for AI requests and strategy activations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creditPacks.map((pack) => (
                <Card key={pack.credits} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold">{pack.credits}</p>
                        <p className="text-sm text-gray-500">Credits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${pack.price}</p>
                        <p className="text-sm text-gray-500">
                          ${(pack.price / pack.credits).toFixed(3)}/credit
                        </p>
                      </div>
                    </div>
                    <Button className="w-full">Purchase</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <CreditBadge credits={balance || 0} />
            </div>
          </CardContent>
        </Card>
      </div>

      {ledger && ledger.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Credit History</CardTitle>
            <CardDescription>Recent credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ledger.slice(0, 20).map((entry: any) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{entry.reason.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      entry.delta > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {entry.delta > 0 ? '+' : ''}{entry.delta}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {subscriptions && subscriptions.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{sub.plan}</p>
                    <p className="text-sm text-gray-500">Status: {sub.status}</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

