import { useEffect, useState } from 'react'
import type { StressSnapshot } from '../../../shared/monitor'

export const useStressMonitor = (): StressSnapshot | null | undefined => {
  const [snapshot, setSnapshot] = useState<StressSnapshot | null | undefined>(undefined)

  useEffect(() => {
    let isMounted = true
    window.api
      .getStressSnapshot()
      .then((data) => {
        if (isMounted) setSnapshot(data)
      })
      .catch(() => {
        if (isMounted) setSnapshot(null)
      })

    const unsubscribe = window.api.onStressUpdate((data) => {
      setSnapshot(data)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return snapshot
}
