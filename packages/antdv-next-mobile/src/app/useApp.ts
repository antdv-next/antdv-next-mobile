import type { UseAppProps } from './interface'
import { useAppContext } from './context'

/** `const { message, notification, modal, toast } = App.useApp()`; must be called below an `<am-app>`. */
export default function useApp(): UseAppProps {
  return useAppContext()
}
