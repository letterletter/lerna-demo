lerna bootstrap --npm-client=yarn

lerna bootstrap --npm-client=cnpm

lerna ERR! EWORKSPACES --hoist is not supported with --npm-client=yarn, use yarn workspaces instead
https://blog.csdn.net/i10630226/article/details/99702447



```
lerna bootstrap
lerna add A --scope=B // 给A添加以依赖B
lerna bootstarp // 这条命令会给所有的package安装依赖
lerna bootstrap --scope=package // 安装某个依赖包
lerna bootstrap --hoist axios // 提升公共包到根目录
lerna clean // 删除所有依赖
lerna clean --scope=package //删除某个包的依赖
```