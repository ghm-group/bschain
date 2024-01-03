// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import SuppliersTable from 'src/views/tables/SuppliersTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
     
      <Grid item xs={12}>
        <Card>
          <CardHeader title='RM Suppliers Table' titleTypographyProps={{ variant: 'h6' }} />
          <SuppliersTable />
        </Card>
      </Grid>
      
    </Grid>
  )
}

export default MUITable
