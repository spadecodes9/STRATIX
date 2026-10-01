import LegalPage from '../components/legal/LegalPage.jsx'

export default function Cookies() {
  return (
    <LegalPage
      eyebrow="Legal // Cookie Policy"
      title="Cookie Policy"
      updated="Placeholder document — not yet finalized"
      notice="This page is a placeholder. STRATIX's Cookie Policy has not been finalized or reviewed by legal counsel."
      sections={[
        {
          heading: '1. What Cookies We Use',
          body: [
            'STRATIX uses a small number of essential cookies and local storage entries to keep you signed in and remember basic preferences.',
          ],
        },
        {
          heading: '2. Why We Use Them',
          body: [
            'These entries are required for authentication (handled by Supabase) to work, and to avoid asking you to sign in again on every visit.',
          ],
        },
        {
          heading: '3. Managing Cookies',
          body: [
            'You can clear cookies and local storage through your browser settings at any time. Doing so will sign you out of STRATIX.',
          ],
        },
      ]}
    />
  )
}
