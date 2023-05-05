// hook
import { useState } from "react";

// PropTypes
import { PropTypes } from "prop-types";

// utils
import functions_for_no_library_form from '../../../../../utils/form/functions-for-form-made-with-use-reducer';


// components
import { Box, FormControlLabel, Checkbox, FormControl, FormHelperText, Typography } from '@mui/material'
import { useUpdateEffect } from 'react-use';



/*-------------------------------------------------------------------
 ✅ Functional Component 
----------------------------------------------------------------------*/
export default function MUI_CHECKBOX___COMPONENT(props) {


    // props
    const {
        label,
        input_name,
        reducer_state,
        dispatch,
        validation_info_obj,

        // optional
        icon_obj,
        checkbox_size_in_rem,
        label_placement,
        color
    } = props



    /* 🍪 form_empty_field_func 🍪 */
    const { form_empty_field_func } = functions_for_no_library_form




    /* 🍪 state to trigger validation  🍪 */
    const [state_trigger_validation_check, set_state_trigger_validation_check] = useState(false)



    // 🍪 handle input change 🍪
    const handle_change_func = (event) => {


        /* 🍔 Updating state 🍔 */

        if (event.target.checked) {

            dispatch({
                type: 'reducer_action___update_input_value',
                input_name: input_name,
                value: true
            })
        }

        else {

            dispatch({
                type: 'reducer_action___update_input_value',
                input_name: input_name,
                value: false
            })
        }


        /* 🍔 Triggering validation check on input change 🍔 */

        set_state_trigger_validation_check(!state_trigger_validation_check)

    }



    // 🍪 validation function 🍪
    const validation_func = async () => {

        /* 🍔 required field Validation 🍔 */
        //  only proceed to required field validation if this field is a required field.
        if (validation_info_obj[input_name].is_required) {


            if (form_empty_field_func(reducer_state.form_data[input_name])) {

                dispatch({
                    type: 'reducer_action___required_field_error',
                    input_name: [input_name],
                })
            }

            else {

                dispatch({
                    type: 'reducer_action___no_required_field_error',
                    input_name: [input_name],
                })

            }



        }

    }



    // 🍪 executing validation function 🍪
    useUpdateEffect(() => {

        validation_func()

    }, [state_trigger_validation_check])







    /*-------------------------------------------------------------------
     ✅ JSX
    ----------------------------------------------------------------------*/
    return (

        <Box>

            <FormControl>


                <FormControlLabel

                    label={label}
                    labelPlacement={label_placement}

                    control={

                        <Checkbox
                            checked={reducer_state.form_data[input_name]}
                            onChange={handle_change_func}

                            color={color}

                            {...(icon_obj?.is_using_icon ? { icon: icon_obj.icon } : {})}

                            {...(icon_obj?.is_using_icon ? { checkedIcon: icon_obj.checked_icon } : {})}

                            sx={{
                                '& .MuiSvgIcon-root': {
                                    fontSize: `${checkbox_size_in_rem}`,
                                }
                            }}
                        />

                    }
                />






                <FormHelperText sx={{ color: 'error.main', m: 0 }} >

                    {reducer_state.required_field_error[input_name] === true &&

                        <Typography variant='body1'>
                            You must not skip this field.
                        </Typography>
                    }

                </FormHelperText>


            </FormControl>


        </Box>
    )
}




/*-------------------------------------------------------------------
 ✅ defaultProps of <MUI_CHECKBOX___COMPONENT/>
----------------------------------------------------------------------*/
MUI_CHECKBOX___COMPONENT.defaultProps = {

    label_placement: 'end',

    checkbox_size_in_rem: '1.5rem',

    icon_obj: {
        is_using_icon: false,
        // icon: <BookmarkBorderRoundedIcon />,
        // checked_icon: <BookmarkRoundedIcon />,
    },

    color: 'primary'

}


