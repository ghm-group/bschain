// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import MembersTable from 'src/views/tables/MembersTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
     
      <Grid item xs={12}>
        <Card>
          <CardHeader title='All Members Table' titleTypographyProps={{ variant: 'h6' }} />
          <MembersTable />
        </Card>
      </Grid>
      
    </Grid>
  )
}

export default MUITable
