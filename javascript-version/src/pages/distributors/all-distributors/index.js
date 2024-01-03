// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import DistributorsTable from 'src/views/tables/DistributorsTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            Distributors Table
          </Link>
        </Typography>
        <Typography variant='body2'>This Table displays all the Distributors in your Private BlockChain</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <DistributorsTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MUITable
