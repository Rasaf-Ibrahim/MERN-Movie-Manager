/*__________________________________________

 ✅ import 
____________________________________________*/

// types
import { type_of_obj_with_any_values } from '@/types/commonly-used-types'

// react query
import { useMutation } from '@tanstack/react-query';

// axios instance
import { axios_auth_instance } from "../_axios-auth-instance";

// zustand store
import { auth_store_actions } from '@/store/auth-store';

// react-toastify
import { toast } from "react-toastify";



/*__________________________________________

 ✅ types 
____________________________________________*/

export type type_of_user_input_of_send_email_verification_mail_hook = void



/*__________________________________________

 ✅ hook 
____________________________________________*/
export function useSendEmailVerificationMail() {

    return useMutation<unknown, unknown, type_of_user_input_of_send_email_verification_mail_hook, unknown>(

        (user_input) => {

            return axios_auth_instance.patch('/email/send-email-verification-mail', user_input)
        },

        {
            onSuccess: (data) => {

                // update the store
                auth_store_actions.update_user_info()
            },

            onError: (error: type_of_obj_with_any_values) => {

                // show error toast
                const error_message = error.response.data.message

                toast.error(error_message, {
                    toastId: 'error_message'
                })
            },
        }

    )
}

