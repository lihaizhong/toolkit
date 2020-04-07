import xhrAdapter from 'axios/lib/adapters/xhr'
import settle from 'axios/lib/core/settle'

export default function DuplicateAdaptor () {
  const HTTPRequestingMinor = {}
  return function adaptor (config) {
    // 通过Ajax请求获取返回结果
    return xhrAdapter(config).then(response => {
      return response
    })
  }
}
