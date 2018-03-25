
const globalPrefix = 'konn-plg__'

const contains = x => str => str && str.indexOf(x) > -1

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    return null
  }
}

const ls = prefix => {
  return Object
    .keys(localStorage)
    .filter(contains(prefix))
    .map(x => x.replace(prefix, ''))
}

export const mkStore = (prefix = '') => ({
  save: (key, value) => save(globalPrefix + prefix + key, value),
  load: key => load(globalPrefix + prefix + key),
  ls: () => ls(globalPrefix + prefix)
})

export default mkStore()
