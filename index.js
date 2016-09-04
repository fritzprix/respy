/**
 * Created by innocentevil on 16. 7. 6.
 */


function Template(schema, strict){

    var valiate = function(_this, object) {
        if(!(_this instanceof _Template)) {
            throw Exception('Invalid Template');
        }
        var schema = _this.schema;
        for(var key in schema) {
            if(!(key in object)) {
                if(schema[key].default) {
                    _this[key] = schema[key].default;
                } else if(schema[key].required){
                    throw new Error(key + ' is not avaiable');
                }
            } else if(object[key] != undefined){
                if(schema[key].type == Array) {
                    // if type is array validate
                    _this[key] = new schema[key].type();
                    if(object[key] != undefined) {
                        for (var index = 0; index < object[key].length; index++) {
                            _this[key].push(new schema[key].item(object[key][index]));
                        }
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

    _Template.strict = strict;

    _Template.prototype.schema = schema;

    _Template.prototype.validate = valiate;

    return _Template;

}

function Response(code, data, message) {
    var _code = code || 200;
    var _message = message || ResponseCode[code].message;
    var _data = data;
    var _this = this;

    var render = function(res, template) {
        res.header({'Content-Type':'application/json'});
        res.statusCode = _code;
        var resobj = {};
        resobj.code = _code;
        resobj.message = _message;
        if(_data) {
            resobj.data = _data;
            if(template) {
                resobj.data = new template(_data);
            }
        }
        if(code == 200) {
            res.end(JSON.stringify(resobj.data));
        } else {
            res.end(JSON.stringify(resobj));
        }
        return _this;
    };
    return {render: render}
}


var ResponseCode = {
    200: {code: 200, message:'Success'},
    201: {code: 201, message:'Created'},
    202: {code: 202, message:'Accepted'},
    203: {code: 204, message:'No Content'},
    400: {code: 400, message:'Bad Request'},
    401: {code: 401, message:'Unauthorized'},
    403: {code: 403, message:'Forbidden'},
    404: {code: 404, message:'Not Found'},
    405: {code: 405, message:'Method Not Allowed'},
    408: {code: 408, message:'Request Timeout'},
    409: {code: 409, message:'Conflict'},
    500: {code: 500, message:'Internal Server Error'},
    501: {code: 501, message:'Not Implemented'},
    502: {code: 502, message:'Bad Gateway'},
    503: {code: 503, message:'Service Unavailable'}
};

module.exports = Response;
module.exports.code = ResponseCode;
module.exports.Template = Template;