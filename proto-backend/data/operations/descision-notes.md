# Database Operations Documentation

When creating secure web applications, especially those that use a database, it's important to be careful and consistent. The `/operations` folder holds shared functions that help manage database actions across the whole app. These functions are designed to:

1. Avoid messy, repeated SQL queries in different files.
2. Make database access uniform and easy to maintain.
3. Keep your business logic (how your app works) separate from your database code, so you can easily swap database systems later if needed.

---

## Architecture Overview

The operations folder provides a unified interface for common database operations (CRUD - Create, Read, Update, Delete). Each operation follows a consistent pattern that emphasizes security, validation, and maintainability.

### Current Operations

- **`get.js`** - Handles data retrieval (READ operations)
- **`insert.js`** - Handles data creation (CREATE operations)
- **`update.js`** - Handles data modification (UPDATE operations)
- **`delete.js`** - Handles data deletion (DELETE operations) - *Currently empty, needs implementation*

---

## Operation Details

### GET Operations (`get.js`)

The `getAll` function retrieves records from a specified table with optional filtering, sorting, and pagination.

#### Function Signature
```javascript
getAll(tableName, conditions = {}, options = {})
```

#### Parameters
- **`tableName`** (string, required): The name of the table to query
- **`conditions`** (object, optional): Contains filtering and selection criteria
  - **`filters`** (object): Key-value pairs for WHERE clause conditions
  - **`select`** (string): Columns to select (default: `"*"`)
- **`options`** (object, optional): Query options
  - **`orderBy`** (string): Column to sort by (default: `'id'`)
  - **`limit`** (number): Maximum number of records (default: `100`)
  - **`offset`** (number): Number of records to skip (default: `0`)

#### How It Works

1. **Input Validation**
   - Checks that inputs (table name, filters, options) are provided
   - Validates that filters are objects
   - Sets defaults for optional parameters

2. **Security and Cleanup**
   - Uses `buildWhereClause` helper to safely construct WHERE conditions
   - Removes undefined/null values from filters
   - **⚠️ Current Issue**: Table name, `orderBy`, and LIMIT/OFFSET are not sanitized against SQL injection
   - Uses parameterized queries for filter values (prevents SQL injection for values)

3. **Query Construction**
   - Builds SQL: `SELECT {select} FROM {tableName} {whereClause}`
   - Appends `ORDER BY {orderBy}` for sorting
   - Appends `LIMIT {limit} OFFSET {offset}` for pagination
   - Note: MySQL doesn't support parameterized LIMIT/OFFSET, so they're concatenated as literals (requires sanitization)

4. **Execution and Handling**
   - Uses prepared statements via `db.query()` for secure execution
   - Returns query results directly
   - Errors are propagated to the caller

#### Example Usage
```javascript
// Basic usage
const users = await getAll('users');

// With filters
const activeUsers = await getAll('users', {
  filters: { status: 'active', role: 'admin' },
  select: 'id, name, email'
});

// With pagination
const page2 = await getAll('users', {}, {
  limit: 20,
  offset: 20,
  orderBy: 'created_at'
});
```

