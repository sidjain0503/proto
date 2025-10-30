const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  coerceTypes: true
});

addFormats(ajv);

// Load all schemas from /schemas/index.js
const userSchema = require('../schemas/userSchema');
const baseSchema = require('../schemas/baseSchema');

// Register schemas
const schemas = {
  user: userSchema,
  base: baseSchema
};

// Reusable validation function
function validateData(data, schemaName) {
  const schema = schemas[schemaName];
  
  if (!schema) {
    throw new Error(`Schema '${schemaName}' not found`);
  }

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors.map(error => {
      return `${error.instancePath} ${error.message}`;
    }).join(', ');
    
    throw new Error(`Validation failed: ${errors}`);
  }

  return true;
}

// Generic validator for any schema (useful for dynamic validation)
function validateWithSchema(data, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors.map(error => {
      return `${error.instancePath} ${error.message}`;
    }).join(', ');
    
    throw new Error(`Validation failed: ${errors}`);
  }

  return true;
}

module.exports = {
  validateData,
  validateWithSchema,
  ajv
};