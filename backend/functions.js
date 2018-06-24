var syspath = '/Users/angel/Desktop/computer_vision/finalproject/palmprint-verification-with-siamese-net/';

function tailor(label, direction, index) {
    var exec = require('child_process').exec;
    var arg1 = label;
    var arg2 = direction;
    var arg3 = index;
    var filename = syspath + 'backend/pyScripts/Tailor.py';
    exec('python'+' '+filename+' '+arg1+' '+arg2+' '+arg3+' '+syspath,function(err,stdout,stderr){
        if(err)
        {
            console.log('stderr',err);
        }
        if(stdout)
        {
            // console.log('stdout',stdout);
            // var astr = stdout.split('\r\n').join('');//delete the \r\n
            var astr = stdout.split('\n');
            // console.log('aaaaaaaa',astr, astr.length)
            var json = astr[astr.length-2];
            // console.log('json',json);

            var obj = JSON.parse(json);

            console.log('result',obj.result);
            return obj.result   // success: 0   error: 1
        }
    });
};

function verify(label) {
    var exec = require('child_process').exec;
    var arg1 = label;
    var filename = syspath + 'backend/pyScripts/Verification.py';
    exec('python'+' '+filename+' '+arg1+' '+syspath,function(err,stdout,stderr){
        if(err)
        {
            console.log('stderr',err);
        }
        if(stdout)
        {
            console.log('stdout',stdout);
            var astr = stdout.split('\n');
            console.log('as',astr);
            var json = astr[astr.length-2];
            var obj = JSON.parse(json);
            console.log('result',obj.result);
            return obj.result   // success: 0   error: 1
        }
    });
};






