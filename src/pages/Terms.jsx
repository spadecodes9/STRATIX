import LegalPage from '../components/legal/LegalPage.jsx'

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal // Terms of Service"
      title="Terms of Service"
      updated="Placeholder document — not yet finalized"
      notice="This page is a placeholder. STRATIX's Terms of Service have not been finalized or reviewed by legal counsel. Nothing on this page is binding."
      sections={[
        {
          heading: '1. Using STRATIX',
          body: [
            'STRATIX is an independent training platform for VALORANT players, providing courses, guides, and coaching tools to help players train with more direction.',
          ],
        },
        {
          heading: '2. Accounts',
          body: [
            "Creating an account lets STRATIX save your progress and preferences. You're responsible for keeping your account credentials secure.",
          ],
        },
        {
          heading: '3. Acceptable Use',
          body: [
            'STRATIX is built for training and improvement. Misuse of the platform, including attempts to disrupt the service or access other players’ accounts, is not permitted.',
          ],
        },
        {
          heading: '4. Changes to These Terms',
          body: [
            'These terms will be updated as STRATIX develops. Meaningful changes will be reflected here before they take effect.',
          ],
        },
      ]}
    />
  )
}
