### Proto backend 

Proto backend is a nodejs, express, mysql based application. 
Main objectives : 
1. Modular design 
2. Avoid dependency injection
3. data layer with predefinef operations

```

proto-backend/
├── config/
│   └── index.js
├── db/
│   ├── connection.js
│   └── operations/
│       ├── index.js          # Main data layer exports
│       ├── insert.js         # Create operations
│       ├── get.js           # Read operations  
│       ├── update.js        # Update operations
│       └── delete.js        # Delete operations
├── schemas/                 # JSON Schemas for validation
│   ├── userSchema.js
│   └── baseSchema.js
├── validators/              # AJV validation setup
│   └── index.js
├── services/               # Business logic
├── routes/                # Express routes
├── app.js
└── server.js

````