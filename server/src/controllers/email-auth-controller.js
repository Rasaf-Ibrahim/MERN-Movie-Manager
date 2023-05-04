// library
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { nanoid } from 'nanoid'


// model
import user_model from '../models/user-model.js'
import refresh_token_model from '../models/refresh-token-model.js'

// utils
import { hash_password, compare_passwords } from '../utlis/hash-password/hash-password.js'
import generate_token from '../utlis/generate-token/generate-token.js'
import send_mail from '../utlis/send-mail/send-mail.js'
import AppError from '../utlis/error-handlers/app-error.js'
import tryCatchAsync from '../utlis/error-handlers/try-catch-async.js'



/*-------------------------------------------------------------------
 ✅ signup_user
----------------------------------------------------------------------*/

const signup_user = tryCatchAsync(async (req, res, next) => {


    // 🍪 Extract the name, email, and password from the request body
    let { full_name, email, password, password_confirm, role } = req.body;


    // 🍪 Validate the full_name field (because in schema, we don't have validation check for full_name)
    if (!/^[A-Za-z\s.-]{3,60}$/.test(full_name)) {

        return next(new AppError('Please enter a valid name containing only English letters, spaces, dots, or hyphens, with a length between 3 and 60 characters.', StatusCodes.BAD_REQUEST))

    }


    // 🍪 Create a new user in the database with the extracted data
    let created_document = await user_model.create({
        full_name: full_name.trim(),
       
        //making username unique and less than 20 characters
        username: `${full_name.trim().split(' ')[0].substring(0, 10)}_${nanoid(8)}`,

        email,
        password,
        password_confirm,
        role
    })



    /*🔖 
    
        - You may think, in the mongoose schema, we have set 'select:false' for the password field. So, the above created_document will not include password field.
        - But 'select:false' only works when we query, use find, findOne(), etc methods. 
        - But 'select:false' in the schema will not work for create method. So, we will need to explicitly exclude the password before we send the created_document as response
    
    */



    // 🍪 we will send the following object as response
    const user_info = {
        _id: created_document._doc._id,
        full_name: created_document._doc.full_name,
        username: created_document._doc.username,
        email: created_document._doc.email,
        is_email_confirmed: created_document._doc.is_email_confirmed,
        picture_link: created_document._doc.picture_link,
        role: created_document._doc.role
    }


    // 🍪 We will also send access and refresh token as response
    const access_token = generate_token(created_document._id, 'access')
    const refresh_token = generate_token(created_document._id, 'refresh')



    // 🍪 send a success response with the user data and access, refresh tokens
    res.status(StatusCodes.CREATED).json({

        status: 'User has been registered successfully.',
        user_info,
        access_token,
        refresh_token
    })



})



/*-------------------------------------------------------------------
 ✅ send_email_verification_mail
----------------------------------------------------------------------*/

const send_email_verification_mail = tryCatchAsync(async (req, res, next) => {

    // get the email from the request body
    const { email } = req.body

    // find the user document in the database that matches the email
    const user_document = await user_model.findOne({ email })

    // if there is no user document with that email, throw an error and exit the function
    if (!user_document) {

        return next(new AppError('There is no user with that email.', StatusCodes.NOT_FOUND))
    }

    // if there is a user document with that email, but the email is not confirmed yet
    if (user_document && !user_document.is_email_confirmed) {

        // send a verification email to the user using a helper function
        await send_mail(user_document._id, email, 'email verification');

        // send a success response to the client with a message
        res.status(StatusCodes.OK).json({
            status: `Email is successfully sent to this address: ${user_document.email}. If you don't find the email on your inbox, please check the spam folder as well.`
        })

    }


    // if the user's email is already confirmed
    else if (user_document && user_document.is_email_confirmed) {

        // send a failure response to the client with a message
        res.status(StatusCodes.EXPECTATION_FAILED).json({
            status: "User's email is already confirmed"
        })
    }

})




/*-------------------------------------------------------------------
 ✅ verify_email
----------------------------------------------------------------------*/

const verify_email = tryCatchAsync(async (req, res, next) => {

    const email_verification_token = req.body.email_verification_token


    const decoded_token = jwt.verify(
        email_verification_token,
        process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET
    )

    const user_document = await user_model.findById(decoded_token.id)

    if (!user_document) {
        return next(new AppError('No user exist in the database with the id which is found in the token.', StatusCodes.NOT_FOUND))
    }


    const filter = { _id: decoded_token.id }
    const update = { is_email_confirmed: true }
    const options = { new: true }


    const updated_user = await user_model.findOneAndUpdate(filter, update, options)


    res.json({
        status: "Email is successfully verified",
        updated_user: updated_user

    })

})





