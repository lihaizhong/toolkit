/**
 * Created by sky on 16/10/25.
 */

var assert = require('assert');

require('./ajax');

var HOST = 'localhost:3000';

describe('ajax', function () {
    it('应该返回正确的ajax数据', function (done) {
        assert(ajax({
            url: HOST + '/api/ajax.json',
            contentType: 'applicaton/json',
            complete: function (result) {
                console.log(result);
                done();
            }
        }));
    });
})

