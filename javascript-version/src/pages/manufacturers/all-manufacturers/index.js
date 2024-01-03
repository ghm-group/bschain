// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import ManufacturersTable from 'src/views/tables/ManufacturersTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            Manufacturers Table
          </Link>
        </Typography>
        <Typography variant='body2'>This Table displays all the Manufacturers in your Private BlockChain</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ManufacturersTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MUITable
