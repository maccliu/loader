;
(function() {
  "use strict";

  /**
   * global variables
   */
  var doc = document;

  /**
   * The head element
   */
  var head = doc.getElementsByTagName("head")[0];

  /**
   * default insert base element
   * default insert position
   */
  var defaultInsertBase = head;
  var defaultInsertPos = "beforeend";

  /**
   * null Function
   */
  var nullFn = function() {};

  /**
   * html url
   */
  var htmlURL = window.location.href;

  /**
   * html path (removed querystring and fragment)
   */
  var htmlPath = htmlURL
    .split('?').shift() // remove querystring
    .split('#').shift(); // remove fragment

  /**
   * baseDir -- The base dir of all path.
   *
   * 1. The html's dir which invoke loader.js.
   *    baseDir = realdir(`html.baseURI`)
   * 2. If exists data-config attribute, overwrited with the data-config script file dir.
   *    baseDir = realdir(`baseDir` + `data-config`)
   * 3. If the config script has `baseDir` item
   *    baseDir = realdir(`baseDir` + baseDir)
   *
   * Notes:
   * 1. baseDir MUST ends with "/"
   *    right: "a/b/c/"
   *    wrong: "a/b/c"    <-- Wrong!!
   */
  var baseDir = realdir(htmlPath);

  /**
   * Explains where the final baseDir comes from.
   *
   * It could be:
   * -- "html dir"
   * -- "config dir"
   * -- "config()"
   */
  var baseDirExplain = "html dir";

  /**
   * this loader.js script
   * 
   * If you want to be compatible with IE, please add a specified ID
   * `loaderjs` to the script element. Because the IE family do not 
   * support `document.currentScript`.
   */
  var me = doc.currentScript || doc.getElementById("loaderjs");

  /**
   * configJs -- The `data-config` script path if exists.
   */
  var configJs;
  if (me.hasAttribute('data-config')) {
    configJs = realpath(me.getAttribute('data-config'), baseDir);
    baseDir = realdir(configJs);
    baseDirExplain = "config dir";
  }

  /**
   * An auto increment integer to generate a random ID.
   */
  var autoid = 0;
  var paths = {},
    deps = {},
    loaded = {};

  /**
   * config
   * @param {object} conf
   */
  function config(conf) {
    if (typeof conf.baseDir == "string") {
      baseDir = realpath(conf.baseDir, baseDir);
      baseDirExplain = "config setting";
    }
    if (typeof conf.paths == "object") paths = conf.paths;
    if (typeof conf.deps == "object") deps = conf.deps;
  }

  /**
   * The main function
   */
  function loader() {
    return {
      baseDir: baseDir,
      baseDirExplain: baseDirExplain,
      configJs: configJs,
      autoid: autoid,
      paths: paths,
      deps: deps,
      loaded: loaded,
    }
  }

  /**
   * Resolve a path to the real path
   * @param {string} rel - relative path
   * @param {string} base - base path
   */
  function realpath(rel, base) {
    // set a default value to base
    if (arguments.length < 2) base = '';

    // if rel begins with "http:", "https:", "file:"
    //     or begins with "/"
    // then
    //     do not concat base and rel.
    var path;
    if (/^([http:|https:|file:|\/])/.test(rel)) {
      path = rel;
    } else {
      path = base + rel;
    }

    var a = path.split('/');
    var n = [];
    while (a.length) {
      var b = a.shift();
      if (b == '.') continue;
      if (b == '..') {
        if (n.length) {
          n.pop();
        }
        continue;
      }
      n.push(b);
    }
    return n.join('/');
  }

  /**
   * Resolves the real dir of a path.
   * @param {string} path
   */
  function realdir(path) {
    var a = path.split('/');
    var n = [];
    while (a.length) {
      var b = a.shift();
      if (b == '.') continue;
      if (b == '..') {
        if (n.length) {
          n.pop();
        }
        continue;
      }
      n.push(b);
    }
    if (n.length) n.pop();
    return n.join('/') + '/';
  }

  /**
   * Get a new random id
   * eg. id_1_zfkos
   */
  function getID() {
    var s = "abcdefghijklmnopqrstuvwxyz";
    var r = '_';
    for (var i = 0; i < 5; ++i) {
      r += s.substr((Math.random() * 26), 1);
    }
    return ('id_' + (++autoid) + r);
  }

  /**
   * Load file
   * @param {string} path
   * @param {object} options
   */
  function loadFile(path, options) {
    // props
    var props = {};

    // js
    if (/(\.js$)/.test(path)) {
      props = {
        _type: "js",
        _el: "script",
        type: "text/javascript",
        src: path,
      }
    }

    // css
    else if (/(\.css$)/.test(path)) {
      props = {
        _type: "css",
        _el: "link",
        rel: "stylesheet",
        href: path,
      }
    }

    // image
    else if (/(\.(jpg|png|gif|jpeg|svg|webp)$)/.test(path)) {
      props = {
        _type: "img",
        _el: "img",
        src: path,
      }
    }

    // combine props and options
    for (var i in options) {
      props[i] = options[i];
    }

    // return fail
    if (!props._el) return -1;

    // create a HTML element
    var el = doc.createElement(props._el);
    var insertBase = props._insertBase || defaultInsertBase;
    var insertPos = props._insertPos || defaultInsertPos;
    for (var i in props) {
      if ('string' == typeof i && i.substr(0, 1) != '_') {
        el[i] = props[i];
      }
    }

    // event
    el.onload = function(ev) {
      console.log('load ' + path + ' ok');
    }
    el.onerror = function(ev) {
      console.error('load ' + path + ' fail');
    }

    // insert element to HTML
    insertBase.insertAdjacentElement(insertPos, el);
  }

  /**
   * exports
   */
  window.loader = loader;
  window.loader.config = config;
  window.loader.realpath = realpath;
  window.loader.realdir = realdir;

  /**
   * load the config script if exists
   */
  if (configJs) {
    loadFile(configJs, {
      _insertBase: me,
      _insertPos: "afterend",
    });
  }
})(window);