var _ = require('lodash');

var indent = function (str) {
    return _.map(str.split('\n'), function (line) {
        return '    ' + line;
    }).join('\n');
};

var missingRefPropType = function(props, propName, componentName) {
    return new Error('PropType could not be determined due to a missing Swagger model definition reference');
};

var unknownPropType = function(props, propName, componentName) {
    return new Error('PropType could not be determined from Swagger model definition');
};

var getPropType = function (definition) {
    if (definition.enum) {
        return 'React.PropTypes.oneOf(' + JSON.stringify(definition.enum, null, 4) + ')';
    }
    if (definition.$ref) {
        var name = definition.$ref.match('#/definitions/(.*)')[1];
        return name === 'undefined' ? missingRefPropType.toString() : 'PropTypes.' + name;
    }
    switch (definition.type) {
    case 'object':
        if(_.isEmpty(definition.properties)) {
            return 'React.PropTypes.object';
        }
        return 'React.PropTypes.shape({\n'
            + indent(_.map(definition.properties, function (property, name) {
                var keyPropType = convertDefinitionObjectToPropTypes(property, name);
                if (_.contains(definition.required || [], name)) {
                    keyPropType += '.isRequired';
                }
                return keyPropType;
            }).join(',\n')) +
        '\n})';
    case 'array':
        return 'React.PropTypes.arrayOf(' + getPropType(definition.items) + ')';
    case 'string':
        return 'React.PropTypes.string';
    case 'integer':
    case 'number':
        return 'React.PropTypes.number';
    case 'boolean':
        return 'React.PropTypes.bool';
    default:
        return unknownPropType.toString();
    }
};

var convertDefinitionObjectToPropTypes = function (definition, name) {
    return name + ': ' + getPropType(definition);
};

module.exports = function (swagger) {
    var header = 'Generated PropTypes for ' + swagger.url;
    console.log('\n/**\n\n' + header + '\n' + new Array(header.length + 1).join('-') + '\n\n**/\n\n');

    console.log('var PropTypes = {\n');

    var propTypes = _.map(swagger.models, function (model, name) {
        return convertDefinitionObjectToPropTypes(model.definition, name);
    });

    console.log(indent(propTypes.join(',\n\n')));
    console.log('\n};\n\n');
};