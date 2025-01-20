
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for our Express app',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

export default swaggerOptions;
