# Vuepress 博客主题

继承自[@vuepress/theme-blog](https://github.com/ulivz/vuepress-theme-blog)

## 主题特点

1. 添加了评论功能，使用`gitalk`插件实现评论。
2. 优化了样式。
3. 兼容`@vuepress/theme-blog`所有配置。
4. 兼容`gitalk`所有配置。
5. 添加赞赏功能，可配置赞赏二维码。

## 配置

```javascript
module.exports = {
  themeConfig: {
    // gitalk 配置
    commentConfig: {
      clientID: '',
      clientSecret: '',
      repo: 'rats',
      owner: 'lihaizhong',
      admin: ['lihaizhong']
    }
  }
}
```

**注意：**`commentConfig`的具体配置与`gitalk`一致。
