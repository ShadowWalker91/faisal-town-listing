"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Loader2 } from "lucide-react"

export default function SectorsPage() {
  const [sectors, setSectors] = useState<any[]>([])
  const [newSector, setNewSector] = useState("")
  const [loading, setLoading] = useState(true)

  // For Loading Old Sectors
  const fetchSectors = async () => {
    setLoading(true)
    const { data } = await supabase.from('sectors').select('*').order('name', { ascending: true })
    setSectors(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchSectors() }, [])

  // For Adding New Sector
  const handleAdd = async () => {
    if (!newSector) return
    const { error } = await supabase.from('sectors').insert([{ name: newSector }])
    if (error) alert(error.message)
    else {
      setNewSector("")
      fetchSectors()
    }
  }

  // For Deleting Sector
  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure? This might affect properties linked to this sector.")) return
    const { error } = await supabase.from('sectors').delete().eq('id', id)
    if (!error) fetchSectors()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Sectors</h1>
      
      <Card className="mb-8">
        <CardHeader><CardTitle>Add New Sector</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            placeholder="e.g. Sector H" 
            value={newSector} 
            onChange={(e) => setNewSector(e.target.value)} 
          />
          <Button onClick={handleAdd} className="bg-emerald-600"><Plus className="w-4 h-4 mr-2"/> Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Sectors</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="animate-spin" /> : (
            <div className="space-y-2">
              {sectors.map((sector) => (
                <div key={sector.id} className="flex items-center justify-between p-3 border rounded bg-slate-50">
                  <span className="font-medium">{sector.name}</span>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(sector.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}