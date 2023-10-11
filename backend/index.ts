/*__________________________________________

 ✅ import
____________________________________________*/

// config
import config_obj from './src/config/index.js'

//  libraries
import express from 'express'
import dotenv from 'dotenv'
import { cloudinaryConfig, imageUploadMiddleware } from 'express-cloudinary-image-handler'

//  types
import { Express } from 'express'

//  middlewares from this project
import cors_middleware from './src/middlewares/cors-middleware.js'
import morgan_logger_middleware from './src/middlewares/morgan-logger-middleware.js'
import helmet_middleware from './src/middlewares/helmet-middleware.js'
import global_error_handler_middleware from './src/error-handlers/global-error-handler/global-error-handler-middleware.js'
import cookie_parser_middleware from './src/middlewares/cookie-parser-middleware.js';

// routes from this project
import global_routes from './src/routes/global-routes.js'
import email_auth_routes from './src/routes/auth/email-auth-routes.js'
import oauth_routes from './src/routes/auth/oauth-routes.js'
import sign_out_routes from './src/routes/auth/sign-out-route.js'
import delete_account_routes from './src/routes/auth/delete-account-route.js'
import user_routes from './src/routes/user-auth-routes.js'

// routes (movie manager)
import tmdb_api_routes from './src/routes/movie-manager/tmdb-api-routes.js'
import bookmark_movie_routes from './src/routes/movie-manager/bookmark-movie-routes.js'


// utils from this project
import connect_db_and_start_server from './src/utils/database-connection/connect-db-and-start-server.js'

// error handlers
import not_found_controller from './src/error-handlers/not-found-controller.js'




/*__________________________________________

 ✅ middlewares, config & initial setup
____________________________________________*/

// dotenv
dotenv.config()

// express
const app: Express = express()


//helmet (helmet library)
/* 💡 This middleware must be placed at the top so that everything has to go through this middleware which will make sure everything's safety. */
helmet_middleware(app)


// http logger (morgan library)
morgan_logger_middleware(app)


// CORS (cors library)
cors_middleware(app)


// parse incoming JSON data in the request body
app.use(express.json())

// parse cookie
cookie_parser_middleware(app)


// imageUploadMiddleware 
imageUploadMiddleware(app)


// cloudinary config
cloudinaryConfig({
    cloudName: config_obj.env.cloudinary_cloud_name,
    apiKey: config_obj.env.cloudinary_api_key,
    apiSecret: config_obj.env.cloudinary_api_secret
})



// routes 
app.use('/', global_routes)
app.use('/api/v1/auth/email', email_auth_routes)
app.use('/api/v1/auth/oauth', oauth_routes)
app.use('/api/v1/auth', sign_out_routes)
app.use('/api/v1/auth', delete_account_routes)
app.use('/api/v1/user', user_routes)

// routes (movie manager)
app.use('/api/v1/movie-manager/tmdb', tmdb_api_routes)
app.use('/api/v1/movie-manager/bookmark', bookmark_movie_routes)


// route not found 
/* 💡 This route must be placed after all the routes */
app.all('*', not_found_controller)


// global error handling middleware 
/* 💡 This middleware must be placed after all the middlewares */
app.use(global_error_handler_middleware)


// connect db and start server
connect_db_and_start_server(app)

