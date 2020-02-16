# respy

## About

> **respy** is simple template engine to standardize REST API response. it provides elegant way to decouple database model to response data model.

## Usecase Example

> Generally database model has additional fields than required to build response and there are two cases in consideration. the first case, the fields used internally by database or database client (e.g. __v or __id field by MongoDB and Mongoose) and the second, the fields should be hidden to the client because it's too verbose and only occupying I/O bandwidth or sensitive to show to the REST clients. Of couse, there are many other ways (like using proper selection in database query or deleting unrequired item directly) to deal with these situations though, they typically generate a lot of boiler plate and error prone.

## Install

```shell
npm install respy --save
```

## How to Use

### Declare template (basic)

> you can easily define response template like below. let say the template is defined
 as UserTemplate.js for example.

```javascript
var respy = require('respy');

var Geolocation = respy.Template({
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

var GetUserResponse = respy.Template({
    loginId : {
        type: String
    },
    lastname: {
        type: String
    },
    firstname: {
        type: String
    },
    email: {
        type: String
    },
    gender: {
        type: String,
        required: false
    },
    location: {
        type: Geolocation
    }
});

```

### Declare template (recursive templating)

```javascript
var Geolocation = respy.Template({
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
});

Var User = respy.Template({
    age : {
        type: Number
    },
    name: {
        type: String
    },
    locations : {
        type: [Geolocation] /// array of geolocation object
    }
});
```

#### 1.Render single object into REST API response

```javascript
var respy = require('respy');
// mongo document found
var UserData = {
        __id : 'dcbadcbadcbadcbadcba'   // should be excluded from response body
        __v : 'abcdabcdabcdabcdabcd'    // should be excluded from response body
        loginId : 'respy',
        lastname: 'prix',
        firstname: 'fritz',
        email: 'fritzprix@mailinator.com',
        password: 'abcdefg1234',
        age:32,                         // let say this information is very sensitive privacy, so should not included to response body
        gender: 'male',
        location: {
            latitude: 32.4242,
            longitude: 32.4233
        },
        hash: 'ef9ek3mfi9fkeoi'
};

respy(200, UserData).render(res, UserTemplate.GetUserResponse);

```

> the snippet above will generate response like below, you see the fields not required is dropped.

```json

{
    "code": 200,
    "message": "Success",
    "success": true,
    "data": {
      "loginId": "respy",
      "lastname": "prix",
      "firstname": "fritz",
      "email" : "fritzprix@mailinator.com",
      "gender": "male",
      "location": {
        "latitude": 32.4342,
        "longitude": 32.4233
      }
    }
}

```  

#### 2.Render array of data into REST API response

```javascript
respy(200, UserData).render(res, [UserTemplate.GetUserResponse]);
```
