;
(function() {
  "use strict";

  /**
   * loader.js script
   */
  var me = document.currentScript;

  /**
   * The head element
   */
  var head = document.getElementsByTagName("head")[0];

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
  var baseDir = realdir(me.baseURI);

  /**
   * Explains where the final baseDir comes from.
   * 
   * It could be:
   * -- "html dir"
   * -- "configJs dir"
   * -- "config()"
   */
  var baseDirExplain = "html dir";

  /**
   * configJs -- The `data-config` script path if exists.
   */
  var configJs;
  if (typeof me.dataset.config == 'string') {
    configJs = realpath(me.dataset.config, baseDir);
    baseDir = realdir(configJs);
    baseDirExplain = "configJs dir";
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
   * Load a script
   * @param {object} obj
   */
  function loadScript(obj) {
    var el = document.createElement("script");
    var id = obj["id"] || getID();

    el.type = obj["type"] || "text/javascript";
    el.id = id;
    el.src = obj.src;
    el.onload = obj.ready || nullFn;

    var insertBase = obj.insertBase || defaultInsertBase;
    var insertPos = obj.insertPos || defaultInsertPos;
    insertBase.insertAdjacentElement(insertPos, el);

    console.log(el);
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
    loadScript({
      src: configJs,
      insertBase: me,
      insertPos: "afterend",
    });
  }
})(window);