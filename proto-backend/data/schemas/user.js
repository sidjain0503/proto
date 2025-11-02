module.exports = {
    $id: 'user',
    type: 'object',
    properties: {
      id: { 
        type: 'integer', 
        minimum: 1 
      },
      name: { 
        type: 'string', 
        minLength: 2, 
        maxLength: 100 
      },
      email: { 
        type: 'string', 
        format: 'email', 
        maxLength: 255 
      },
      password: { 
        type: 'string', 
        minLength: 6 
      },
      last_login: { 
        type: ['string', 'null'], 
        format: 'date-time' 
      },
      created_at: { 
        type: 'string', 
        format: 'date-time' 
      },
      updated_at: { 
        type: 'string', 
        format: 'date-time' 
      },
      deleted_at: { 
        type: ['string', 'null'], 
        format: 'date-time' 
      }
    },
    // required: ['name', 'email', 'password'],
    additionalProperties: false
  };