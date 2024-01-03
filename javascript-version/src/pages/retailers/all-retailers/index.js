// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import RetailersTable from 'src/views/tables/RetailersTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            Retailers Table
          </Link>
        </Typography>
        <Typography variant='body2'>This Table displays all the Retailers in your Private BlockChain</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <RetailersTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MUITable
