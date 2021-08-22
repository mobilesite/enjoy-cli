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

npmlog这个模块的代码是非常短的，只有300多行，通过阅读源码，我们发现，它实际导出的是log对象，源码中往log对象上挂载了一系列的方法，例如：
```js
log.addLevel('silly', -Infinity, { inverse: true }, 'sill')
log.addLevel('verbose', 1000, { fg: 'blue', bg: 'black' }, 'verb')
log.addLevel('info', 2000, { fg: 'green' })
log.addLevel('timing', 2500, { fg: 'green', bg: 'black' })
log.addLevel('http', 3000, { fg: 'green', bg: 'black' })
log.addLevel('notice', 3500, { fg: 'blue', bg: 'black' })
log.addLevel('warn', 4000, { fg: 'black', bg: 'yellow' }, 'WARN')
log.addLevel('error', 5000, { fg: 'red', bg: 'black' }, 'ERR!')
log.addLevel('silent', Infinity)
```

所以我们才能以形如`log('info', 'xxx')`这样的形式调用到这些方法。因此我们也是可以通过`log.addLevel`来定义自己的方法的，该方法的第二个参数是log等级，第三个参数是log的前景色、背景色、字体加粗等设置。npmlog的默认等级见如下这句源码：
```js
// default level
log.level = 'info'
```
我们会发现，默认的等级是info，info所对应的等级是2000，也就是说，在调用log的时候，level小于2000的那些都是不会被打印出来的，比如log('verbose', 'xxx')的等级是1000，所以默认是不会打印出来的。那怎么让它能打印出来呢，我们可以通过修改`log.level='verbose'`降低默认log等级，从而达到目的。

因此，将utils\log\lib\index.js修改成：
```js
const log = require('npmlog');

log.level = 'verbose';
log.addLevel('success', 2000, {
  fg: 'green',
  bold: true
});

module.exports = log;
```

将core\cli\lib\index.js修改成：
```js
'use strict';

module.exports = core;

const log = require('@enjoy-cli/log');
const pkg = require('../package.json');

function core() {
  checkPkgVersion();
}

function checkPkgVersion() {
  console.log(pkg.version);
  log.verbose('test verbose');
  log.success('test success');
}
```

这时再执行`enjoy-cli`将得到如下结果：
```
Hi, enjoy-cli!
0.1.0
verb test verbose
success test success
```

当然，对于log的默认level，最合理的方式还是根据环境变量来分别设定，如果是执行命令时传入了--debug参数，则设置为verbose，否则还是用info。

```js
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';
```

这样就可以让默认的log.level从LOG_LEVEL这个环境变量中取。至于怎么将--debug参数转成LOG_LEVEL这个环境变量，我们在参数解析时再讲。
