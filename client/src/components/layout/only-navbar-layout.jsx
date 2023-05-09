// styled-components
import {styled} from '@mui/material/styles'


// component
import { Box } from '@mui/material'
import NAVBAR_SIDEBAR___COMPONENT from './navbar-sidebar/navbar-sidebar'


/*-------------------------------------------------------------------
 ✅ Functional Component 
----------------------------------------------------------------------*/
export default function ONLY_NAVBAR_LAYOUT___COMPONENT({
     children,
     navbar_margin_bottom, 
     footer_margin_top  
 }) {


  return (

    <>
      {/* the following css styles and layout structure is essential for keeping the footer at the bottom of the page even when the page size is small.  (https://stackoverflow.com/a/67846892/14120900) */}


      <WRAPPER_OF_JSX___SECTION>

        <Box> {/* wrapper_without_footer */}

          <NAVBAR_SIDEBAR___COMPONENT />

          <Box sx={{ 
             marginTop: navbar_margin_bottom,
             marginBottom: footer_margin_top 
           }}>

            {children}

          </Box>

        </Box>  {/* End: wrapper_without_footer */}


      </WRAPPER_OF_JSX___SECTION>


    </>

  )

}




/*-------------------------------------------------------------------
 ✅ Section of <MAIN_LAYOUT___COMPONENT/>
----------------------------------------------------------------------*/


/* 🍔 */
const WRAPPER_OF_JSX___SECTION = styled((props) =>

    <Box  {...props} />
)

(({ theme }) => `

    min-height: 100vh;
    display: flex; 
    flex-direction: column; 
    justify-content: space-between;
`)
