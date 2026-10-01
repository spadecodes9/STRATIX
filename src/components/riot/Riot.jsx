// Shared Riot account UI. Everything here reads from RiotContext only and
// renders an explicit state — loading, error, not connected, no data, or
// real synced data. There is no fallback to sample values anywhere.
import { Link2, Link2Off, RefreshCw, ShieldCheck, Swords } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useRiot } from '../../context/RiotContext.jsx'
import Button from '../ui/Button.jsx'
import './riot.css'

export const RIOT_DISCLAIMER =
  'Connecting is opt-in: linking your Riot account makes your VALORANT player data visible within STRATIX. Disconnect any time to remove it. STRATIX is not endorsed by or affiliated with Riot Games.'

const PROVIDER_LABEL = { google: 'Google', discord: 'Discord', riot: 'Riot', email: 'email' }

// Neutral glyph rather than Riot's logo — no implied endorsement.
export function RiotIcon({ size = 16 }) {
  return <Swords size={size} color="#D13639" strokeWidth={2.2} aria-hidden="true" />
}

export function formatSyncedAt(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

// Shown in place of any panel content that needs Riot player data the
// player doesn't have (yet). Never falls back to sample values.
export function RiotEmptyState() {
  const riot = useRiot()

  if (riot.status === 'loading') {
    return <div className="riot-empty" role="status"><p>Loading Riot data…</p></div>
  }

  if (riot.status === 'error') {
    return (
      <div className="riot-empty">
        <strong>Unable to load Riot data</strong>
        <Button variant="secondary" icon={RefreshCw} onClick={riot.reload}>Retry</Button>
      </div>
    )
  }

  if (riot.status === 'disconnected') {
    return (
      <div className="riot-empty">
        <RiotIcon size={20} />
        <strong>Riot Account Not Connected</strong>
        <p>Connect your Riot account to sync your VALORANT profile and statistics.</p>
        <Button variant="primary" onClick={riot.connect}>Connect Riot</Button>
      </div>
    )
  }

  return (
    <div className="riot-empty">
      <strong>No Riot data available</strong>
      <p>{riot.syncError || 'Your Riot account is connected, but no match data has synced yet.'}</p>
      <Button variant="secondary" icon={RefreshCw} onClick={riot.sync} disabled={riot.syncing}>
        {riot.syncing ? 'Syncing…' : 'Sync from Riot'}
      </Button>
    </div>
  )
}

// Compact identity/rank block for the Dashboard and Profile hero cards.
export function RiotStatusBlock() {
  const riot = useRiot()

  if (riot.status === 'connected') {
    const rank = riot.playerData?.rank?.name
    return (
      <div className="riot-status-block">
        <span className="eyebrow">Riot account</span>
        <strong className="riot-status-id">{riot.connection.riotId}</strong>
        <span className="riot-status-rank">
          {rank ? `Rank at last competitive match: ${rank}` : 'No competitive rank synced'}
        </span>
        <span className="riot-synced"><ShieldCheck size={12} /> Synced from Riot{riot.syncedAt ? ` · ${formatSyncedAt(riot.syncedAt)}` : ''}</span>
      </div>
    )
  }

  if (riot.status === 'loading') {
    return <div className="riot-status-block" role="status"><span className="eyebrow">Riot account</span><p>Loading Riot data…</p></div>
  }

  return (
    <div className="riot-status-block">
      <span className="eyebrow">Riot account</span>
      <strong className="riot-status-id">{riot.status === 'error' ? 'Unable to load Riot data' : 'Not connected'}</strong>
      <p>Connect Riot to view your VALORANT data.</p>
      <Button variant="primary" onClick={riot.status === 'error' ? riot.reload : riot.connect}>
        {riot.status === 'error' ? 'Retry' : 'Connect Riot'}
      </Button>
    </div>
  )
}

// Account connection status: STRATIX account vs Riot account, kept separate.
export function RiotAccountPanel() {
  const { user } = useAuth()
  const riot = useRiot()
  const connected = riot.status === 'connected'

  return (
    <div className="panel riot-account-panel">
      <div className="panel-title-row">
        <div><span className="eyebrow">Account connections</span><h3>Connected Accounts</h3></div>
        <Link2 size={20} className="panel-icon" />
      </div>

      <div className="riot-account-rows">
        <div className="riot-account-row">
          <span className="riot-account-label">STRATIX Account</span>
          <span className="riot-account-state is-on"><i /> Connected</span>
          <span className="riot-account-detail">via {PROVIDER_LABEL[user.authProvider] || user.authProvider}</span>
        </div>

        <div className="riot-account-row">
          <span className="riot-account-label"><RiotIcon size={14} /> Riot Account</span>
          <span className={'riot-account-state' + (connected ? ' is-on' : '')}>
            <i /> {riot.status === 'loading' ? 'Checking…' : riot.status === 'error' ? 'Unable to load' : connected ? 'Connected' : 'Not connected'}
          </span>
          <span className="riot-account-detail">{connected ? `Riot ID: ${riot.connection.riotId}` : ''}</span>
        </div>
      </div>

      <div className="riot-account-actions">
        {connected ? (
          <>
            <Button variant="secondary" icon={RefreshCw} onClick={riot.sync} disabled={riot.syncing}>
              {riot.syncing ? 'Syncing…' : 'Sync from Riot'}
            </Button>
            <Button variant="ghost" icon={Link2Off} onClick={riot.disconnect}>Disconnect Riot</Button>
          </>
        ) : riot.status === 'error' ? (
          <Button variant="secondary" icon={RefreshCw} onClick={riot.reload}>Retry</Button>
        ) : (
          <Button variant="primary" onClick={riot.connect} disabled={riot.status === 'loading'}>Connect Riot</Button>
        )}
      </div>
      {riot.syncError && <p className="riot-account-error">{riot.syncError}</p>}
      <p className="riot-disclaimer">{RIOT_DISCLAIMER}</p>
    </div>
  )
}
