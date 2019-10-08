/**
 * 
 * 一些通用方法
 */

var shelljs = require("shelljs");
var fs = require("fs");
var crypto = require('crypto');
var path = require('path');

function Exec(cmd) {
    console.log('Exec: ', cmd);
    var res = shelljs.exec(cmd);
    var execRes = res.code;
    if (execRes !== 0) {
        shelljs.echo('Error: ' + cmd + ' failed!');
        console.log(res);
        shelljs.exit(1);
    }
    return res;
}

function mkdir_r(path) {
    if (fs.existsSync(path)) {
        return ;
    }

    var index = path.lastIndexOf('/');
    if (index + 1 === path.length) {
        mkdir_r(path.substring(0, path.length - 1));
        return;
    }

    var pre = path.substring(0, index);
    if (!fs.existsSync(pre)) {
        mkdir_r(pre);
        fs.mkdirSync(path);
    } else {
        fs.mkdirSync(path);
    }
}

function travelDir(dir, callback) {
    var pa = fs.readdirSync(dir);
    pa.forEach(function (ele, index) {
        var pdir = dir + '/' + ele;
        var info = fs.statSync(pdir);
        if (info.isDirectory()) {
            travelDir(pdir, callback);
        }
        else if (info.isFile()) {
            callback(pdir);
        }
    })
}

function CP2(sourceDir, destDir, msg) {
    console.log(sourceDir, destDir, msg);

    var res = shelljs.rm('-rf', destDir).code;
    if (res !== 0) {
        shelljs.exit(1);
    }

    if (!fs.existsSync(destDir)) {
        mkdir_r(destDir);
    }

    res = shelljs.cp('-rf', sourceDir, destDir).code;
    if (res !== 0) {
        shelljs.exit(1);
    }
}

function HCD(path) {
    shelljs.cd(path);
}

exports.Exec = Exec;

exports.mkdir_r = mkdir_r;

exports.travelDir = travelDir;

exports.HCD = HCD;

exports.HExit = (co) => {
    shelljs.exit(co);
}

function egertPublishSyncRes(projectDir, language) {
    HCD(projectDir)

    if (language) {
        // 拷贝资源
        CP2(projectDir + '/../resources/assets/*', projectDir + '/resource/assets', '发布前同步资源');
        CP2(projectDir + '/../resources/sound/*', projectDir + '/resource/sound', '发布前同步声音');

        if (language === 'cn' || language === 'en') {
            // assets
            var sourceDir = projectDir + '/../resources/assets_' + language;
            var targetDir = projectDir + '/resource/assets';
            var mergeCmd = 'node ' + path.dirname(__filename) + '/MergeDir.js ' + sourceDir + ' ' + targetDir;
            Exec(mergeCmd);

            // // bones/wife特殊处理
            // console.log('bones/wife特殊处理')
            // var srcBonesDir = path.normalize(sourceDir + '/bones/wife/');
            // var destBonesDir = path.normalize(targetDir + '/bones/wife/')
            // var strSync = "rsync -avz --delete --exclude='external' " + srcBonesDir + " " + destBonesDir;
            // Exec(strSync);

            // // sound
            // var sourceSoundDir = projectDir + '/../resources/sound_' + language;
            // var targetSoundDir = projectDir + '/resource/sound';
            // mergeCmd = 'node ' + path.dirname(__filename) + '/MergeDir.js ' + sourceSoundDir + ' ' + targetSoundDir;
            // Exec(mergeCmd);
        }

        let rmdir = '';
        if (language === 'en') {
            rmdir = 'rm -r ' + projectDir + '/resource/sound/dubbing/cn';
        }
        else {
            rmdir = 'rm -r ' + projectDir + '/resource/sound/dubbing/en'
        }
        Exec(rmdir)
    }
}

function egretCleanDefaultRes(defaultres) {
    let defaultCfg = require(defaultres);

    var filename = defaultres;
    var filedir = path.dirname(filename);

    let todefaultCfg = {
        "groups": defaultCfg['groups'],
        'resources': []
    };

    for (var key in defaultCfg["resources"]) {
        let asseturl = defaultCfg['resources'][key]['url'];
        let assetCleanUrl = asseturl.split('?')[0];

        let fullfilepath = filedir + '/' + assetCleanUrl;

        if (fs.existsSync(fullfilepath)) {
            todefaultCfg['resources'].push(defaultCfg['resources'][key]);
        }
        else {
            console.log('delete ', assetCleanUrl);
        }
    }

    var todefaultfullpath = filedir + '/default.res.json';
    fs.writeFileSync(todefaultfullpath, JSON.stringify(todefaultCfg));
}

exports.egertPublishSyncRes = egertPublishSyncRes;

