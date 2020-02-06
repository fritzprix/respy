var respy = require('../index');

function Response() {
    var _response;
    const header = function (header) {

    }
    const send = function (object) {
        _response = JSON.stringify(object);
    };

    const end = function (message) {
        _response = message;
    };

    const to_string = function () {
        return _response;
    }

    return {
        header,
        send,
        end,
        to_string
    };
}
const TestTemplate = respy.Template({
    id: {
        type: Number
    },
    name: {
        type: String
    }
});

const TestDataDoc = [
    {
        _id: 1,
        id: 1,
        name: 'a'
    },
    {
        _id: 1,
        id: 2,
        name: 'b'
    }
];

const TestData = [
    {
        id: 1,
        name: 'a'
    },
    {
        id: 2,
        name: 'b'
    }
];

var assert = require('assert');

describe('Respy', function () {
    describe('#render(response, [template])', function () {
        var res = Response();
        it('should generate list of stripped out response object', function () {
            respy(200, TestDataDoc).render(res, [TestTemplate]);
            assert.equal(JSON.parse(res.to_string()).data[0]._id, undefined);
        });
    });
});

describe('Respy', function () {
    describe('#render(response, template)', function () {
        var res = Response();
        it('should generate stripped out response object', function () {
            respy(200, TestDataDoc[0]).render(res, TestTemplate);
            assert.equal(JSON.parse(res.to_string()).data._id, undefined);
        });
    });
});

describe('Respy', function () {
    describe('#render(response, null)', function () {
        var res = Response();
        it('should generate ', function () {
            respy(200).render(res);
            assert.equal(JSON.stringify(JSON.parse(res.to_string()).data), '{}');
        });
    });
});