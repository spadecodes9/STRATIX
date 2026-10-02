// Vercel function for POST /api/profile/theme. Mounts the existing Express
// route from server/premium.js unchanged (auth, THEMES check, Premium check,
// service-role RPC), so production and `npm run dev:server` share one code path.
import express from 'express'
import { registerPremiumRoutes } from '../../server/premium.js'

const app = express()
app.use(express.json({ limit: '100kb' }))
registerPremiumRoutes(app)

export default app
