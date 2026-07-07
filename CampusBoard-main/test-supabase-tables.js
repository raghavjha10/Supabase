import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ltmipsdlooetkienyrxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_H-1EmBLsNI_XOeePFZubcg_ndsUJotR'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  console.log('Testing Supabase query on "notices" table...')
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching notices:', error)
  } else {
    console.log('Successfully queried notices table. Result:', data)
  }
  
  console.log('Testing Supabase query on "profiles" table...')
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)

  if (profileError) {
    console.error('Error fetching profiles:', profileError)
  } else {
    console.log('Successfully queried profiles table. Result:', profileData)
  }
}

run().catch(console.error)
