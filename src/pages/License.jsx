import LegalPage from '../components/legal/LegalPage.jsx'
import { RIOT_LEGAL_NOTICE } from '../data/legal.js'

export default function License() {
  return (
    <LegalPage
      eyebrow="Legal // License"
      title="License"
      updated="Placeholder document — not yet finalized"
      notice="This page is a placeholder. STRATIX's License terms have not been finalized or reviewed by legal counsel."
      sections={[
        {
          heading: '1. Ownership',
          body: [
            'The STRATIX platform, including its guides and design, is owned by STRATIX unless otherwise noted.',
          ],
        },
        {
          heading: '2. Your License to Use STRATIX',
          body: [
            'You’re granted a personal, non-transferable license to use STRATIX for your own training. Copying or redistributing STRATIX content elsewhere is not permitted without permission.',
          ],
        },
        {
          heading: '3. Third-Party Content',
          body: [
            'STRATIX is an independent training platform for VALORANT players.',
            RIOT_LEGAL_NOTICE,
          ],
        },
      ]}
    />
  )
}
