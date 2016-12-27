/**
 * Created by sky on 16/12/5.
 */

function paging(options) {
    this.opts = options;
}

paging.prototype = {
    renderHTML: function () {

    },
    bindEvent: function () {

    },
    setHash: function (page) {
        var domId = this.dom,
            reg = new RegExp('#' + domId + '\.\d+'),
            curHash = '#' + domId + '.' + page,
            hash = location.hash;

        if (hash == null) {
            if (reg.test(hash)) {
                location.hash = hash.replace(reg, curHash);
            } else {
                location.hash = hash + curHash;
            }
        } else {
            location.hash = domId + '.' + page;
        }

    },
    getPage: function () {
        return location.hash.match(new RegExp('#' + this.dom + '\.(\d+)'))[1];
    }
};