- [@didaui/loader](#didauiloader)
  - [usage](#usage)
    - [`<script src="loader.js" />`](#script-srcloaderjs-)
    - [`loader()` function](#loader-function)
  - [loader.config()](#loaderconfig)
    - [baseDir](#basedir)

-----------------

# @didaui/loader

A loader.

## usage

### `<script src="loader.js" />`

Import the `loader.js` or `loader.min.js` script.  
用 script 导入 `loader.js` 或者 `loader.min.js`.

> If you want to be compatible with IE, please add a specified ID `loaderjs` to the script element. Because the IE family do not support `document.currentScript`.  
> 如果想要兼容 IE，**务必**要把 script 标签加上 `id="loaderjs"`!

```html
<script id="loaderjs" src="path/to/loader.js" data-config="path/to/config.js" />
```

### `loader()` function

```html
<script>
  loader(["jquery", "jquery.form"], readyFn, failFn);
</script>
```

## loader.config()

### baseDir

baseDir 的取值规则如下：

1. 初始值为 HTML 页面所在的目录。此时`baseDirExplain = "html dir"`。
2. 如果 `script` 设置了 `data-config` 配置文件，则配置文件路径为 `页面目录 + data-config位置`，新的 `baseDir` 为配置文件的所在目录。此时`baseDirExplain = "config dir"`。
3. 如果配置文件文件里面显式设置了`baseDir`，则新的 `baseDir` 为 `当前baseDir + 显示设置的baseDir`。此时`baseDirExplain = "config()"`。

注意事项：

1. `baseDir`是个目录，不管是从页面路径自动获取的，还是自行在代码里面设置的，都必须要以`/`结尾。
2. 上述(2),(3)两种情况，如果设置的路径是以 `http`, `https`, `file` 开头的 URL，或者是以`/`开头的绝对地址，则不会和当前的`baseDir`合成，而是直接作为新的 baseDir。
