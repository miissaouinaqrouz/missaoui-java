const owner = process.env.GITHUB_OWNER || 'miissaouinaqrouz'
const repo = process.env.GITHUB_REPO || 'missaoui-java'
const branch = process.env.GITHUB_BRANCH || 'main'
const visitorsPath = process.env.GITHUB_VISITORS_PATH || 'data/visitors.json'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return response.status(503).json({ error: 'GITHUB_TOKEN is not configured' })
  }

  const body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : request.body || {}
  const firstName = cleanName(body.firstName)
  const lastName = cleanName(body.lastName)

  if (!firstName || !lastName) {
    return response.status(400).json({ error: 'firstName and lastName are required' })
  }

  const visitor = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    registeredAt: new Date().toISOString(),
    userAgent: request.headers['user-agent'] || '',
  }

  try {
    const saved = await appendVisitor(token, visitor)
    return response.status(201).json({ ok: true, count: saved.length })
  } catch (error) {
    return response.status(500).json({ error: error instanceof Error ? error.message : 'Registration failed' })
  }
}

async function appendVisitor(token, visitor) {
  const current = await readVisitorsFile(token)
  const visitors = Array.isArray(current.visitors) ? current.visitors : []
  visitors.push(visitor)

  const content = JSON.stringify(visitors, null, 2) + '\n'
  const result = await fetch(githubContentsUrl(), {
    method: 'PUT',
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: `Register visitor ${visitor.fullName}`,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch,
      sha: current.sha,
    }),
  })

  if (!result.ok) {
    const text = await result.text()
    throw new Error(`GitHub write failed: ${result.status} ${text}`)
  }

  return visitors
}

async function readVisitorsFile(token) {
  const result = await fetch(`${githubContentsUrl()}?ref=${encodeURIComponent(branch)}`, {
    headers: githubHeaders(token),
  })

  if (result.status === 404) {
    return { visitors: [], sha: undefined }
  }

  if (!result.ok) {
    const text = await result.text()
    throw new Error(`GitHub read failed: ${result.status} ${text}`)
  }

  const file = await result.json()
  const json = Buffer.from(file.content || '', 'base64').toString('utf8').trim()
  return {
    visitors: json ? JSON.parse(json) : [],
    sha: file.sha,
  }
}

function githubContentsUrl() {
  return `https://api.github.com/repos/${owner}/${repo}/contents/${visitorsPath}`
}

function githubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function cleanName(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
}
