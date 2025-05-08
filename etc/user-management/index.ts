import { EasyVereinUserManagement } from './backends/easyverein-user-management'
import { WeblingUserManagement } from './backends/webling-user-management'

/**
 * Returns the appropriate user management backend depending on the configuration.
 */
export function getUserManagement() {
  if (process.env.BACKEND === 'easyverein') {
    return new EasyVereinUserManagement()
  }
  if (process.env.BACKEND === 'webling') {
    return new WeblingUserManagement()
  }
  throw new Error('Unknown backend')
}
