// Clean database script - removes sample blog posts
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path')

async function cleanDb() {
  console.log('Connecting to database...')
  
  const db = await open({
    filename: path.join(process.cwd(), 'blog.db'),
    driver: sqlite3.Database
  })
  
  console.log('Removing sample blog posts...')
  
  // Delete sample posts
  await db.run(`DELETE FROM posts WHERE slug IN ('getting-started-with-flask', 'welcome-to-my-blog')`)
  
  // Get remaining posts count
  const count = await db.get('SELECT COUNT(*) as count FROM posts')
  
  console.log(`Removed sample blog posts. ${count.count} posts remaining in database.`)
  console.log('Database cleaned successfully!')
  
  await db.close()
}

cleanDb().catch(err => {
  console.error('Error cleaning database:', err)
  process.exit(1)
}) 