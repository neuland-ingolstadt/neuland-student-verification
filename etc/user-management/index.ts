import { EasyVereinUserManagement } from './backends/easyverein-user-management'

/**
 * Returns the user management backend.
 */
export function getUserManagement() {
  return new EasyVereinUserManagement()
}