/*-------------------------------------------------------------------
 ✅ signin_user
----------------------------------------------------------------------*/


const signin_user = tryCatchAsync(async (req, res, next) => {

    // 🍪 request body
    const { email, password } = req.body;


    // 🍪 check if the user has provided both the email and password
    if (!email || !password) {
        return next(new AppError('Please provide both your email and password', StatusCodes.NOT_FOUND))
    }


    // 🍪 check if user exists 
    const user_document = await user_model.findOne({ email }).select('+password')

    console.log(user_document)

    // 🍪 check if the password is correct
    let correct_password

    if (user_document) {
        correct_password = await compare_passwords(password, user_document.password)

        
    }


    // 🍪 if either user doesn't exist or password doesn't match, send an error message

    if (!user_document || !correct_password) {
        return next(new AppError('Incorrect Email or Password', StatusCodes.UNAUTHORIZED))
    }



    // 🍪 we will send the following object as response
    const user_info = {
        _id: user_document._id,
        full_name: user_document.full_name,
        username: user_document.username,
        email: user_document.email,
        is_email_confirmed: user_document.is_email_confirmed,
        picture_link: user_document.picture_link,
        role: user_document.role
    }


    // 🍪 generate both the access and the refresh tokens
    const access_token = generate_token(user_document._id, 'access')
    const refresh_token = generate_token(user_document._id, 'refresh')


    // 🍪 send a success response with the user data and access, refresh tokens
    res.status(StatusCodes.OK).json({
        status: 'User has been authorized successfully.',
        user_info,
        access_token,
        refresh_token
    })



})




/*-------------------------------------------------------------------
 ✅ send_password_reset_mail
----------------------------------------------------------------------*/

const send_password_reset_mail = tryCatchAsync(async (req, res, next) => {


    // get the email from the request body
    const { email } = req.body

    // find the user document in the database that matches the email
    const user_document = await user_model.findOne({ email })

    // if there is no user document with that email, throw an error and exit the function
    if (!user_document) {

        return next(new AppError('There is no user with that email.', StatusCodes.NOT_FOUND))
    }

    // send a verification email to the user using a helper function
    await send_mail(user_document._id, email, 'forgot password');

    // send a success response to the client with a message
    res.status(StatusCodes.OK).json({
        status: `Email is successfully sent to this address: ${user_document.email}. If you don't find the email on your inbox, please check the spam folder as well.`,

        email: user_document.email
    })

    
 })





/*-------------------------------------------------------------------
 ✅ reset_password
----------------------------------------------------------------------*/


const reset_password = tryCatchAsync(async (req, res, next) => {

    const { password_reset_token, new_password } = req.body


    const decoded_token = jwt.verify(
        password_reset_token,
        process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET
    )


    const user_document = await user_model.findById(decoded_token.id)

    if (!user_document) {
        return next(new AppError('No user exist in the database with the id which is found in the token.', StatusCodes.NOT_FOUND))
    }

    const hashed_new_password = await hash_password(new_password)

    const filter = { _id: decoded_token.id }
    const update = { password: hashed_new_password }
    const options = { new: true }


    const updated_user = await user_model.findOneAndUpdate(filter, update, options)


    res.json({
        status: "Password is successfully reset",
        updated_user: updated_user
    })


})





// @desc obtain new access tokens using the refresh tokens
// @route GET /api/users/refresh
// @access PUBLIC
const getAccessToken = tryCatchAsync(async (req, res) => {
    const refreshToken = req.body.token;
    const email = req.body.email;

    // search if currently loggedin user has the refreshToken sent
    const currentAccessToken = await refresh_token_model.findOne({ email });

    if (!refreshToken || refreshToken !== currentAccessToken.token) {
        res.status(400);
        throw new Error('Refresh token not found, login again');
    }

    // If the refresh token is valid, create a new accessToken and return it.
    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (err, user) => {
            if (!err) {
                const accessToken = generate_token(user.id, 'access');
                return res.json({ success: true, accessToken });
            } else {
                return res.json({
                    success: false,
                    message: 'Invalid refresh token',
                });
            }
        }
    );
});






export {
    signin_user,
    getAccessToken,
    signup_user,
    verify_email,
    send_email_verification_mail,
    send_password_reset_mail,
    reset_password,
}