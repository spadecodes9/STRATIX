import LegalPage from '../components/legal/LegalPage.jsx'

export default function Disclaimer() {
  return (
    <LegalPage
      eyebrow="Legal // Disclaimer"
      title="Disclaimer"
      updated="Placeholder document — not yet finalized"
      notice="This page is a placeholder. STRATIX's full Disclaimer has not been finalized or reviewed by legal counsel."
      sections={[
        {
          heading: '1. Independent Platform',
          body: [
            'STRATIX is an independent training platform for VALORANT players. STRATIX is not affiliated with, sponsored by, or endorsed by Riot Games, Inc. VALORANT and all related assets are trademarks of Riot Games.',
          ],
        },
        {
          heading: '2. No Guaranteed Results',
          body: [
            'Courses, guides, skill signals, and AI Coach feedback on STRATIX are training aids, not a guarantee of rank, performance, or outcome. Improvement depends on the player.',
          ],
        },
        {
          heading: '3. AI Coach Guidance',
          body: [
            'AI Coach responses are generated to be helpful, not authoritative. Use your own judgment when applying any suggestion in-game.',
          ],
        },
      ]}
    />
  )
}
