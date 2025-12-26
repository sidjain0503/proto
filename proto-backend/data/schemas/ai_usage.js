module.exports = {
  $id: 'usage',
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 1
    },
    user_id: {
      type: ['integer', 'null'],
      minimum: 1
    },
    model: {
      type: ['string', 'null'],
      maxLength: 255
    },
    tokens_used: {
      type: ['integer', 'null'],
      minimum: 0
    },
    credits_used: {
      type: ['string', 'null']
    },
    created_at: {
      type: 'string',
      format: 'date-time'
    }
  },
  // user_id, model, tokens_used, prompt, created_at
  required: ['created_at'],
  additionalProperties: false
};