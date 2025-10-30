async function buildWhereClause(conditions = {}) {
    let whereClause = 'WHERE deleted_at IS NULL';
    const params = [];
    
    const validConditions = Object.entries(conditions).filter(([key, value]) => 
      value !== undefined && value !== null
    );

    if (validConditions.length > 0) {
      const conditionsStr = validConditions
        .map(([key]) => `${key} = ?`)
        .join(' AND ');
      whereClause += ` AND ${conditionsStr}`;
      validConditions.forEach(([, value]) => params.push(value));
    }

    return { where: whereClause, params };
  }

  module.exports = {
    buildWhereClause
  }