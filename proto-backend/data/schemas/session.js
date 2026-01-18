module.exports = {
    $id: 'base',
    type: 'object',
    properties: {
      id: { 
        type: 'string', 
        minimum: 1 
      },
      title: { 
        type: 'string', 
        minimum: 1 
      },
      created_at: { 
        type: 'string', 
        format: 'date-time' 
      },
    }
  };