exports.egretCleanDefaultRes = egretCleanDefaultRes;

exports.egertPublish = (projectDir, language) => {
    shelljs.cd(projectDir);

    // if (language) {
    //     // 拷贝资源
    //     CP2(projectDir + '/../resources/assets/*', projectDir + '/resource/assets', '发布前同步资源');
    //     CP2(projectDir + '/../resources/sound/*', projectDir + '/resource/sound', '发布前同步声音');

    //     if (language === 'cn' || language === 'en') {
    //         // assets
    //         var sourceDir = projectDir + '/../resources/assets_' + language;
    //         var targetDir = projectDir + '/resource/assets';
    //         var mergeCmd = 'node ' + path.dirname(__filename) + '/MergeDir.js ' + sourceDir + ' ' + targetDir;
    //         Exec(mergeCmd);

    //         // sound
    //         var sourceSoundDir = projectDir + '/../resources/sound_' + language;
    //         var targetSoundDir = projectDir + '/resource/sound';
    //         mergeCmd = 'node ' + path.dirname(__filename) + '/MergeDir.js ' + sourceSoundDir + ' ' + targetSoundDir;
    //         Exec(mergeCmd);
    //     }
    // }

    egertPublishSyncRes(projectDir,language);

    var stringCmd = 'egret publish'
    Exec(stringCmd);
    console.log('发布成功!');

    // 获取发布目录
    var publishRoot = projectDir + '/bin-release/web/';
    shelljs.cd(publishRoot);

    var maxTimeFile = 0;
    var pa = fs.readdirSync('.');
    pa.forEach(function (ele, index) {
        var info = fs.statSync('./' + ele);
        if (info.isDirectory()) {
            if (parseInt(ele) > maxTimeFile) {
                maxTimeFile = parseInt(ele);
            }
        }
    })

    var defaultResDir = path.resolve('./') + '/' + maxTimeFile + '/resource/default.res.json';

    egretCleanDefaultRes(defaultResDir);

    var buildVersionCmd = 'node ../../buildResourcesVersion.js ' + defaultResDir;
    Exec(buildVersionCmd);

    return publishRoot + maxTimeFile
}

exports.CP2 = CP2;

exports.ExecDangerous = (cmd) => {
    var resCode = shelljs.exec(cmd).code;

    return resCode;
}

exports.MD5 = (file) => {
    var filedata = fs.readFileSync(file);
    var h = crypto.createHash('md5');
    h.update(filedata);
    var retmd5 = h.digest('hex');

    return retmd5;
}

exports.GitPullOrClone = (remoteUrl, destPath) => {
    var fileExist = fs.existsSync(destPath);

    console.log('destPath : ' + destPath + '  ', fileExist);

    if (fileExist) {
        shelljs.cd(destPath);

        var pullCmd = 'git pull';
        Exec(pullCmd);
    }
    else {
        var cloneCmd = 'git clone ' + remoteUrl + ' ' + destPath;
        console.log('clone from ' + remoteUrl + ' to ' + destPath);
        Exec(cloneCmd);
    }
}

exports.GitCommitAndPush = (path, msg) => {
    var fileExist = fs.existsSync(path);

    if (!fileExist) {
        console.log(path + ' not exist!!! check check check');
        return ;
    }

    HCD(path)

    var res = Exec('git status');
    var haveChanges = (res.indexOf('Changes not staged for commit') != -1) || (res.indexOf('Untracked files') != -1);
    if (haveChanges) {
        Exec('git add .')

        var cmstr = 'git commit -a -m ' + '\"' + msg + '\"';
        Exec(cmstr);

        Exec('git push');
    }
    else {
        console.log('git - nothing to commit!!');
    }
}

exports.GitCleanLocal = (dir) => {
    HCD(dir);

    Exec('git fetch origin --prune');
    Exec('git reset --hard');
    Exec('git clean -xdf');
}

exports.GitSwitchBranch = (branchname) => {
    var gitSwitch = "git checkout " + branchname;
    Exec(gitSwitch);
}

exports.svnCleanLocal = (dir) => {
    Exec('svn revert ' + dir + ' -R');

    Exec('svn cleanup --remove-unversioned ' + dir);
}

exports.svnUpdate = (dir) => {
    Exec('svn up ' + dir);
}

exports.SvnCommit = (path, cmd) => {
    HCD(path);

    let cmdstat = "svn stat | grep \\! | awk '{ print $2 }' | xargs svn remove || exit 1";

    Exec(cmdstat);

    let cmdadd = "svn add * --force";

    Exec(cmdadd);

    let cmdCmt = 'svn commit -m \"'  + cmd + '\"';

    Exec(cmdCmt);
}