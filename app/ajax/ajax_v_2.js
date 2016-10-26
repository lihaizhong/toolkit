/**
 * Created by sky on 16/10/26.
 * Ajax Level 2 Implemention
 * dependence ajax_v_1.js
 */

;(function (global) {
    var Ajax = global.ajax.extend(true),
        init = Ajax.prototype.init.bind(Ajax);

    Ajax.extend(Ajax.defaultSettings, {
        formData: null
    });

    // Ajax.xxx
    global.ajax.extend(true, {
        getFormData: function (formData) {
            var fd, key, value;
            if (Ajax.util.isObject(formData)) {
                fd = new FormData();
                for (key in formData) {
                    value = formData[key];
                    fd.append(key, value);
                }
            }

            return fd;
        }
    });

    // Ajax.prototype.xxx
    global.ajax.extend({
        // overwrite init
        init: function () {
            var self = this,
                setting = self._setting,
                formData = setting.formData;

            setting.data = Ajax.getFormData(formData);
            setting.contentType = 'multipart/form-data';
            setting.method = 'POST';

            init();
        }
    });
})(window);