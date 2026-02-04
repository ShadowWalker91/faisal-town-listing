"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, User } from "lucide-react"

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", company: "", phone: "", whatsapp: "", rating: "5" })

  const fetchAgents = async () => {
    const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: false })
    setAgents(data || [])
  }

  useEffect(() => { fetchAgents() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('agents').insert([form])
    if (!error) {
      setForm({ name: "", company: "", phone: "", whatsapp: "", rating: "5" })
      fetchAgents()
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ADD AGENT FORM */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Agents</h1>
        <Card>
            <CardHeader><CardTitle>Add New Agent</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <Label>Name</Label>
                        <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div>
                        <Label>Company</Label>
                        <Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Phone</Label>
                            <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                        </div>
                        <div>
                            <Label>WhatsApp</Label>
                            <Input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <Label>Manual Rating (1-5)</Label>
                        <Input type="number" max="5" min="1" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600">Save Agent</Button>
                </form>
            </CardContent>
        </Card>
      </div>

      {/* AGENT LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mt-2">Agent List</h2>
        {agents.map(agent => (
            <div key={agent.id} className="flex items-center gap-4 p-4 bg-white border rounded shadow-sm">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500"/>
                </div>
                <div className="flex-1">
                    <p className="font-bold">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.company}</p>
                </div>
                <div className="text-right">
                    <div className="font-medium text-yellow-600">★ {agent.rating}</div>
                    <Button variant="ghost" size="sm" className="text-red-500 h-6" onClick={async () => {
                        if(confirm('Delete agent?')) {
                            await supabase.from('agents').delete().eq('id', agent.id)
                            fetchAgents()
                        }
                    }}>Delete</Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}