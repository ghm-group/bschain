// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import ProductsStagesTable from 'src/views/tables/ProductsStagesTable'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
          Supply Chain Flow
          </Link>
        </Typography>
        <Typography variant='body2'>This Table displays all the Products details and stages in your Private BlockChain</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ProductsStagesTable />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MUITable
