import Canvas from './components/Canvas'
import ChangelogModal from './components/ChangelogModal'
import CreditsModal from './components/CreditsModal'
import MobileNotice from './components/MobileNotice'
import { useIsMobile } from './hooks/useIsMobile'

export default function App() {
  const isMobile = useIsMobile()
  if (isMobile) return <MobileNotice />
  return (
    <>
      <Canvas />
      <ChangelogModal />
      <CreditsModal />
    </>
  )
}