#### Known Limitations
- No single record retrieval by ID (should add `getById` function)
- Limited WHERE clause operators (only equality, no `>`, `<`, `LIKE`, `IN`, `BETWEEN`)
- No soft delete filtering (doesn't check `deleted_at IS NULL`)
- SQL injection risk in table name, orderBy, LIMIT/OFFSET parameters

---

### INSERT Operations (`insert.js`)

The `insertModel` function creates a new record in a specified table with optional schema validation.

#### Function Signature
```javascript
insertModel(tableName, data, schemaName = null)
```

#### Parameters
- **`tableName`** (string, required): The name of the table to insert into
- **`data`** (object, required): Key-value pairs representing the record data
- **`schemaName`** (string, optional): Name of the validation schema to use

#### How It Works

1. **Input Validation**
   - Validates data against schema if `schemaName` is provided
   - Uses AJV validator from `../validators` module
   - Throws validation errors with status code 400 if validation fails

2. **Security and Cleanup**
   - Extracts keys and values from data object
   - Uses parameterized queries (placeholders) to prevent SQL injection
   - **⚠️ Current Issue**: Table name is not sanitized against SQL injection

3. **Query Construction**
   - Builds SQL: `INSERT INTO {tableName} ({keys}) VALUES ({placeholders})`
   - Uses `?` placeholders for each value
   - Executes with parameter array

4. **Execution and Handling**
   - Uses prepared statements via `db.query()` for secure execution
   - Returns object with `insertId` (auto-generated ID) and original data
   - Wraps errors with descriptive message: `"InsertModel Failed {error}"`

#### Example Usage
```javascript
// Basic insert
const newUser = await insertModel('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// With validation
const validatedUser = await insertModel('users', userData, 'user');
// Returns: { id: 123, name: 'John Doe', email: 'john@example.com', ... }
```

#### Known Limitations
- No bulk insert support (only single records)
- No transaction support for related inserts
- SQL injection risk in table name parameter
- No automatic timestamp handling (`created_at`, `updated_at`)

---

### UPDATE Operations (`update.js`)

The `updateModel` function modifies an existing record in a specified table by ID.

#### Function Signature
```javascript
updateModel(tableName, data, id, schemaName = null)
```

#### Parameters
- **`tableName`** (string, required): The name of the table to update
- **`data`** (object, required): Key-value pairs representing fields to update
- **`id`** (number/string, required): The ID of the record to update
- **`schemaName`** (string, optional): Name of the validation schema to use

#### How It Works

1. **Input Validation**
   - Validates that `id` is provided (throws error if missing)
   - Validates data against schema if `schemaName` is provided
   - Uses AJV validator from `../validators` module

2. **Security and Cleanup**
   - Extracts keys and values from data object
   - Uses parameterized queries for SET clause values
   - **⚠️ Current Issue**: Table name and column names are not sanitized

3. **Query Construction**
   - Builds SQL: `UPDATE {tableName} SET {key1} = ?, {key2} = ?, ... WHERE id = ?`
   - Constructs SET clause dynamically from data keys
   - Uses `id` in WHERE clause for precise update

4. **Execution and Handling**
   - Uses prepared statements via `db.query()` for secure execution
   - Returns object with `id` and updated data
   - **⚠️ Bug**: Error message incorrectly says "insertModel Failed" instead of "updateModel Failed"

#### Example Usage
```javascript
// Basic update
const updated = await updateModel('users', {
  name: 'Jane Doe',
  email: 'jane@example.com'
}, 123);

// With validation
const validatedUpdate = await updateModel('users', userData, userId, 'user');
// Returns: { id: 123, name: 'Jane Doe', email: 'jane@example.com', ... }
```

#### Known Limitations
- Only supports updating by ID (no WHERE clause flexibility)
- No bulk update support
- No soft delete consideration (could update deleted records)
- SQL injection risk in table name and column names
- Error message typo needs fixing

---

### DELETE Operations (`delete.js`)

**Status: Not Implemented** ⚠️

The delete operation is currently empty and needs implementation. Consider supporting both:

1. **Hard Delete**: Permanently remove records from database
2. **Soft Delete**: Set `deleted_at` timestamp (preferred for data retention)

#### Recommended Implementation

```javascript
// Soft delete (recommended)
async function softDeleteModel(tableName, id) {
  // Sets deleted_at = NOW() instead of removing record
}

// Hard delete (for permanent removal)
async function deleteModel(tableName, id) {
  // Permanently removes record from database
}
```

---

## Helper Functions

### `buildWhereClause` (from `helpers/data.js`)

Constructs WHERE clauses safely from filter objects.

#### Current Implementation
- Removes undefined/null values from filters
- Supports only equality operators (`key = ?`)
- Joins multiple conditions with `AND`

#### Limitations
- No support for operators: `>`, `<`, `>=`, `<=`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`, `IS NOT NULL`
- No support for `OR` conditions
- No support for complex queries (subqueries, joins)

---

## Security Considerations

### Current Security Measures ✅
- Parameterized queries for values (prevents SQL injection for data values)
- Input validation via AJV schemas
- Filtering out undefined/null values

### Security Gaps ⚠️

1. **Table Name Injection**: Table names are not validated or sanitized
   - **Risk**: User-controlled table names could allow SQL injection
   - **Solution**: Maintain whitelist of allowed table names

2. **Column Name Injection**: Column names in SELECT, ORDER BY, SET clauses are not sanitized
   - **Risk**: Malicious column names could break queries
   - **Solution**: Validate against allowed column list or use strict regex patterns

3. **LIMIT/OFFSET Injection**: Values are parsed but not strictly validated
   - **Risk**: Negative values or non-numeric inputs could cause issues
   - **Solution**: Strict integer validation and bounds checking

---

## Error Handling

### Current Approach
- Errors are wrapped with descriptive messages
- Validation errors include specific field information
- Database errors are propagated with context

### Improvements Needed
- Consistent error formatting across all operations
- Proper error logging for debugging
- Retry logic for transient database errors
- Connection pooling error handling

---

## Data Validation

Validation is handled through AJV (Another JSON Schema Validator) using schemas defined in `/data/schemas/`.

### Validation Flow
1. Schema is loaded from schemas registry
2. Data is compiled and validated against schema
3. Validation errors are formatted and thrown with status code 400
4. Valid data proceeds to database operation

### Supported Features
- Type validation (string, number, integer, boolean, etc.)
- Format validation (email, date-time, URI, etc.)
- Constraint validation (min, max, pattern, etc.)
- Nested object validation

---

## Best Practices

### When Using Operations

1. **Always validate user input** before calling operations
2. **Use schema validation** when available for data operations
3. **Handle errors appropriately** - check error status codes
4. **Use transactions** for multi-step operations (when implemented)
5. **Consider soft deletes** for important data retention

### When Adding New Operations

1. Follow the existing pattern (validation → security → query construction → execution)
2. Use parameterized queries for all values
3. Validate table and column names against whitelists
4. Include proper error handling
5. Add schema validation support
6. Document function signature and usage

---

## Future Enhancements

See the TODO list for detailed improvement tasks. Key areas include:

- Implementing delete operations
- Adding soft delete support
- Enhancing WHERE clause with operators
- Adding transaction support
- Implementing bulk operations
- Improving error handling and logging
- Strengthening security against SQL injection

---

## Common Patterns

### Fetching with Filters
```javascript
const results = await getAll('table', {
  filters: { status: 'active', category_id: 5 },
  select: 'id, name, status'
});
```

### Creating with Validation
```javascript
const newRecord = await insertModel('table', data, 'schemaName');
```

### Updating by ID
```javascript
const updated = await updateModel('table', { field: 'value' }, recordId, 'schemaName');
```

---

