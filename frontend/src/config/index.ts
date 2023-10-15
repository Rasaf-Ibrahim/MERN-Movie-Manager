const env = {
    backend_base_url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`,
    
    runtime_environment: `${process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT}`,

    rte_image_management_api_endpoint: `${process.env.NEXT_PUBLIC_RTE_IMAGE_MANAGEMENT_API_ENDPOINT}`,  
}


const about_the_site = {
    name: 'Movie Manager'
}


const page_path = {


    // 🍪 public pages
    home_before_login: '/',

    home_after_login: '/movie',

    privacy_policy: '/privacy-policy',

    terms_of_service: '/terms-of-service',

    cookie_use: '/cookie-use',


    // 🍪 authentication related
    sign_up: '/sign-up',

    sign_in: '/sign-in',

    verify_email: '/verify-email',

    reset_password: '/reset-password',

    sign_out_confirmation: '/sign-out-confirmation',

    delete_account_confirmation: 'delete-account-confirmation',

    profile: '/profile',

    settings: '/settings',


    // 🍪 movie manager related
    movie: '/movie',

    series: '/series',
    
    bookmark: '/bookmark'
}



const config_obj = {

    env: env,

    about_the_site: about_the_site,

    page_path: page_path
}

export default config_obj