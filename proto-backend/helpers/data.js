async function buildWhereClause(filters = {}) {
  let whereClause = "WHERE";
  const params = [];

  const validfilters = Object.entries(filters).filter(
    ([key, value]) => value !== undefined && value !== null
  );

  if (validfilters.length > 0) {
    const filtersStr = validfilters.map(([key]) => `${key} = ?`).join(" AND ");
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
