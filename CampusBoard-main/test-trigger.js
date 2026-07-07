import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ltmipsdlooetkienyrxj.supabase.co'
const supabaseAnonKey = 'sb_publishable_H-1EmBLsNI_XOeePFZubcg_ndsUJotR'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function run() {
  console.log('Logging in user 1 (raghavjha0710@gmail.com)...')
  const { data: user1, error: error1 } = await supabase.auth.signInWithPassword({
    email: 'raghavjha0710@gmail.com',
    password: 'password123'
  })
  
  if (error1) {
    console.error('User 1 login failed:', error1)
    return
  }
  
  // Try to sign up a second user if they don't exist
  console.log('Registering user 2 (testuser@example.com)...')
  const { data: user2, error: error2 } = await supabase.auth.signUp({
    email: 'testuser@example.com',
    password: 'password123'
  })
  
  if (error2) {
    console.log('User 2 sign up failed (might already exist):', error2.message)
  } else {
    console.log('User 2 signed up successfully. User ID:', user2.user.id)
  }

  // Find all users in the public profiles table or auth users if possible
  // Since we don't have admin credentials, let's try inserting a notice under user 1
  console.log('Inserting notice under user 1...')
  const { data: notice, error: insertError } = await supabase
    .from('notices')
    .insert({
      title: 'Trigger Test Notice',
      content: 'Testing if database trigger inserts a notification row',
      user_id: user1.user.id
    })
    .select()
    
  if (insertError) {
    console.error('Insert notice error:', insertError)
    return
  }
  
  console.log('Notice inserted successfully:', notice)
  
  // Wait 2 seconds for trigger
  await new Promise((resolve) => setTimeout(resolve, 2000))
  
  // Now let's login as user 2 and see if we have any notifications!
  console.log('Logging in user 2 to check notifications...')
  const { data: user2Session, error: error2Login } = await supabase.auth.signInWithPassword({
    email: 'testuser@example.com',
    password: 'password123'
  })
  
  if (error2Login) {
    console.error('User 2 login failed:', error2Login)
    return
  }
  
  console.log('Querying notifications for user 2...')
  const { data: notifications, error: notifError } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user2Session.user.id)
    
  if (notifError) {
    console.error('Error fetching notifications:', notifError)
  } else {
    console.log('Notifications for user 2:', notifications)
  }
  
  // Cleanup notice
  console.log('Cleaning up notice...')
  await supabase.from('notices').delete().eq('id', notice[0].id)
}

run().catch(console.error)
