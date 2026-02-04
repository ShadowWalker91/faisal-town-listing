'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [color, setColor] = useState<string>('text-yellow-600')

  useEffect(() => {
    async function checkConnection() {
      try {
        // Attempt to fetch 1 row from the 'properties' table
        // Even if the table is empty, this should return status 200 (Success)
        const { data, error, status } = await supabase
          .from('properties')
          .select('*')
          .limit(1)

        if (error) {
            // Case: Credentials work, but maybe table is missing
            if (error.code === '42P01') {
                 setStatus('Connection Successful, but "properties" table is missing. Did you run the SQL?')
                 setColor('text-blue-600')
            } else {
                 // Case: Bad credentials or network error
                 setStatus(`Connection Failed: ${error.message}`)
                 setColor('text-red-600')
            }
        } else {
            // Case: Perfect success
            setStatus('✅ SUCCESS: Connected to Supabase and found "properties" table!')
            setColor('text-green-600')
        }
      } catch (err: any) {
        setStatus(`Unexpected Error: ${err.message}`)
        setColor('text-red-600')
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Supabase Status</h1>
        <div className={`text-lg font-medium ${color} p-4 rounded bg-opacity-10 bg-gray-200`}>
          {status}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          (Check your .env.local file if this fails)
        </p>
      </div>
    </div>
  )
}