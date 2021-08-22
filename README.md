# enjoy-cli

```bash
mkdir enjoy-cli
cd enjoy-cli
npm init
code enjoy-cli
```

添加 .gitignore文件

```bash
lerna init
mkdir commands & mkdir models & mkdir core & mkdir utils
```

删除packages文件夹
将lerna.json改为：
  {
    "packages": [
      "commands/*",
      "core/*",
      "models/*",
      "utils/*"
    ],
    "version": "0.1.0"
  }

```bash
git config user.name paian
git config user.email xxx@xxx.com
npm config set registry https://registry.npm.taobao.org
git remote add origin https://github.com/mobilesite/enjoy-cli.git
```
