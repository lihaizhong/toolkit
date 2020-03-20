export function preloadImage (src) {
  if (!src) {
    return Promise.reject(new Error('invalid url'))
  }

  const image = new Image()
  image.src = src

  // 图片已加载完成
  if (image.complete) {
    return Promise.resolve(src)
  }

  // 图片未加载完成
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(src)
    image.onerror = reject
  })
}
