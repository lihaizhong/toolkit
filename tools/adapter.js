/**
 * Created by sky on 2016/12/20.
 * 适配手机屏幕
 * 注：标签的尺寸单位请使用 rem(根据html的font-size定义宽度)
 *    页面按照640px宽度定义，如果想要得到750px的宽度，只要修改成7.5rem即可，以此类推！(rem = px/100)
 */

(function (doc, win) {
    var docEl = doc.documentElement,
        docBody = doc.body,
        maxWidth = docEl.dataset['mw'] || 750,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        // 当文档正在加载时,返回loading,
        // 当文档结束渲染但内在资源正在加载时,返回interactive
        // 当文档加载完成时,返回complete
        readyRE = /complete|loaded|interactive/,
        ratio = window.devicePixelRatio || 1,
        retina = function () {
            var metas, meta, i = 0;
            if (window.devicePixelRatio) {
                meta = document.createElement('meta');
                meta.setAttribute('name', 'viewport');
                meta.setAttribute('content', 'width=device-width, initial-scale=' + (1/ratio) + ', user-scalable=no');
                metas = document.querySelectorAll('meta[name="viewport"]');
                for (; i < metas.length; i++) {
                    document.head.removeChild(metas[i]);
                }
                document.head.appendChild(meta);
            }
        },
        recalc = function () {
            var clientWidth;
            if (win.innerWidth) {
                clientWidth = win.innerWidth;
            } else if (docEl && docEl.getBoundingClientRect) {
                clientWidth = docEl.getBoundingClientRect().width;
            } else {
                clientWidth = docBody.getBoundingClientRect().width;
            }
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / maxWidth) + 'px';
        };

    retina();
    if (document.addEventListener) {
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    } else if (document.attachEvent) {
        win.attachEvent(resizeEvt, recalc);
        doc.attachEvent('onreadystatechange', function() {
            if (readyRE.test(doc.readyState)) {
                recalc();
            }
        });
    }
})(document, window);