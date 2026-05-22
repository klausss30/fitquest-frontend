import { LEGACY_PLAN_DRAFT_PREFIX, PLAN_DRAFT_PREFIX } from './storageKeys'

export function clearPlanDrafts() {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index)
    if (key?.startsWith(PLAN_DRAFT_PREFIX) || key?.startsWith(LEGACY_PLAN_DRAFT_PREFIX)) {
      localStorage.removeItem(key)
    }
  }
}
