require('dotenv').config()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const tables = await prisma.$queryRawUnsafe(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `)

  const counts = []

  for (const row of tables) {
    const table = row.table_name
    const escapedTable = table.replace(/"/g, '""')

    try {
      const result = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int AS count FROM "${escapedTable}"`,
      )
      counts.push({ table, count: Number(result[0].count) })
    } catch (error) {
      counts.push({ table, count: null, error: error.message })
    }
  }

  let documentStorage = null
  let documentUrlChecks = []

  if (counts.some((entry) => entry.table === 'documents')) {
    const [docStats] = await prisma.$queryRawUnsafe(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE url IS NOT NULL AND url <> '')::int AS with_url,
        COUNT(*) FILTER (WHERE url LIKE 'http://%' OR url LIKE 'https://%')::int AS remote_url,
        COUNT(*) FILTER (WHERE url LIKE '/%' OR url LIKE '.%' OR url LIKE '%\\%')::int AS local_or_relative_url
      FROM "documents"
    `)

    documentStorage = {
      total: Number(docStats.total),
      withUrl: Number(docStats.with_url),
      remoteUrl: Number(docStats.remote_url),
      localOrRelativeUrl: Number(docStats.local_or_relative_url),
    }

    const urls = await prisma.$queryRawUnsafe(`
      SELECT id, url
      FROM "documents"
      WHERE url LIKE 'http://%' OR url LIKE 'https://%'
      ORDER BY "uploadedAt" ASC
    `)

    for (const [index, row] of urls.entries()) {
      try {
        const url = new URL(row.url)
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10000)
        const response = await fetch(url, {
          method: 'HEAD',
          redirect: 'manual',
          signal: controller.signal,
        })
        clearTimeout(timeout)

        documentUrlChecks.push({
          documentNumber: index + 1,
          host: url.host,
          reachable: response.status >= 200 && response.status < 400,
          status: response.status,
        })
      } catch (error) {
        let host = 'invalid-url'
        try {
          host = new URL(row.url).host
        } catch {
          // Keep the default host value.
        }

        documentUrlChecks.push({
          documentNumber: index + 1,
          host,
          reachable: false,
          error: error.name === 'AbortError' ? 'timeout' : error.message,
        })
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        database: 'prisma-postgres',
        tableCount: counts.length,
        counts,
        documentStorage,
        documentUrlChecks,
      },
      null,
      2,
    ),
  )
}

main()
  .catch((error) => {
    console.error(
      JSON.stringify(
        {
          ok: false,
          database: 'prisma-postgres',
          error: error.message,
        },
        null,
        2,
      ),
    )
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
