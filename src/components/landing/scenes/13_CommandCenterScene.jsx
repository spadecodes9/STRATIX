import { LayoutDashboard, Flame, Clock, Award, CheckCircle2, TrendingUp } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function CommandCenterScene({ progress, isVisible }) {
  const cockpitScale = 0.92 + progress * 0.08
  const cockpitY = (1 - progress) * 35

  return (
    <div className="scene-container command-center-scene">
      <CinematicHUDOverlay
        sceneNumber="13"
        sector="COCKPIT // COMMAND CENTER"
        systemStatus="ALL SENSORS SYNCHRONIZED"
        progress={progress}
      />

      {/* High-Tech Tactical Cockpit Grid */}
      <div
        className="tactical-cockpit-grid"
        style={{
          transform: `translateY(${cockpitY}px) scale(${cockpitScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
      >
        {/* Metric 1: Current Rank & RR */}
        <div className="cockpit-cell cell-rank">
          <div className="cell-header">
            <span className="cell-tag">CURRENT RANK TIER</span>
            <span className="cell-beacon-green" />
          </div>
          <div className="cell-rank-display">
            <span className="rank-name-large">DIAMOND 2</span>
            <span className="rank-rr-badge">47 / 100 RR</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress * 47}%` }} />
          </div>
          <span className="cell-subtext">Peak: Immortal 1 • Projected Ascendant in 12 days</span>
        </div>

        {/* Metric 2: Training Streak */}
        <div className="cockpit-cell cell-streak">
          <div className="cell-header">
            <span className="cell-tag">TRAINING STREAK</span>
            <Flame size={16} className="text-red" />
          </div>
          <span className="cell-hero-val text-red">12 DAYS</span>
          <span className="cell-subtext">Active consecutive practice</span>
        </div>

        {/* Metric 3: Hours Trained */}
        <div className="cockpit-cell cell-hours">
          <div className="cell-header">
            <span className="cell-tag">TIME INVESTED</span>
            <Clock size={16} className="text-gray" />
          </div>
          <span className="cell-hero-val">63.0 HRS</span>
          <span className="cell-subtext">340+ mechanical reps</span>
        </div>

        {/* Metric 4: Curriculum Progress */}
        <div className="cockpit-cell cell-modules">
          <div className="cell-header">
            <span className="cell-tag">COMPLETED LESSONS</span>
            <CheckCircle2 size={16} className="text-success" />
          </div>
          <span className="cell-hero-val text-success">41 LESSONS</span>
          <span className="cell-subtext">3 Full courses completed</span>
        </div>

        {/* Metric 5: Today's Action */}
        <div className="cockpit-cell cell-action-wide">
          <div className="cell-header">
            <span className="cell-tag">TODAY&apos;S PRIMARY FOCUS</span>
            <span className="badge badge-red">RECOMMENDED</span>
          </div>
          <strong className="action-title">SMOKE TIMINGS FOR RETAKES</strong>
          <p className="action-desc">
            Matches your weakest skill area (Positioning &amp; Utility). 12m video + 15m drill.
          </p>
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content command-center-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">11 // PERSONAL COMMAND</span>
        </div>

        <h2 className="scene-title-xl">
          STRATIX KNOWS <br />
          <span className="text-glow-red">WHAT COMES NEXT.</span>
        </h2>

        <p className="scene-desc-md">
          Open your dashboard each day and instantly know your exact training objective.
          No wandering between custom games and unranked queues.
        </p>

        <div className="command-action-row">
          <Button variant="primary" to="/dashboard" icon={LayoutDashboard}>
            View Your Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
