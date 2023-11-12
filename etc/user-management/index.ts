import { EasyVereinUserManagement } from './easyverein-user-management'
import { WeblingUserManagement } from './webling-user-management'

export function getUserManagement () {
  if (process.env.BACKEND === 'easyverein') {
    return new EasyVereinUserManagement()
  } else if (process.env.BACKEND === 'webling') {
    return new WeblingUserManagement()
  } else {
    throw new Error('Unknown backend')
  }
}
