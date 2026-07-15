import { useMemo, useState } from 'react'
import Canvas from './components/Canvas'
import CreditsModal from './components/CreditsModal'
import MobileNotice from './components/MobileNotice'
import { useIsMobile } from './hooks/useIsMobile'

const CREDITS_KEY = 'spatial-notes:credits:v1'

function hasCreditsBeenSeen(): boolean {
  if (typeof window === 'undefined') return true
  try { return localStorage.getItem(CREDITS_KEY) === 'seen' } catch { return true }
}

export default function App() {
  const isMobile = useIsMobile()
  const [creditsOpen, setCreditsOpen] = useState(false)
  const creditsSeen = useMemo(() => hasCreditsBeenSeen(), [])
  if (isMobile) return <MobileNotice />
  return (
    <>
      <Canvas creditsOpen={creditsOpen} creditsSeen={creditsSeen} />
      <CreditsModal onOpenChange={setCreditsOpen} />
    </>
  )
}