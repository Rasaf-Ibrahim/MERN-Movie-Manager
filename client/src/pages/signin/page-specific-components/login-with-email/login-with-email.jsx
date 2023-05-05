// hook
import useFormManagement from "@/utils/global-hooks/use-form-management.js";
import { useLogger } from "react-use";


// api hook
import { useSigninUser } from "@/api/auth/signin-user";


// styled components
import { styled } from '@mui/material/styles';
import ROUTER_LINK___STYLED from '@/styles/styled-components/router-link/router-link';

// components
import { Box, Button, Typography } from "@mui/material";

import MUI_INPUT___COMPONENT from "@/components/reusable/for-any-project/form/mui-form-useImmer/mui-input";
import MUI_PASSWORD___COMPONENT from "@/components/reusable/for-any-project/form/mui-form-useImmer/mui-password";







/*-------------------------------------------------------------------
 ✅ Functional Component 
----------------------------------------------------------------------*/
export default function LOGIN_WITH_EMAIL___COMPONENT() {



    // 🍪 form state management (1/3 Steps) - form_configuration 🍪
    const form_configuration = {

        /* 🍔  email  🍔 */
        email: {

            value: '',

            is_required: true,

            validation: {

                is_validating: true,

                match_pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/,

                error_message: "Provide a valid Email."
            }

        },




        /* 🍔 password  🍔 */
        password: {

            value: '',

            is_required: true,

            validation: {

                is_validating: true,

                match_pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,

                error_message: "Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long."
            }

        },



    }


    // 🍪 form state management (2/2 Steps) - useFormManagement 🍪
    const {
        formState,
        updateFormState,
        actions,
        validation_info,
        validation_before_form_submission_func

    } = useFormManagement(form_configuration)



    useLogger('formState', formState)


    // 🍪 hook related to API request 🍪
    const { mutate, status, data, error } = useSigninUser()


    // 🍪 form state management (3/3 Steps) - handleSubmit 🍪
    const handleSubmit = async (event) => {

        // 🍔🍔 stop refreshing the page on reload 🍔🍔
        event.preventDefault();



        console.log('hi2')

        /* 🍔🍔 if 'validation_before_form_submission_func' function returns true, that means there is at least one validation error in the form and we can not submit the form 🍔🍔 */
        if (validation_before_form_submission_func() === true) return



        console.log('hi')

        /* 🍔🍔 submit the form's all the inputted data 🍔🍔 */
        console.log('😃 submitting data', {
            ...formState.form_data
        })


        // 🍔🍔 API request  🍔🍔
        const formData = new FormData();

        formData.append('email', formState.form_data.email.value)
        formData.append('password', formState.form_data.password.value)

        await mutate(formData);



        /* 🍔🍔 form is submitted successfully  🍔🍔*/

        // actions.reset_form()

    }


    /*-------------------------------------------------------------------
        ✅ JSX 
    ----------------------------------------------------------------------*/
    return (

        <WRAPPER_OF_FORM_CONTENT___STYLED>


            {/* 🍔🍔 Email 🍔🍔 */}
            <MUI_INPUT___COMPONENT

                label='Email'

                input_name='email'

                state={formState}

                actions={actions}

                validation_info={validation_info}

                // optional
                multiline={false}
                variant_value='outlined' //standard, filled, outlined

            />

            {/* 🍔🍔 Password 🍔🍔 */}
            <MUI_PASSWORD___COMPONENT

                label='Password'

                input_name='password'

                state={formState}

                actions={actions}

                validation_info={validation_info}


                // optional
                variant_value='outlined'  //standard, filled, outlined
            />



            <FORGOT_PASSWORD___SECTION />


            <Button
                type="button"
                onClick={handleSubmit}
                disabled={status && status === 'loading'}
                variant="contained">
                Sign in
            </Button>


        </WRAPPER_OF_FORM_CONTENT___STYLED>

    )


}




/*-------------------------------------------------------------------
 ✅ Sections of <LOGIN_WITH_EMAIL___COMPONENT/>
----------------------------------------------------------------------*/

/* 🍔 */
const FORGOT_PASSWORD___SECTION = () => {

    return (


        <Typography sx={(theme) => ({
            color: theme.palette.primary.main,
            ":hover": {
                color: theme.palette.primary.dark
            },
            width: '100%',
            textAlign: 'left'
        })}
            variant='body2'>

            <ROUTER_LINK___STYLED to='/send-password-reset-mail'>
                Forgot Password
            </ROUTER_LINK___STYLED>
        </Typography>



    )

}





/*-------------------------------------------------------------------
 ✅ Styled Components for <LOGIN_WITH_EMAIL___COMPONENT/>
----------------------------------------------------------------------*/

const WRAPPER_OF_FORM_CONTENT___STYLED = styled((props) =>

    <Box  {...props} component='form' />
)

    (({ theme }) => `

    display:flex;
    flex-direction:column;
    align-items: center;
    gap:1rem;

`)