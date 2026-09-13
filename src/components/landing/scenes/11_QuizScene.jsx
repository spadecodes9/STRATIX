import { useState } from 'react'
import { HelpCircle, Check, AlertTriangle, ShieldAlert, Zap, ArrowRight } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CinematicHUDOverlay from '../CinematicHUDOverlay.jsx'

export default function QuizScene({ progress, isVisible }) {
  const [selectedChoice, setSelectedChoice] = useState(1) // Default to optimal choice

  const scenarioScale = 0.92 + progress * 0.08
  const scenarioY = (1 - progress) * 30

  const choices = [
    {
      id: 0,
      label: 'A // Dry-peek main corridor immediately',
      rating: 'SUB-OPTIMAL',
      winRate: '28%',
      isOptimal: false,
      feedback: 'High probability of walking into a crossfire. Unfavorable 1v2 trade risk.',
    },
    {
      id: 1,
      label: 'B // Reposition to Heaven for synchronized flash trade',
      rating: 'OPTIMAL DECISION',
      winRate: '84%',
      isOptimal: true,
      feedback: 'Forces attackers to split crosshairs between elevation and site choke.',
    },
    {
      id: 2,
      label: 'C // Hold smoke edge and wait for half-defuse tap sound',
      rating: 'HIGH RISK',
      winRate: '44%',
      isOptimal: false,
      feedback: 'Leaves teammate isolated without trade potential if attacker peeks early.',
    },
  ]

  return (
    <div className="scene-container quiz-scene">
      <CinematicHUDOverlay
        sceneNumber="11"
        sector="SIMULATION // TACTICAL SCENARIOS"
        systemStatus="CLUTCH SIMULATOR ACTIVE"
        progress={progress}
      />

      {/* Live Tactical Situation Console */}
      <div
        className="tactical-quiz-console"
        style={{
          transform: `translateY(${scenarioY}px) scale(${scenarioScale})`,
          opacity: Math.min(1, 0.4 + progress * 0.9),
        }}
      >
        <div className="quiz-console-header">
          <div className="quiz-header-tag">
            <span className="quiz-live-pulse" />
            <span>SITUATION 14-B // LIVE CLUTCH</span>
          </div>
          <span className="quiz-timer-badge">14.8s DEFUSE TIMER</span>
        </div>

        <div className="quiz-console-body">
          <div className="quiz-scenario-prompt">
            <span className="scenario-context-tag">MATCH POINT 11-12 // 2v3 RETAKE B-SITE</span>
            <h4 className="scenario-question">
              Your teammate initiates defuse on Spike. Enemy Sova is spotted Long, enemy Omen smoked CT. What is your play?
            </h4>
          </div>

          {/* Interactive Decision Options */}
          <div className="quiz-options-list">
            {choices.map((choice) => {
              const isSelected = selectedChoice === choice.id
              return (
                <button
                  key={choice.id}
                  type="button"
                  className={`quiz-option-btn ${isSelected ? (choice.isOptimal ? 'option-optimal' : 'option-selected') : ''}`}
                  onClick={() => setSelectedChoice(choice.id)}
                >
                  <div className="option-label-row">
                    <span className="option-text">{choice.label}</span>
                    <span className={`option-rating-badge ${choice.isOptimal ? 'text-success' : 'text-red'}`}>
                      {choice.rating} ({choice.winRate})
                    </span>
                  </div>
                  {isSelected && (
                    <p className="option-feedback-text">
                      {choice.feedback}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="quiz-console-footer">
          <span className="quiz-accuracy-metric">
            STRATIX DECISION QUALITY: <strong className="text-success">92.4% ACCURACY</strong>
          </span>
        </div>
      </div>

      {/* Minimal UI Content */}
      <div className="scene-content quiz-content">
        <div className="scene-eyebrow-tag">
          <span className="eyebrow">09 // DECISION TRAINING</span>
        </div>

        <h2 className="scene-title-xl">
          TRAIN THE DECISION <br />
          <span className="text-glow-red">BEFORE IT MATTERS.</span>
        </h2>

        <p className="scene-desc-md">
          Clutches are won by calm, calculated decision making. STRATIX situational quizzes present
          real round snapshots to sharpen your game sense and ability timings before match point.
        </p>

        <div className="quiz-action-row">
          <Button variant="primary" to="/courses" icon={Zap}>
            Practice Situations
          </Button>
        </div>
      </div>
    </div>
  )
}
