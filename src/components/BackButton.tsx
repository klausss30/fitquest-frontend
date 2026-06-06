import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  onClick?: () => void
}

/**
 * Consistent back button used across all sub-pages.
 * Pass `to` for a fixed destination, or `onClick` for custom behaviour.
 * Defaults to navigating back one step in history.
 */
export default function BackButton({ to, onClick }: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = onClick ?? (() => (to ? navigate(to) : navigate(-1)))

  return (
    <button
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-light"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(26,24,20,0.08)',
        color: 'rgba(26,24,20,0.48)',
      }}
      onClick={handleClick}
    >
      ←
    </button>
  )
}
