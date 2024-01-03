// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import ProductsTable from 'src/views/tables/ProductsTable'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'


// ** Third Party Styles Imports
import FormLayoutsTrackProductSeparator from 'src/views/form-layouts/FormLayoutsTrackProductSeparator'

const FormLayouts = () => {
  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        
        <Grid item xs={12}>
          <FormLayoutsTrackProductSeparator />
          
        </Grid>
        
      </Grid>

 

    </DatePickerWrapper>
  )
}

export default FormLayouts
