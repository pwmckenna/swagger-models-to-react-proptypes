# swagger-models-to-react-proptypes
CLI that consumes a swagger endpoint and spits out React propType definitions.

### Installation:
__`npm install -g swagger-models-to-react-proptypes`__

### Usage:

__`swagger-models-to-react-proptypes http://petstore.swagger.io/v2/swagger.json`__

```js
/**

Generated PropTypes for http://petstore.swagger.io/v2/swagger.json
------------------------------------------------------------------

**/


var PropTypes = {

    Order: React.PropTypes.shape({
        id: React.PropTypes.number,
        petId: React.PropTypes.number,
        quantity: React.PropTypes.number,
        shipDate: React.PropTypes.string,
        status: React.PropTypes.oneOf([
            "placed",
            "approved",
            "delivered"
        ]),
        complete: React.PropTypes.bool
    }),
    
    Category: React.PropTypes.shape({
        id: React.PropTypes.number,
        name: React.PropTypes.string
    }),
    
    User: React.PropTypes.shape({
        id: React.PropTypes.number,
        username: React.PropTypes.string,
        firstName: React.PropTypes.string,
        lastName: React.PropTypes.string,
        email: React.PropTypes.string,
        password: React.PropTypes.string,
        phone: React.PropTypes.string,
        userStatus: React.PropTypes.number
    }),
    
    Tag: React.PropTypes.shape({
        id: React.PropTypes.number,
        name: React.PropTypes.string
    }),
    
    Pet: React.PropTypes.shape({
        id: React.PropTypes.number,
        category: PropTypes.Category,
        name: React.PropTypes.string.isRequired,
        photoUrls: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        tags: React.PropTypes.arrayOf(PropTypes.Tag),
        status: React.PropTypes.oneOf([
            "available",
            "pending",
            "sold"
        ])
    }),
    
    ApiResponse: React.PropTypes.shape({
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        message: React.PropTypes.string
    })

};
```
