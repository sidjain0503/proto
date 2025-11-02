# Proto Backend

Proto backend is a Node.js, Express, MySQL-based application designed with a focus on modularity, maintainability, and security. The application follows a clear separation of concerns, keeping business logic separate from database operations.

## Main Objectives

1. **Modular Design** - Organized folder structure that promotes code reusability and maintainability
2. **Avoid Dependency Injection** - Simplified architecture without complex DI patterns
3. **Data Layer with Predefined Operations** - Centralized database operations for consistency and security

## Project Structure

```
proto-backend/
├── config/
│   └── index.js              # Application configuration (database, environment)
├── db/
│   └── index.js              # Database connection and pool management
├── data/
│   ├── operations/           # Core database CRUD operations
│   │   ├── index.js         # Main operations exports
│   │   ├── get.js           # Read operations (SELECT queries)
│   │   ├── insert.js        # Create operations (INSERT queries)
│   │   ├── update.js        # Update operations (UPDATE queries)
│   │   ├── delete.js        # Delete operations (DELETE queries)
│   │   └── descision-notes.md # 📖 Detailed operations documentation
│   ├── schemas/             # JSON Schemas for data validation
│   │   ├── index.js         # Schema registry
│   │   ├── base.js          # Base schema (id, timestamps, soft delete)
│   │   └── user.js          # User-specific schema
│   └── validators/          # AJV validation setup and utilities
│       └── index.js         # Validation functions and schema compiler
├── helpers/
│   └── data.js              # Data manipulation helpers (e.g., buildWhereClause)
├── middleware/
│   └── authValidationMiddleware.js  # Authentication and authorization middleware
├── services/                # Business logic layer
│   └── UserService.js       # User-related business logic
├── routes/                  # Express route definitions
│   ├── index.js            # Route aggregator
│   └── basic.js            # Basic application routes
├── app.js                   # Express application setup
└── server.js                # Server entry point
```

## Core Components

### Database Operations Layer

The `data/operations/` folder contains reusable database operation functions that provide a secure, consistent interface for all database interactions. These operations handle:

- **Security**: Parameterized queries to prevent SQL injection
- **Validation**: Optional schema-based validation before database operations
- **Consistency**: Uniform interface across all database interactions
- **Maintainability**: Centralized location for database query logic

**📖 For detailed documentation on how operations work, security considerations, and usage patterns, see: [Operations Documentation](./proto-backend/data/operations/descision-notes.md)**


### Schema Validation

This application uses [Ajv](https://ajv.js.org/) as a schema validator to ensure data integrity before database operations.

**Features:**
- JSON Schema-based validation
- Support for data types, formats (email, date-time, URI), and constraints
- Automatic type coercion
- Detailed error messages with field-specific feedback
- Reusable schema definitions

**Usage:**
- Schemas are defined in `data/schemas/`
- Validation is triggered automatically when `schemaName` is provided to operations
- Validation errors return HTTP 400 status with descriptive messages

### Database Connection

The `db/index.js` module manages MySQL database connections using a connection pool:
- Connection pooling for efficient resource management
- Automatic connection retry and error handling
- Prepared statement support for secure queries

### Service Layer

Services (`services/`) contain business logic and orchestrate data operations. They:
- Call appropriate database operations
- Handle business rules and validations
- Format responses for API endpoints
- Manage error handling and status codes

## Getting Started

1. **Install Dependencies**
   ```bash
   cd proto-backend
   npm install
   ```

2. **Configure Database**
   - Update `config/index.js` with your database credentials

3. **Run the Application**
   ```bash
   npm start
   # or
   node server.js
   ```

## Architecture Principles

### Separation of Concerns

- **Routes**: Handle HTTP requests/responses and route to services
- **Services**: Contain business logic and orchestrate operations
- **Operations**: Handle database interactions with security and validation
- **Schemas**: Define data structure and validation rules

### Security First

- All database queries use parameterized statements
- Input validation through JSON Schema validation
- Error handling with appropriate HTTP status codes
- Protection against SQL injection through query parameterization

### Code Reusability

- Common database operations are abstracted into reusable functions
- Validation schemas can be shared across different operations
- Helper functions provide utilities for data manipulation

## Development Guidelines

When adding new features:

1. **Define Schemas First** - Create validation schemas in `data/schemas/`
2. **Use Operations** - Leverage existing operations rather than writing raw SQL
3. **Add Business Logic in Services** - Keep services focused on business rules
4. **Follow Patterns** - Maintain consistency with existing code structure
5. **Document Changes** - Update relevant documentation when adding features

For more information on implementing database operations, see the [Operations Documentation](./proto-backend/data/operations/descision-notes.md).
