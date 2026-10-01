import { RiotStatusBlock } from '../riot/Riot.jsx'

export default function WelcomeHeader({ user }) {
  return (
    <section className="welcome-header">
      <div className="welcome-text dashboard-intro">
        <span className="eyebrow">Operator briefing</span>
        <h1>Welcome back, <span>{user.username}</span></h1>
        <p>Pick up your training where you left off — guides, quizzes, and your AI Coach are ready.</p>
        <div className="intro-status">
          <span className="status-dot" aria-hidden="true" />
          <span>STRATIX account active</span>
        </div>
      </div>
      <div className="rank-card">
        <RiotStatusBlock />
      </div>
    </section>
  )
}
