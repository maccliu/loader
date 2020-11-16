loader.config({
  baseDir: "/",
  paths: {
    jquery: ["node_modules/jquery/dist/jquery.min.js"],
  }
});
console.log(loader());