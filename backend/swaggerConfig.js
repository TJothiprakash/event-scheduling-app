const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5000", // Your server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = { swaggerUi, swaggerDocs };
