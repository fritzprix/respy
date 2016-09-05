## respy 
### About 
> **respy** is simple template engine to standardize REST API response. it provides 
elegant way to manage response model as template separated from the service logic and 
type-safety for response. typically useful convert the data object into response object 
that have similar model from each other.

### Install 
```shell
npm install respy --save
```

### How to Use
#### Define template
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

module.exports.GetUserResponse = GetUserResponse;
```
#### Render Data object into REST API response
```javascript

var UserTemplate = require('./UserTemplate');
var UserData = {
        loginId : 'respy',
        lastname: 'prix',
        firstname: 'fritz',
        email: 'fritzprix@mailinator.com',
        gender: 'male',
        location: {
            latitude: 32.4242,
            longitude: 32.4233
        },
        hash: 'ef9ek3mfi9fkeoi'
};
var respy = require('respy');
respy(200, UserData).render(res, UserTemplate.GetUserResponse);
```
> the snippet above will generate response like below
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
> you can see the field not defined in template is removed from response
 