# 测试强缓存和协商缓存

## 启动项目

```bash
pnpm start
```

## 测试缓存

1. 点击 F12 打开浏览器开发者调试工具，同时取消勾选浏览器开发者调试工具的`停用缓存`。
2. 在浏览器输入 `http://localhost:3000/static/fetch.html`。查看网络情况。

> 我试了下通过浏览器输入地址发出的 GET 请求都不会缓存，而 js 发出的请求获取的资源均能被浏览器正常缓存。
