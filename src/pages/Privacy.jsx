import LegalPage from '../components/legal/LegalPage.jsx'

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal // Privacy Policy"
      title="Privacy Policy"
      updated="Placeholder document — not yet finalized"
      notice="This page is a placeholder. STRATIX's full Privacy Policy has not been finalized or reviewed by legal counsel. Nothing on this page should be treated as a final commitment."
      sections={[
        {
          heading: '1. Information We Collect',
          body: [
            'Account details such as your email and display name, and training data you generate on STRATIX, like skill signals and AI Coach conversations.',
          ],
        },
        {
          heading: '2. How We Use Information',
          body: [
            'To run your account, save your progress, and personalize your training dashboard. We do not sell player data.',
          ],
        },
        {
          heading: '3. Third-Party Services',
          body: [
            'STRATIX uses third-party services for authentication and hosting (including Supabase, and Google or Discord if you sign in with them). Those providers process data under their own privacy terms.',
          ],
        },
        {
          heading: '4. Your Choices',
          body: [
            'You can review and update your profile information from your account settings. Full data export and deletion controls are planned but not yet available.',
          ],
        },
      ]}
    />
  )
}
