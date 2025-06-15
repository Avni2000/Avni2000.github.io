import { createAdminToken } from '../lib/db'
import crypto from 'crypto'

async function main() {
  const args = process.argv.slice(2)
  const password = args[0]

  if (!password) {
    console.error('Usage: npm run create-token <password>')
    process.exit(1)
  }

  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex')

  try {
    await createAdminToken(token, password)
    console.log('\nAdmin token created successfully!')
    console.log('\nUse this URL to access the admin panel:')
    console.log(`http://localhost:3000/admin/login?token=${token}`)
    console.log('\nMake sure to save this URL in a secure place!')
  } catch (error) {
    console.error('Error creating admin token:', error)
    process.exit(1)
  }
}

main() 