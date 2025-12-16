'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { ChatMessage } from '@/shared-types'
import { Send, Bot, User } from 'lucide-react'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: threads } = useQuery({
    queryKey: ['chat', 'threads'],
    queryFn: async () => {
      const response = await api.get('/chat/threads')
      return response.data
    },
  })

  const { data: threadData, refetch: refetchThread } = useQuery({
    queryKey: ['chat', 'thread', threadId],
    queryFn: async () => {
      if (!threadId) return null
      const response = await api.get(`/chat/threads/${threadId}`)
      return response.data
    },
    enabled: !!threadId,
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      return api.post('/chat/message', { message: text, threadId })
    },
    onSuccess: (response) => {
      setMessage('')
      if (response.data.threadId) {
        setThreadId(response.data.threadId)
      }
      refetchThread()
    },
  })

  useEffect(() => {
    if (threads && threads.length > 0 && !threadId) {
      setThreadId(threads[0].id)
    }
  }, [threads, threadId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadData?.messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message)
    }
  }

  const messages = threadData?.messages || []

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Trading Assistant</h1>
        <p className="text-gray-600 mt-2">Ask questions and get intelligent trading insights</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Start a conversation with the AI assistant</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try asking: "Is today good to trade?" or "Why is EURUSD weak?"
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg: ChatMessage) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.creditsCost && (
                    <p className="text-xs opacity-70 mt-1">
                      Cost: {msg.creditsCost} credits
                    </p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question..."
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button type="submit" disabled={sendMessageMutation.isPending || !message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </>
  )
}

