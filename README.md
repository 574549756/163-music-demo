# 模仿网易云音乐
## 1. 包含后台管理页面
1. 上传歌曲，编辑歌曲信息，歌词等
2. 创建歌单，编辑歌单信息，描述，包含歌曲等（歌单与歌曲通过中间表关系关联方便查询）

## 如何启动管理页面？
依赖 `http-server`

```
npm install -g http-server

http-server -c-1
node server 8888
open http://127.0.0.1:8080/src/admin.html
```
