import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { onlineAtom } from 'src/stores/global'

const useOnline = () => {
  const setOnline = useSetAtom(onlineAtom)

  useEffect(() => {
    function handleOnlineStatus() {
      setOnline(true)
    }

    function handleOfflineStatus() {
      setOnline(false)
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOfflineStatus)
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOfflineStatus)
    }
  }, [])
}

export default useOnline
