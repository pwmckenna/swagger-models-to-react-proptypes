# swagger-models-to-react-proptypes
CLI that consumes a swagger endpoint and spits out React propType definitions.

### Installation:
__`npm install -g swagger-models-to-react-proptypes`__

### Usage:

__`swagger-models-to-react-proptypes http://petstore.swagger.io/v2/swagger.json`__

```js
/**
Generated PropTypes for http://127.0.0.1:1337/petstore-v2.0.json----------------------------------------------------------------
**/

import PropTypes from "prop-types";


export const Order = PropTypes.shape({
    id: PropTypes.number,
    petId: PropTypes.number,
    quantity: PropTypes.number,
    shipDate: PropTypes.date,
    status: PropTypes.oneOf([
        "placed",
        "approved",
        "delivered"
    ]),
    complete: PropTypes.bool
});

export const Category = PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
});

export const User = PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    phone: PropTypes.string,
    userStatus: PropTypes.number
});

export const Tag = PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
});

export const ApiResponse = PropTypes.shape({
    code: PropTypes.number,
    type: PropTypes.string,
    message: PropTypes.string
});

export const Pet = PropTypes.shape({
    id: PropTypes.number,
    category: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }),
    name: PropTypes.string.isRequired,
    photoUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    })),
    status: PropTypes.oneOf([
        "available",
        "pending",
        "sold"
    ]),
    createdAt: PropTypes.date
});
```
