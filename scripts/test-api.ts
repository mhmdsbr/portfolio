async function testAPI() {
  const endpoints = [
    '/api/sidebar',
    '/api/hero',
    '/api/about',
    '/api/services',
    '/api/summary',
    '/api/testimonials',
    '/api/contact',
    '/api/footer',
    '/api/config',
    '/api/all',
  ]

  const baseUrl = 'http://localhost:3000'

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint}...`)
      const response = await fetch(`${baseUrl}${endpoint}`)
      const data = await response.json()

      if (response.ok) {
        console.log(`✅ ${endpoint} - OK`)
        console.log(`📦 Data keys:`, Object.keys(data.data || {}))
      } else {
        console.log(`❌ ${endpoint} - Error:`, data.error)
      }
    } catch (error) {
      console.error(`❌ ${endpoint} - Failed:`, error)
    }
  }
}

testAPI()