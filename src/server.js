import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";

const getContentType = (ext) => {
  return (
    {
      ".js": "application/javascript",
      ".css": "text/css",
      ".html": "text/html",
      ".ico": "image/x-icon",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".json": "application/json",
    }[ext] || "text/plain"
  );
};

const server = createServer((req, res) => {
  console.log("req", req.url);
  if (req.url.startsWith("/static")) {
    const filePath = path.join(process.cwd(), req.url);
    const ext = path.extname(filePath);
    if (ext) {
      const contentType = getContentType(ext);
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "max-age=10", // http1.1版本 优先级高于expires
        // "expires": new Date(Date.now() + 10 * 1000).toUTCString(), // http1.0版本，
      });
    }
    const file = fs.readFileSync(filePath);
    res.end(file);
  } else if (req.url === "/strongCache") {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "max-age=10", // 在10秒内浏览器都不会发出请求而是直接走缓存
    });
    res.end("max-age=100000");
  } else if (req.url === "/negotiateCache") {
    let ETAG = "123";
    if (req.headers["if-none-match"] === ETAG) {
      res.writeHead(304);
      ETAG = "456";
      res.end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache", // 或者max-age=0
      etag: ETAG,
    });
    res.end("协商缓存");
  } else if (req.url === "/varyCache") {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Cache-Control": "max-age=60", // 或者max-age=0
      Vary: "cookie", // 给缓存添加校验字段 这样浏览器会根据校验字段来判断是否需要进行缓存
      "Set-Cookie": "foo=bar",
    });
    res.end("给缓存添加校验字段"); //
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);
