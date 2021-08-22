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
git add .
git commit -m 'feat: init project'
git push -u origin main
```

```
cd core
lerna create cli
cd cli
npm i import-local npmlog -S
mkdir bin
touch index.js
```

编辑core\cli\bin\index.js内容为：

  #! /usr/bin/env node

  const importLocal = require('import-local');
  console.log('Hi, enjoy-cli!');

  if (importLocal(__filename)) {
    // 如果本地node_modules存在@enjoy-cli/core的情况下，会走这个分支
    require('npmlog').info('cli', '正在使用enjoy-cli的本地版本');
  } else {
    require('../lib')(process.argv.slice(2));
  }

然后在core\cli目录下执行npm link。

然后就可以通过执行`enjoy-cli`来执行这个cli了。
