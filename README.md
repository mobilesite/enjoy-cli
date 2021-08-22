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
lerna create @enjoy-cli/cli
# 然后将创建得到的cli目录移动至core目录下
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

```bash
cd utils
lerna create @enjoy-cli/log
# 然后将创建得到的log目录移至utils目录下
```

```bash
lerna add npmlog utils/log
```

然后编辑utils\log\lib\index.js为：

  'use strict';

  module.exports = index;

  const log = require('npmlog');

  function index() {
    log.info('cli', 'test');
  }

并在utils\log\package.json中将"main"修改为"lib/index.js"。

然后到core\cli\package.json中的dependencies中添加如下内容以对@enjoy-cli/log模块进行注册。

```
"@enjoy-cli/log": "file:../../utils/log"
```

然后到core\cli\lib\index.js中使用@enjoy-cli/log模块：

```js
'use strict';

module.exports = index;

const log = require('npmlog');

function index() {
  log.info('cli', 'test');
}
```

之后，再切换到core\cli目录下执行`npm link`（如果报错的话可以先npm unlink之后再link）。

这时候，执行enjoy-cli会的得到如下输出：
  Hi, enjoy-cli!
  0.1.0
  info cli test
