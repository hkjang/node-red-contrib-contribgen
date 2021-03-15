const contribgen = require('./lib/nodegen.js');
const fs = require('fs');
module.exports = function (RED) {
  function contribgenFunction(config) {
    RED.nodes.createNode(this, config);
    var self = this;
    this.prefix = config.prefix || "";
    this.name = config.fname || "";
    this.module = config.module || "";
    this.version = config.version || "";
    this.version = config.version || "";
    this.keywords = config.keywords || "";
    this.category = config.category || "";
    this.icon = config.icon || "";
    this.color = config.color || "";
    this.dst = config.dst || "";
    this.lang = config.lang || "";
    this.template = config.template || "";
    this.on('input', function(msg) {
      var data = {};
      data.prefix = self.prefix || msg.prefix;
      data.name = self.fname || msg.fname;
      data.module = self.module || msg.module;
      data.version = self.version || msg.version;
      data.keywords = self.keywords || msg.keywords;
      data.category = self.category || msg.category;
      data.icon = self.icon || msg.icon;
      data.color = self.color || msg.color;
      data.dst = self.dst || msg.dst;
      data.lang = self.lang || msg.lang;
      data.template = self.template || msg.template;
      data.require = self.require || msg.require;
      data.parameters = self.parameters || msg.parameters;
      data.dependencies = self.dependencies || msg.dependencies;
      data.ncontent = self.ncontent || msg.ncontent;
      data.form = self.form || msg.form;

      var options = {};
      var promise;
      // var sourcePath = './sample.js';
      var sourcePath = msg.sourcePath;
      data.src = sourcePath;
      if (msg.content) {
        // .js -> Function node
        data.src = msg.content;
        promise = contribgen.function2node(data, options);
      } else if (/\.json$/.test(sourcePath)) {
        // JSON could be a Function node, or Swagger
        var content = JSON.parse(fs.readFileSync(sourcePath));
        if (Array.isArray(content)) {
          data.src = content;
          promise = contribgen.function2node(data, options);
        }
      } else if (/\.js$/.test(sourcePath)) {
        // .js -> Function node
        data.src = fs.readFileSync(sourcePath);
        promise = contribgen.function2node(data, options);
      } else {
        msg.payload = 'error: Unsupported file type';
        self.send(msg);
      }
      if (promise) {
        promise.then(function (result) {
          msg.payload = 'Success: ' + result;
          self.send(msg);
          self.error('Success: ' + result);
        }).catch(function (error) {
          msg.payload = 'Error: ' + error;
          self.error('Error: ' + error);
          self.error(error.stack);
        });
      }

    });
  }
  RED.nodes.registerType('contribgen', contribgenFunction);
};
