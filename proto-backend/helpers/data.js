async function buildWhereClause(filters = {}) {
  let whereClause = "WHERE";
  const params = [];

  const validfilters = Object.entries(filters).filter(
    ([key, value]) => value !== undefined && value !== null
  );

  if (validfilters.length > 0) {
    const filtersStr = validfilters
      .map(([key]) => {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
          throw Object.assign(new Error(`Invalid filter column: ${key}`), {
            statusCode: 400,
          });
        }
        return `${key} = ?`;
      })
      .join(" AND ");
    whereClause += ` ${filtersStr}`;

    validfilters.forEach(([, value]) => params.push(value));
  } else {
    whereClause = "";
  }

  return { where: whereClause, params };
}

module.exports = {
  buildWhereClause,
};
