module.exports = {
    $id: 'base',
    type: 'object',
    properties: {
      id: { 
        type: 'integer', 
        minimum: 1 
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
    }
  };