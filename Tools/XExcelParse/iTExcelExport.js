/**
 * 
 * npm init -f
 * npm install xlsx
 * 
 * node iTExcelExport.js excel_dir out_dir
 */

var iT_excel_format2json = require('./iT_excel_format2json');
var HUtils = require('../HUtils');

var process = require('process');
var path = require('path');

var G_CURPATH = path.dirname(__filename);

var arguments = process.argv.splice(2);

let excelDir = arguments[0]; 
if (!path.isAbsolute(excelDir)) {
    excelDir = path.normalize(G_CURPATH + excelDir);
}

let outdir = arguments[1]; 
if (!path.isAbsolute(outdir)) {
    outdir = path.normalize(G_CURPATH + outdir);
}

console.log(argumexcelDir + ' -> ' + outdir);

let excelParse = iT_excel_format2json.ExcelParse.createObj();

HUtils.travelDir(excelDir, (file) => {
    let extname = path.extname(file);
    if (extname != '.xlsx') {
        return ;
    }

    let filename = path.basename(file, extname);
    if (filename.charAt(0) == '~') {
        return;
    }

    let basedir = path.dirname(file);
    let relativeDir = path.relative(excelDir, basedir);
    let reoutdir = path.join(outdir, relativeDir);

    console.log('---------------' + filename + '---------------');

    let res = excelParse.readExcel(file, reoutdir);

    if (res == 0) {
        console.log(file + ' export success!');

        if (!relativeDir) {
            relativeDir = '.'
        }
    }
    else {
        console.log(file + ' export failed. err: ' + res);
    }
});

// excelParse.setDataBeginLine(4);

