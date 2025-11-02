When creating secure web applications, especially those that use a database, it’s important to be careful and consistent. The `/operations` folder holds shared functions that help manage database actions across the whole app. These functions are designed to:

1. Avoid messy, repeated SQL queries in different files.
2. Make database access uniform and easy to maintain.
3. Keep your business logic (how your app works) separate from your database code, so you can easily swap database systems later if needed.

Here’s why and how we organize our “get” (fetch) database functions:

### How We Build "Get" Queries

We use a step-by-step approach:

1. **Input Validation**
   - Check that the inputs (table name, filters, options) are valid, expected, and safe.

2. **Security and Cleanup**
   - Prevent SQL injection by handling user inputs carefully, especially for things like table or column names.
   - Remove any undefined or null values in filters.
   - Support special cases like filtering by arrays, ranges, or partial text matches, as needed.

3. **Query Construction**
   - Start with: `SELECT * FROM tableName`
   - Add WHERE conditions, including a default check for "not deleted" if needed, plus any extra filters.
   - Optionally add `ORDER BY`, `LIMIT`, and `OFFSET` to control sorting and paging.

4. **Execution and Handling**
   - Use prepared statements with parameters — this keeps things secure.
   - Handle possible errors cleanly.
   - Manage cases where no results are returned, and other edge cases.

This setup keeps our database code secure, tidy, and flexible, making your app easier to build and maintain.