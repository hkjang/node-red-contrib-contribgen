contribgen NodeRED Node
=====================

Installing with npm
-------

`npm install node-red-contrib-contribgen`

Adding nodes to the palette
-------
Using the Editor
You can install nodes directly within the editor by selecting the Manage Palette option from the main menu to open the Palette Manager.

The ‘Nodes’ tab lists all of the modules you have installed. It shows which you are using and whether updates are available for any of them.

The ‘Install’ tab lets you search the catalogue of available node modules and install them.


- inspired by contribgen
- make node for node-red

Example
------
https://flows.nodered.org/add/node

### Parameters

- prefix : Prefix of npm module (default: "node-red-contrib-")
- fname : Node name (default: name defined in source)
- module : Module name (default: "node-red-contrib-<node name>")
- version : Node version (format: "number.number.number" like "4.5.1")
- keywords : Additional keywords (format: comma separated string, default: "node-red-contribgen")
- category : Node category (default: "function")
- icon : PNG file for node appearance (image size should be 10x20)
- color : Color for node appearance (format: color hexadecimal numbers like "A6BBCF")
- dst : Destination folder to be created (default: node-red execution location)
- template : Template folder location required to create (default: /home/server/.node-red/node_modules/node-red-contrib-contribgen/templates/function
- lang : Language negotiation information when retrieve a Thing Description
- content : in msg function contents on js file
- ncontent :  in FunctionNode contents on js file 
- form : form contents on html file 
- require : require modules for contrib node (ex. const Diff = require("diff");)
- dependencies : dependencies for contrib node (ex. "diff": "^5.0.0") 
- parameters : msg parameters for contrib node (ex. targetObject: {value:"", required:false},oldValue: {value:"", required:false},newValue: {value:"", required:false},) 

```javascript
msg = {};
msg.prefix = 'node-red-contrib-';
msg.fname = 'newsapi';
msg.module = '';
msg.version = '1.0.0';
msg.keywords = 'newsapi';
msg.category = '';
msg.icon = '';
msg.color = '';
// if OS is linux, MAC
msg.dst = '/home/server/.node-red/node_modules/';
// if OS is Window
msg.dst = 'C:/Users/user/.node-red/node_modules/';
// msg.dst = 'D:/project/';
msg.lang = '';
msg.dependencies = '"newsapi": "^2.4.1"';
msg.require = 'const NewsAPI = require("newsapi");';
msg.ncontent = 'const newsapi = new NewsAPI(n.key);';
msg.content = 'newsapi.v2[node.api](node.queries).then(response => {msg.payload = response;node.send(msg);});';
msg.form = '    <div class="form-row">';
msg.form += '        <label for="node-input-key"><i class="fa fa-key"></i> key</label>';
msg.form += '        <input type="text" id="node-input-key" data-i18n="key">';
msg.form += '    </div>';
msg.parameters = 'api: {value:"", required:false},';
msg.parameters += 'key: {value:"", required:false},';
msg.parameters += 'queries: {value:"", required:false},'
return msg;
```

### Results
```text
Success: node-red-contrib-newsapi
```

Sample Flow
------
```json
[
  {
    "id": "d2ec8c7b.d11a9",
    "type": "inject",
    "z": "a49a72c8.3d0a7",
    "name": "",
    "props": [
      {
        "p": "payload"
      },
      {
        "p": "topic",
        "vt": "str"
      }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 120,
    "y": 220,
    "wires": [
      [
        "c7d049a6.35d868"
      ]
    ]
  },
  {
    "id": "c7d049a6.35d868",
    "type": "function",
    "z": "a49a72c8.3d0a7",
    "name": "newsapi",
    "func": "msg = {};\nmsg.prefix = 'node-red-contrib-';\nmsg.fname = 'newsapi';\nmsg.module = '';\nmsg.version = '1.0.0';\nmsg.keywords = 'newsapi';\nmsg.category = '';\nmsg.icon = '';\nmsg.color = '';\n// if OS is linux, MAC\nmsg.dst = '/home/server/.node-red/node_modules/';\n// if OS is Window\nmsg.dst = 'C:/Users/user/.node-red/node_modules/';\n// msg.dst = 'D:/project/';\nmsg.lang = '';\nmsg.dependencies = '\"newsapi\": \"^2.4.1\"';\nmsg.require = 'const NewsAPI = require(\"newsapi\");';\nmsg.ncontent = 'const newsapi = new NewsAPI(n.key);';\nmsg.content = 'newsapi.v2[node.api](node.queries).then(response => {msg.payload = response;node.send(msg);});';\nmsg.form = '    <div class=\"form-row\">';\nmsg.form += '        <label for=\"node-input-key\"><i class=\"fa fa-key\"></i> key</label>';\nmsg.form += '        <input type=\"text\" id=\"node-input-key\" data-i18n=\"key\">';\nmsg.form += '    </div>';\nmsg.parameters = 'api: {value:\"\", required:false},';\nmsg.parameters += 'key: {value:\"\", required:false},';\nmsg.parameters += 'queries: {value:\"\", required:false},'\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 300,
    "y": 220,
    "wires": [
      [
        "2631fc14.d4ad24"
      ]
    ]
  },
  {
    "id": "e81ccdfa.57e84",
    "type": "debug",
    "z": "a49a72c8.3d0a7",
    "name": "",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "true",
    "targetType": "full",
    "statusVal": "",
    "statusType": "auto",
    "x": 650,
    "y": 220,
    "wires": []
  },
  {
    "id": "2631fc14.d4ad24",
    "type": "contribgen",
    "z": "a49a72c8.3d0a7",
    "prefix": "",
    "fname": "",
    "module": "",
    "version": "",
    "keywords": "",
    "category": "",
    "icon": "",
    "color": "",
    "dst": "",
    "lang": "",
    "template": "",
    "name": "contribgen",
    "x": 490,
    "y": 220,
    "wires": [
      [
        "e81ccdfa.57e84"
      ]
    ]
  }
]

```



