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
- content : function contents 
- require : require modules for contrib node (ex. const Diff = require("diff");)
- dependencies : dependencies for contrib node (ex. "diff": "^5.0.0") 
- parameters : msg parameters for contrib node (ex. targetObject: {value:"", required:false},oldValue: {value:"", required:false},newValue: {value:"", required:false},) 

```javascript
msg = {};
msg.prefix = 'node-red-contrib-';
msg.fname = 'jsdiff2';
msg.module = '';
msg.version = '1.0.0';
msg.keywords = 'jsdiff2';
msg.category = '';
msg.icon = '';
msg.color = '';
// if OS is linux, MAC
msg.dst = '/home/server/.node-red/node_modules/';
// if OS is Window
msg.dst = 'C:/Users/user/.node-red/node_modules/';
msg.lang = '';
msg.content = 'msg.payload = Diff[node.targetObject](node.oldValue, node.newValue);';
msg.require = 'const Diff = require("diff");';
msg.dependencies = '"diff": "^5.0.0"';
msg.parameters = 'targetObject: {value:"", required:false},oldValue: {value:"", required:false},newValue: {value:"", required:false},';
return msg;
```

### Results
```text
Success: node-red-contrib-jsdiff2
```

Sample Flow
------
```json
[
  {
    "id": "538bd2b5.dcb82c",
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
    "y": 180,
    "wires": [
      [
        "7e73609b.e5e75"
      ]
    ]
  },
  {
    "id": "a596a6c3.c3a798",
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
    "y": 180,
    "wires": [
      [
        "9657f2c0.ffa33"
      ]
    ]
  },
  {
    "id": "9657f2c0.ffa33",
    "type": "function",
    "z": "a49a72c8.3d0a7",
    "name": "",
    "func": "msg = {};\nmsg.prefix = 'node-red-contrib-';\nmsg.fname = 'jsdiff2';\nmsg.module = '';\nmsg.version = '1.0.0';\nmsg.keywords = 'jsdiff2';\nmsg.category = '';\nmsg.icon = '';\nmsg.color = '';\n// if OS is linux, MAC\nmsg.dst = '/home/server/.node-red/node_modules/';\n// if OS is Window\nmsg.dst = 'C:/Users/user/.node-red/node_modules/';\nmsg.lang = '';\nmsg.content = 'msg.payload = Diff[node.targetObject](node.oldValue, node.newValue);';\nmsg.require = 'const Diff = require(\"diff\");';\nmsg.dependencies = '\"diff\": \"^5.0.0\"';\nmsg.parameters = 'targetObject: {value:\"\", required:false},oldValue: {value:\"\", required:false},newValue: {value:\"\", required:false},';\nreturn msg;",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "x": 300,
    "y": 180,
    "wires": [
      [
        "538bd2b5.dcb82c"
      ]
    ]
  },
  {
    "id": "7e73609b.e5e75",
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
    "y": 180,
    "wires": []
  }
]

```



