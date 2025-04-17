import config from "../../../config/environment";

export default {
  "definition": {
    "openapi": "3.0.0",
    "info": {
      "title": "Product service documentation",
      "summary": "Product service documentation",
      "baseUrl": "/v1/products",
      "version": "1.0.0",
      "description":
        "This is the documentation of the product microservice that gathers all the product-specific functionalities realized with Express and documented with Swagger.",
      "termsOfService": "#",
      "license": {
        "name": "Apache 2.0",
        "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
      },
      "contact": {
        "name": "Contact the Developper",
        "url": "#",
        "email": "valentinmagde@gmail.com"
      }
    },
    "basePath": "/v1/docs",
    "externalDocs": {
      "description": "Find more info here",
      "url": "#"
    },
    "servers": [
      {
        "url": `${config.apiGatewayUrl}`,
        "description": `${config.env} server`,
        "//variables": {
          "username": {
            "default": "demo",
            "description": "this value is assigned by the service provider, in this example `gigantic-server.com`"
          },
          "port": {
            "enum": [
              "8443",
              "443"
            ],
            "default": "8443"
          },
          "basePath": {
            "default": "v2"
          }
        }
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    }
  },
  "apis": [
    "./src/app/routes/*/*.ts",
    "./src/app/modules/*/*.ts",
    "./src/resources/swagger/product-docs/components/*.yaml",
    "./src/resources/swagger/product-docs/responses/*.yaml"
  ]
}