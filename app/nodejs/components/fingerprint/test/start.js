/**
 * Created by sky on 16/4/26.
 */
var fingerprint = require("./../fingerprint");
// status: !0 清除 | 0 生成 
var status = process.env.STATUS;
status = Number(status);

fingerprint({
    base: __dirname + "fingerprint/test",
    src: ['/static/', '!/static/css/test.css'],
    dist: '/html/',
    mapping: '/'
}).init(status);


// STATUS=[status] node start.js