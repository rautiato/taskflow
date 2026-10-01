import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Crash(): never {
  throw new Error('Render failed')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React and ErrorBoundary both log the caught error; keep the test output clean.
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders its children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>Page content</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument()
  })

  it('shows the recovery screen when a child throws while rendering', () => {
    render(
      <ErrorBoundary>
        <p>Page content</p>
        <Crash />
      </ErrorBoundary>,
    )

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByTestId('error-boundary-reload')).toBeInTheDocument()
    expect(
      screen.getByTestId('error-boundary-go-to-dashboard'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Page content')).not.toBeInTheDocument()
  })

  it('logs the error', () => {
    render(
      <ErrorBoundary>
        <Crash />
      </ErrorBoundary>,
    )

    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Render failed' }),
      expect.any(String),
    )
  })
})
