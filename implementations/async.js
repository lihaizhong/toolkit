function asyncToGeneratorNext (gen, resolve, reject, _next, _throw, key, arg) {
  try {
    const info = gen[key](arg)

    if (info.done) {
      resolve(info.value)
    } else {
      Promise.resolve(info.value).then(_next, _throw)
    }
  } catch (e) {
    reject(e)
  }
}

export default function asyncToGenerator (fn) {
  return function (...args) {
    return Promise((resolve, reject) => {
      const gen = fn.apply(this, args)
      const _next = (value) =>
        asyncToGeneratorNext(gen, resolve, reject, _next, _throw, 'next', value)
      const _throw = (error) =>
        asyncToGeneratorNext(gen, resolve, reject, _next, _throw, 'throw', error)

      _next()
    })
  }
}
