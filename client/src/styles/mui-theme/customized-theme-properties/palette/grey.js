import {grey } from '@mui/material/colors';


export function theme_palette_grey(darkModeVariable) {

     

    return {

        grey: {

            // static (the default theme has these following properties)
            50: grey[50],
            100: grey[100],
            200: grey[200],
            300: grey[300],
            400: grey[400],
            500: grey[500],
            600: grey[600],
            700: grey[700],
            800: grey[800],
            900: grey[900],




            // dynamic(the default theme doesn't have the following properties)
            dynamic_variant: {

                light: darkModeVariable ? grey[50] : grey[600],
                main: darkModeVariable ? grey[100] : grey[700],
                dark: darkModeVariable ? grey[200] : grey[800],

            }


        }


    }

}