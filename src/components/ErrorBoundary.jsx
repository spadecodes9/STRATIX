import { Component } from 'react'
import { TriangleAlert } from 'lucide-react'
import Button from './ui/Button.jsx'

/**
 * Catches render errors from routed pages so a bug in one page can't
 * unmount the navbar/footer along with it (React unmounts the whole tree
 * from the nearest boundary up — without one here, that boundary is the
 * app root). Scoped around <Outlet/> in Layout.jsx, not the whole app.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('STRATIX page crashed:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page-shell error-boundary-shell">
          <div className="panel error-boundary-panel">
            <span className="eyebrow"><TriangleAlert size={14} /> System fault</span>
            <h2>This screen hit a snag.</h2>
            <p>Something on this page failed to render. The rest of STRATIX is unaffected.</p>
            <div className="error-boundary-actions">
              <Button variant="primary" onClick={this.handleReset}>Try again</Button>
              <Button variant="secondary" to="/">Back to home</Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
