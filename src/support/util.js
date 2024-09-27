export function isEmpty (value) {
  if (value === null) return true
  if (typeof value === 'undefined') return true
  if (typeof value === 'string' && value === '') return true
  if (Array.isArray(value) && value.length < 1) return true
  if (
    typeof value === 'object' &&
    value.constructor.name === 'Object' &&
    Object.keys(value).length < 1 &&
    Object.getOwnPropertyNames(value) < 1
  ) {
    return true
  }
  if (
    typeof value === 'object' &&
    value.constructor.name === 'String' &&
    Object.keys(value).length < 1
  ) {
    return true
  }
  return false
}

/**
 * @description : value로 들어온값이 empty인지 체크해서 true이면 defaultValue를 리턴
 */
export function nvl (value, defaultValue) {
  return isEmpty(value) ? defaultValue : value
}