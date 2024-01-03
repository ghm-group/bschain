// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'


// ** Demo Components Imports
import CardBuyProduct from 'src/views/cards/CardBuyProduct'
import ProductsStagesTable from 'src/views/tables/ProductsStagesTable'

const CardBasic = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
          Logistics Supply Chain Flow
          </Link>
        </Typography>
        <Typography variant='body2'>You can buy or display the Products details and stages in your Private BlockChain</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <CardBuyProduct />
      </Grid>
      
    </Grid>
  )
}

export default CardBasic
