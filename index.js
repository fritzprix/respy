/**
 * Created by innocentevil on 16. 7. 6.
 */


function Template(schema, strict) {

    var valiate = function (_this, object) {
        if (!(_this instanceof _Template)) {
            throw new Error('Invalid Template');
        }
        var schema = _this.schema;
        for (var key in schema) {
            if (!(key in object)) {
                if (_this.strict) {
                    throw new Error('key \'' + key + '\' is not found in strict mode');
                }
                else if (schema[key].default) {
                    _this[key] = schema[key].default;
                } else if (schema[key].required) {
                    throw new Error(key + ' is not avaiable');
                }
            } else if (object[key] != undefined) {
                if (Array.isArray(schema[key].type)) {
                    if (Array.isArray(object[key])) {
                        _this[key] = object[key].map(x => new schema[key].type[0](x));
                    } else {
                        throw new Error(key + 'is should be array');
                    }
                } else {
                    _this[key] = new schema[key].type(object[key]);
                }
            }
        }
    };

    function _Template(object) {
        this.validate(this, object);
    }

    _Template.prototype.strict = strict;

    _Template.prototype.schema = schema;

    _Template.prototype.validate = valiate;

    return _Template;

}

function Response(code, data, message) {
    var _code = code || 200;
    var _message = message || ResponseCode[code].message;
    var _data = data || {};
    var _success = ResponseCode[code].success;

    var render = function (res, template) {
        res.header({ 'Content-Type': 'application/json' });
        res.statusCode = _code;
        var resobj = {};
        resobj.code = _code;
        resobj.message = _message;
        resobj.success = _success;
        if (_data) {
            resobj.data = _data;
            if (template) {
                if (Array.isArray(template)) {
                    // array template 
                    if (Array.isArray(_data)) {
                        resobj.data = _data.map(x => new template[0](x));
                    } else {
                        resobj.data = [new template[0](_data)];
                    }
                } else {
                    resobj.data = new template(_data);
                }
            } else {
                resobj.data = _data
            }
        }
        if (code == 200) {
            res.end(JSON.stringify(resobj));
        } else {
            res.end(JSON.stringify(resobj));
        }
    };
    return { render: render }
}


var ResponseCode = {
    200: { code: 200, message: 'Success', success: true },
    201: { code: 201, message: 'Created', success: true },
    202: { code: 202, message: 'Accepted', success: true },
    203: { code: 204, message: 'No Content', success: true },
    400: { code: 400, message: 'Bad Request', success: false },
    401: { code: 401, message: 'Unauthorized', success: false },
    403: { code: 403, message: 'Forbidden', success: false },
    404: { code: 404, message: 'Not Found', success: false },
    405: { code: 405, message: 'Method Not Allowed', success: false },
    408: { code: 408, message: 'Request Timeout', success: false },
    409: { code: 409, message: 'Conflict', success: false },
    500: { code: 500, message: 'Internal Server Error', success: false },
    501: { code: 501, message: 'Not Implemented', success: false },
    502: { code: 502, message: 'Bad Gateway', success: false },
    503: { code: 503, message: 'Service Unavailable', success: false }
};

module.exports = Response;
module.exports.code = ResponseCode;
module.exports.Template = Template;