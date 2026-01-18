const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { schemas } = require('../schemas');

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  coerceTypes: true
});

addFormats(ajv);

function validateData(data, schemaName) {
  const schema = schemas[schemaName];
  
  if (!schema) {
    const error = new Error(`Schema '${schemaName}' not found`);
    error.statusCode = 500;
    throw error;
  }

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors.map(error => {
      return `${error.instancePath} ${error.message}`;
    }).join(', ');
    
    const error = new Error(`Validation failed: ${errors}`);
    error.statusCode = 400;
    throw error;
  }

  return true;
}

// // Generic validator for any schema (useful for dynamic validation)
// function validateWithSchema(data, schema) {
//   const validate = ajv.compile(schema);
//   const valid = validate(data);

//   if (!valid) {
//     const errors = validate.errors.map(error => {
//       return `${error.instancePath} ${error.message}`;
//     }).join(', ');
    
//     throw new Error(`Validation failed: ${errors}`);
//   }

//   return true;
// }

module.exports = {
  validateData,
//   validateWithSchema,
  ajv
};