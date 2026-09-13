require('dotenv').config()

const { MongoClient } = require('mongodb')

const uri = process.env.DATABASE_URI

if (!uri) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        database: 'payload-mongodb',
        error: 'DATABASE_URI is not set',
      },
      null,
      2,
    ),
  )
  process.exit(1)
}

async function main() {
  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db()
  const collections = await db.listCollections({}, { nameOnly: true }).toArray()
  const counts = []

  for (const collection of collections.sort((a, b) => a.name.localeCompare(b.name))) {
    try {
      const count = await db.collection(collection.name).countDocuments()
      counts.push({ collection: collection.name, count })
    } catch (error) {
      counts.push({ collection: collection.name, count: null, error: error.message })
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        database: 'payload-mongodb',
        collectionCount: counts.length,
        counts,
      },
      null,
      2,
    ),
  )

  await client.close()
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        ok: false,
        database: 'payload-mongodb',
        error: error.message,
      },
      null,
      2,
    ),
  )
  process.exitCode = 1
})
