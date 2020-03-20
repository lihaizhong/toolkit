const WATERMARK_IMAGE = ''

function reduceOptions (options, defaultValue) {
  return Object.keys(options).reduce((acc, key) => {
    const value = options[key]
    if (value) {
      return acc + `,${key}_${value}`
    }

    return acc
  }, defaultValue)
}

/**
 * 处理OSS图片
 * @param {string} url
 * @param {object} options
 * @property {string} m lfit、mfit、fill、pad、fixed，默认为 lfit。
 * @property {number} w 1-4096
 * @property {number} h 1-4096
 * @property {number} x 1-4096
 * @property {number} y 1-4096
 * @property {number} limit 0/1, 默认是 1
 * @property {string} color [000000-FFFFFF]
 * @param {string} format 支持：jpg, png, webp, bmp, gif, tiff
 *
 * https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.6.1314.46e21729yRtkXO
 */

export function handleOSSImage (url) {
  if (typeof url === 'string' && url !== '') {
    url = url.replace(/\?.*/, '') + '?x-oss-process=image/format,webp'
  } else {
    url = ''
  }

  return {
    resize (options) {
      if (url) {
        const opts = Object.assign({}, options)
        url += reduceOptions(opts, '/resize')
      }

      return this
    },
    watermark () {
      if (url) {
        url += `/watermark,image_${WATERMARK_IMAGE},g_se,x_5,y_5`
      }

      return this
    },
    crop (options) {
      if (url) {
        const opts = Object.assign({ g: 'center' }, options)
        url += reduceOptions(opts, '/crop')
      }

      return this
    },
    done () {
      return url
    }
  }
}

export function handleOSSStyle (url, styleName) {
  if (typeof url === 'string' && url !== '') {
    return url.replace(/\?.*/, '') + '?' + styleName
  }

  return ''
}

let installed = false

export default {
  install (Vue) {
    if (installed) {
      return false
    }

    installed = true

    Vue.prototype.$oss = handleOSSImage
    Vue.prototype.$ossStyle = handleOSSStyle
  }
}
