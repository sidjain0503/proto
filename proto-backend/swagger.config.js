const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('express-basic-auth');

const swaggerOptions = require('./swagger.json');

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwaggerUI = (app) => {
    const swaggerUIOptions = {
        swaggerOptions: {
            displayRequestDuration: true,
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            docExpansion: 'list',
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            tryItOutEnabled: true,
            requestSnippetsEnabled: true,
            syntaxHighlight: {
                activate: true,
                theme: 'agate',
            },
            authAction: {
                bearerAuth: {
                    name: 'bearerAuth',
                    schema: {
                        type: 'http',
                        in: 'header',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                    value: '',
                },
            },
            requestInterceptor: (req) => {
                try {
                    const auth = window.ui.authSelectors.authorized();

                    // Add timestamp for request tracking
                    req.headers['x-request-timestamp'] = Date.now().toString();
                    return req;
                } catch (error) {
                    console.error('Error in Swagger request interceptor:', error);
                    return req;
                }
            },
            responseInterceptor: (res) => {
                try {
                    if (res.status >= 400) {
                        console.error('API Error Response:', {
                            status: res.status,
                            url: res.url,
                            headers: res.headers,
                        });
                    }
                    return res;
                } catch (error) {
                    console.error('Error in Swagger response interceptor:', error);
                    return res;
                }
            },
        },
        customCss: `
            .swagger-ui .topbar { display: none; }
            .swagger-ui .info { margin: 20px 0; }
            .swagger-ui .scheme-container { background: #fafafa; padding: 10px; border-radius: 4px; }
        `,
        customSiteTitle: 'Proto Backend API Documentation',
    };

    // Set up basic auth for Swagger UI if credentials are provided
    const swaggerUsers = getSwaggerUsers();

    if (Object.keys(swaggerUsers).length > 0) {
        app.use(
            '/api-docs',
            basicAuth({
                users: swaggerUsers,
                challenge: true,
                realm: 'Proto Backend API Documentation',
            }),
        );
    }

    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUIOptions));

    // Health check endpoint for Swagger
    app.get('/api-docs/health', (req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: swaggerSpec.info.version,
        });
    });
};

const getSwaggerUsers = () => {
    const users = {};

    // Use environment variables with fallbacks
    const apiDocUser = process.env.API_DOC_USER;
    const apiDocPassword = process.env.API_DOC_PASSWORD;

    if (apiDocUser && apiDocPassword) {
        users[apiDocUser] = apiDocPassword;
    }

    return users;
};

module.exports = {
    setupSwaggerUI,
};
