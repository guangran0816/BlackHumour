#!/usr/bin/env node

var lodash = require('lodash'),
    fs = require("fs");

var writeLog = false;

var _firstKeyParseToNum = false;

function log(content) {
    'use strict';
    if (writeLog) {
        console.log(content);
    }
}

function toLua(obj, offset) {
    'use strict';
    if (obj === null || obj === undefined) {
        return "nil";
    }
    if (!lodash.isObject(obj)) {
        if (typeof obj === 'string') {
            return '"' + obj + '"';
        }
        return obj.toString();
    }

    if (!offset) {
        offset = '';
    }

    var result = "{\n",
    isArray = obj instanceof Array,
    len = lodash.size(obj),
    i = 0;
    lodash.forEach(obj, function (v, k) {
        if (isArray) {
            result += offset + '\t' + toLua(v, offset+'\t');
        } else {
            if (_firstKeyParseToNum && offset == '' && Number(k)) {
                result += offset + '\t[' + k + '] = ' + toLua(v, offset + '\t');
            }
            else {
                let str = offset + '\t["' + k + '"] = ' + toLua(v, offset + '\t');
                result += str;
            }
        }
        if (i < len - 1) {
            result += ",\n";
        }
        i += 1;
    });
    result += "\n" + offset + "}";
    return result;
}

function loadJsonString(strJson) {
    'use strict';
    var obj = JSON.parse(strJson);
    return obj;
}

function loadJson(filePath) {
    'use strict';
    var content = fs.readFileSync(filePath),
        obj = loadJsonString(content);
    log(obj);
    return obj;
}

function writeText(filePath, text) {
    'use strict';
    log(text);
    fs.writeFileSync(filePath, text);
}

function fromObject(obj, dstFilePath) {
    'use strict';

    var luaString = toLua(obj);
    if (dstFilePath) {
        writeText(dstFilePath, luaString);
    }
    return luaString;
}

function fromString(str, dstFilePath, firstKeyParseToNum) {
    'use strict';
    _firstKeyParseToNum = firstKeyParseToNum
    
    var obj = loadJsonString(str),
        luaString = fromObject(obj, dstFilePath);
    return luaString;
}

function fromFile(srcFilePath, dstFilePath) {
    'use strict';
    var obj = loadJson(srcFilePath),
        luaString = fromObject(obj, dstFilePath);
    return luaString;
}

module.exports = {
    fromFile: fromFile,
    fromString: fromString,
    fromObject: fromObject,
    log: log
};