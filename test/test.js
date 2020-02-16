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

const Person = respy.Template({
    name: {
        type: String
    },
    age: {
        type: Number
    }
});



const Position = respy.Template({
    x: {
        type: Number
    },
    y: {
        type: Number
    }
});

const TestTemplate = respy.Template({
    id: {
        type: Number
    },
    me: {
        type: Person
    },
    name: {
        type: String
    },
    positions: {
        type: [Position]
    },
    adj_nodes: {
        type: [Number]
    }
});

const TestDataDoc = [
    {
        _id: 1,
        id: 1,
        me: {
            name: 'david',
            age: 32
        },
        name: 'a',
        positions: [
            {
                x: 1,
                y: 2
            },
            {
                x: 1,
                y: 2
            }
        ],
        adj_nodes: [
            1,
            2,
            3
        ]
    },
    {
        _id: 1,
        id: 2,
        me: {
            name: 'david',
            age: 32
        },
        name: 'b',
        positions: [
            {
                x: 1,
                y: 2
            },
            {
                x: 1,
                y: 2
            }
        ],
        adj_nodes: [
            1,
            2,
            3
        ]
    }
];

const TestData = [
    {
        id: 1,
        name: 'a',
        me: {
            name: 'david',
            age: 32
        },
        positions: [
            {
                x: 1,
                y: 2
            },
            {
                x: 1,
                y: 2
            }
        ],
        adj_nodes: [
            1,
            2,
            3
        ]
    },
    {
        id: 2,
        name: 'b',
        me: {
            name: 'david',
            age: 32
        },
        positions: [
            {
                x: 1,
                y: 2
            },
            {
                x: 1,
                y: 2
            }
        ],
        adj_nodes: [
            1,
            2,
            3
        ]
    }
];

var assert = require('assert');

describe('Respy', function () {
    describe('#render(response, [template])', function () {
        var res = Response();
        it('should generate list of stripped out response object', function () {
            respy(200, TestDataDoc).render(res, [TestTemplate]);
            let parsed = JSON.parse(res.to_string());
            assert.equal(parsed.data[0]._id, undefined);
            assert.equal(parsed.data[0].positions[0].x, 1);
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

const SimplePerson = respy.Template({
    name: String,
    age: Number,
    location: [Position]
});

const SimpleUser = {
    name: 'david',
    age: 1,
    location: [
        { x: 1, y: 2 },
        { x: 2, y: 4 }
    ]
}


const SimpleUserDoc = {
    __v: 'abcddcbaabcddcba',
    __id: 'abcddcbaabcddcbaabcddcba',
    name: 'david',
    age: 1,
    location: [
        { x: 1, y: 2 },
        { x: 2, y: 4 }
    ]
}


describe('Respy', function () {
    describe('#render(response, SimplyfiedTemplate)', function () {
        var res = Response();
        it('should generate ', function () {
            respy(200, SimpleUserDoc).render(res, SimplePerson);
            assert.equal(JSON.stringify(JSON.parse(res.to_string()).data), JSON.stringify(SimpleUser));
        });
    });
});
