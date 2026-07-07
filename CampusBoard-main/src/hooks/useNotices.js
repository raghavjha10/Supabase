/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotices = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notices:', error)
    } else {
      console.log('Fetched notices:', data)
      setNotices(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNotices()
  }, [fetchNotices])

  const addNotice = async (title, content, userId) => {
    const { data, error } = await supabase
      .from('notices')
      .insert({ title, content, user_id: userId })
      .select()

    if (!error && data && data.length > 0) {
      setNotices((prev) => [data[0], ...prev])
      
      // Create a self-notification to demonstrate the realtime notification pipeline
      await supabase.from('notifications').insert({
        user_id: userId,
        message: `You posted: "${title}"`
      })
    }
    return { error }
  }

  const deleteNotice = async (id) => {
    const { error } = await supabase.from('notices').delete().eq('id', id)
    if (!error) {
      setNotices((prev) => prev.filter((n) => n.id !== id))
    }
    return { error }
  }

  const updateNotice = async (id, fields) => {
    const { error } = await supabase.from('notices').update(fields).eq('id', id)
    return { error }
  }

  return { notices, setNotices, loading, addNotice, deleteNotice, updateNotice, refetch: fetchNotices }
}
