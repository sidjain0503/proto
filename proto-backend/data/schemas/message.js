module.exports = {
    $id: 'message',
    type: 'object',
    properties: {
      id: { 
        type: 'integer', 
        minimum: 1 
      },
      session_id: { 
        type: 'string', 
        minimum: 1 
      },
      content: {
        type: ['string', 'null'], 
        minimum: 1
      },
      role: {
        type: 'string',
        minimum: 1
      },
      metadata: {
        type: ['string', 'null'],
      },
      created_at: { 
        type: 'string', 
        format: 'date-time' 
      },
      updated_at: { 
        type: 'string', 
        format: 'date-time' 
      },
    }
  };