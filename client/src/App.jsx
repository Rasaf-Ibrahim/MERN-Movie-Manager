// router
import { RouterProvider } from "react-router-dom";
import allRoutes from "@/routes/all-routes";

// react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// useTheme hook
import { useTheme } from "@mui/material";
import NETWORK_STATUS___COMPONENT from "@/components/reusable/for-any-project/network-status/network-status";


/*-------------------------------------------------------------------
 ✅ Functional Component 
----------------------------------------------------------------------*/
export default function App() {

    // useTheme
    const theme = useTheme()

    return (

        <>

            {/*🚀 Router  */}
            <RouterProvider router={allRoutes} />


            <NETWORK_STATUS___COMPONENT />


            {/*🚀 ToastContainer */}
            {theme.palette.mode === 'dark' ?

                <ToastContainer theme='dark' position='bottom-right' autoClose={5000} />

                :

                <ToastContainer position='bottom-right' autoClose={5000} />
            }


        </>


    )

}