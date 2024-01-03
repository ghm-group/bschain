// ** React Imports
import { forwardRef, useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import CardMedia from '@mui/material/CardMedia'
import Avatar from '@mui/material/Avatar'


// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import Heart from 'mdi-material-ui/Heart'
import Twitter from 'mdi-material-ui/Twitter'
import ShareVariant from 'mdi-material-ui/ShareVariant'
import Icon from '@mdi/react';
import { mdiAccountArrowRight } from '@mdi/js';

import Web3 from "web3";
import SupplyChainABI from "../../artifacts/SupplyChain.json"
import ProductsTrackTable from '../tables/ProductsTrackTable'
import CardTwitter from '../cards/CardTwitter'
import CardWithCollapse from '../cards/CardWithCollapse'

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

function FormLayoutsProductSeparator() {
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();
    const [RMS, setRMS] = useState();
    const [MAN, setMAN] = useState();
    const [DIS, setDIS] = useState();
    const [RET, setRET] = useState();
    const [TrackTillSold, showTrackTillSold] = useState(false);
    const [TrackTillRetail, showTrackTillRetail] = useState(false);
    const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
    const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
    const [TrackTillRMS, showTrackTillRMS] = useState(false);
    const [TrackTillOrdered, showTrackTillOrdered] = useState(false);
    const [collapse, setCollapse] = useState(false)

    const handleClick = () => {
        setCollapse(!collapse)
      }

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    };
    
    const loadBlockchaindata = async () => {
        setloader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setCurrentaccount(account);
        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];
        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            var i;
            const medCtr = await supplychain.methods.medicineCtr().call();
            const med = {};
            const medStage = [];
            for (i = 0; i < medCtr; i++) {
                med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (i = 0; i < rmsCtr; i++) {
                rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i + 1] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (i = 0; i < disCtr; i++) {
                dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (i = 0; i < retCtr; i++) {
                ret[i + 1] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }

    if (loader) {
        return (
            <div>
                <h1 className="wait">Loading...</h1>
            </div>
        )
    }
    if (TrackTillSold) {
        return (
            <Card >
            <CardHeader title='Products in Retail Stage' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
            <Divider sx={{ margin: 0 }} />
            <br/>
            <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12}>
            <Card>
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Product Tracked : {MED[ID].id}
        </Typography>
        <Typography variant='body2'>
          Name :  {MED[ID].name}<br/>
          Current Stage : {MedStage[ID]}
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleClick}>Description</Button>
          <IconButton size='small' onClick={handleClick}>
            {collapse ? <ChevronUp sx={{ fontSize: '1.875rem' }} /> : <ChevronDown sx={{ fontSize: '1.875rem' }} />}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={collapse}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2'>
          {MED[ID].description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>

      </Grid>
      <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Supply Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Supplier Adress: </b><br/> {RMS[MED[ID].RMSid].addr}</p>
                        <p><b>Name:</b><br/> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b><br/>{RMS[MED[ID].RMSid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {RMS[MED[ID].RMSid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Manufactur Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Manufacturer Adress: </b>{MAN[MED[ID].MANid].addr}</p>
                        <p><b>Name:</b><br/> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b><br/>{MAN[MED[ID].MANid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {MAN[MED[ID].MANid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Distribution Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Distributer Adress: </b>{DIS[MED[ID].DISid].addr}</p>
                        <p><b>Name:</b><br/> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b><br/>{DIS[MED[ID].DISid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {DIS[MED[ID].DISid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'warning.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Retailer Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Retailer Adress: </b>{RET[MED[ID].RETid].addr}</p>
                        <p><b>Name:</b><br/> {RET[MED[ID].RETid].name}</p>
                        <p><b>Place: </b><br/>{RET[MED[ID].RETid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {RET[MED[ID].RETid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'warning.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Sold 
        </Typography>
        
      </CardContent>
    </Card>
            </Grid>
        
            </Grid>
            
            </CardContent>
            
            <div className="container-xl">
                <article className="col-4">
                    <h3><b><u>Product:</u></b></h3>
                    <span><b>Product ID: </b>{MED[ID].id}</span>
                    <br />
                    <span><b>Name:</b> {MED[ID].name}</span>
                    <br />
                    <span><b>Description: </b>{MED[ID].description}</span>
                    <br />
                    <span><b>Current stage: </b>{MedStage[ID]}</span>
                </article>
                <hr />
                <br />
                <section className="row">

                    <article className="col-3">
                        <h4><u>Raw Materials Supplied by:</u></h4>
                        <p><b>Supplier ID: </b>{RMS[MED[ID].RMSid].id}</p>
                        <p><b>Name:</b> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b>{RMS[MED[ID].RMSid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Manufactured by:</u></h4>
                        <p><b>Manufacturer ID: </b>{MAN[MED[ID].MANid].id}</p>
                        <p><b>Name:</b> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b>{MAN[MED[ID].MANid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Distributed by:</u></h4>
                        <p><b>Distributor ID: </b>{DIS[MED[ID].DISid].id}</p>
                        <p><b>Name:</b> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b>{DIS[MED[ID].DISid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Retailed by:</u></h4>
                        <p><b>Retailer ID: </b>{RET[MED[ID].RETid].id}</p>
                        <p><b>Name:</b> {RET[MED[ID].RETid].name}</p>
                        <p><b>Place: </b>{RET[MED[ID].RETid].place}</p>
                    </article>
                    <span>&#10132;</span>
                    <article className="col-3">
                        <h4><u>Sold</u></h4>
                    </article>
                </section>
                <button onClick={() => {
                    showTrackTillSold(false);
                }} className="btn btn-outline-success btn-sm">Track Another Item</button>
                <span onClick={() => {
                    history.push('/')
                }} className="btn btn-outline-danger btn-sm"> HOME</span>
            </div >
            </Card>

        )
    }
    if (TrackTillRetail) {
        return (
            <Card >
            <CardHeader title='Products in Retail Stage' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
            <Divider sx={{ margin: 0 }} />
            <br/>
            <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12}>
            <Card>
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Product Tracked : {MED[ID].id}
        </Typography>
        <Typography variant='body2'>
          Name :  {MED[ID].name}<br/>
          Current Stage : {MedStage[ID]}
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleClick}>Description</Button>
          <IconButton size='small' onClick={handleClick}>
            {collapse ? <ChevronUp sx={{ fontSize: '1.875rem' }} /> : <ChevronDown sx={{ fontSize: '1.875rem' }} />}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={collapse}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2'>
          {MED[ID].description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>

      </Grid>
      <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Supply Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Supplier Adress: </b><br/> {RMS[MED[ID].RMSid].addr}</p>
                        <p><b>Name:</b><br/> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b><br/>{RMS[MED[ID].RMSid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {RMS[MED[ID].RMSid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Manufactur Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Manufacturer Adress: </b>{MAN[MED[ID].MANid].addr}</p>
                        <p><b>Name:</b><br/> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b><br/>{MAN[MED[ID].MANid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {MAN[MED[ID].MANid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Distribution Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Distributer Adress: </b>{DIS[MED[ID].DISid].addr}</p>
                        <p><b>Name:</b><br/> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b><br/>{DIS[MED[ID].DISid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {DIS[MED[ID].DISid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'warning.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Retailer Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Retailer Adress: </b>{RET[MED[ID].RETid].addr}</p>
                        <p><b>Name:</b><br/> {RET[MED[ID].RETid].name}</p>
                        <p><b>Place: </b><br/>{RET[MED[ID].RETid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {RET[MED[ID].RETid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
        
            </Grid>
            
            </CardContent>
            
            
            
            </Card>
        )
    }
    if (TrackTillDistribution) {
        return (
            <Card >
            <CardHeader title='Products in Distribution Stage' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
            <Divider sx={{ margin: 0 }} />
            <br/>
            <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12}>
            <Card>
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Product Tracked : {MED[ID].id}
        </Typography>
        <Typography variant='body2'>
          Name :  {MED[ID].name}<br/>
          Current Stage : {MedStage[ID]}
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleClick}>Description</Button>
          <IconButton size='small' onClick={handleClick}>
            {collapse ? <ChevronUp sx={{ fontSize: '1.875rem' }} /> : <ChevronDown sx={{ fontSize: '1.875rem' }} />}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={collapse}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2'>
          {MED[ID].description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>

      </Grid>
      <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Supply Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Supplier Adress: </b><br/> {RMS[MED[ID].RMSid].addr}</p>
                        <p><b>Name:</b><br/> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b><br/>{RMS[MED[ID].RMSid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {RMS[MED[ID].RMSid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Manufactur Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Manufacturer Adress: </b>{MAN[MED[ID].MANid].addr}</p>
                        <p><b>Name:</b><br/> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b><br/>{MAN[MED[ID].MANid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {MAN[MED[ID].MANid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Distribution Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Distributer Adress: </b>{DIS[MED[ID].DISid].addr}</p>
                        <p><b>Name:</b><br/> {DIS[MED[ID].DISid].name}</p>
                        <p><b>Place: </b><br/>{DIS[MED[ID].DISid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {DIS[MED[ID].DISid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
        
            </Grid>
            
            </CardContent>
            
            </Card>

            
        )
    }
    if (TrackTillManufacture) {
        return (
            <Card >
            <CardHeader title='Products in Manufacturing Stage' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
            <Divider sx={{ margin: 0 }} />
            <br/>
            <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12}>
            <Card>
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Product Tracked : {MED[ID].id}
        </Typography>
        <Typography variant='body2'>
          Name :  {MED[ID].name}<br/>
          Current Stage : {MedStage[ID]}
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleClick}>Description</Button>
          <IconButton size='small' onClick={handleClick}>
            {collapse ? <ChevronUp sx={{ fontSize: '1.875rem' }} /> : <ChevronDown sx={{ fontSize: '1.875rem' }} />}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={collapse}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2'>
          {MED[ID].description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>

      </Grid>
      <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Supply Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Supplier Adress: </b>{RMS[MED[ID].RMSid].addr}</p>
                        <p><b>Name:</b><br/> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b><br/>{RMS[MED[ID].RMSid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {RMS[MED[ID].RMSid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
            <Icon path={mdiAccountArrowRight} size={2} />

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Manufactur Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Manufacturer Adress: </b><br/> {MAN[MED[ID].MANid].addr}</p>
                        <p><b>Name:</b><br/> {MAN[MED[ID].MANid].name}</p>
                        <p><b>Place: </b><br/>{MAN[MED[ID].MANid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {MAN[MED[ID].MANid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
        
            </Grid>
            
            </CardContent>
            </Card>
        )
    }
    if (TrackTillRMS) {
        return (
            <Card >
            <CardHeader title='Products Tracking' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
            <Divider sx={{ margin: 0 }} />
            <br/>
            <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12}>
            <Card>
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Product Tracked : {MED[ID].id}
        </Typography>
        <Typography variant='body2'>
          Name :  {MED[ID].name}<br/>
          Current Stage : {MedStage[ID]}
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleClick}>Description</Button>
          <IconButton size='small' onClick={handleClick}>
            {collapse ? <ChevronUp sx={{ fontSize: '1.875rem' }} /> : <ChevronDown sx={{ fontSize: '1.875rem' }} />}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={collapse}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2'>
          {MED[ID].description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>

      </Grid>
            <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          Supply Stage
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
        <p><b>Supplier Adress: </b><br/> {RMS[MED[ID].RMSid].addr}</p>
                        <p><b>Name:</b><br/> {RMS[MED[ID].RMSid].name}</p>
                        <p><b>Place: </b><br/>{RMS[MED[ID].RMSid].place}</p>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
            <Typography variant='body2' sx={{ color: 'common.white' }}>
            {RMS[MED[ID].RMSid].id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>

            </Box>
            
          </Box>
        </Box>
      </CardContent>
    </Card>
            </Grid>
            </Grid>
            
            </CardContent>
            </Card>
        )
    }
    if (TrackTillOrdered) {
        return (
            <Card >
            <CardHeader title='Products Tracking' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
            <Divider sx={{ margin: 0 }} />
            <br/>
            <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={12}>
            <Card>
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Product Tracked : {MED[ID].id}
        </Typography>
        <Typography variant='body2'>
          Name :  {MED[ID].name}<br/>
          Current Stage : {MedStage[ID]}
        </Typography>
      </CardContent>
      <CardHeader title='Product Not Yet Processed...' titleTypographyProps={{ variant: 'h6' }} />
      <CardActions className='card-action-dense'>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleClick}>Description</Button>
          <IconButton size='small' onClick={handleClick}>
            {collapse ? <ChevronUp sx={{ fontSize: '1.875rem' }} /> : <ChevronDown sx={{ fontSize: '1.875rem' }} />}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={collapse}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2'>
          {MED[ID].description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>

      </Grid>
           
      </Grid>
            
            </CardContent>
            </Card>
        )
    }

    const handlerChangeID = (event) => {
        setID(event.target.value);
    }
    
    const handlerSubmit = async (event) => {
        event.preventDefault();
        var ctr = await SupplyChain.methods.medicineCtr().call();
        if (!((ID > 0) && (ID <= ctr)))
            alert("Invalid Medicine ID!!!");
        else {
            // eslint-disable-next-line
            if (MED[ID].stage == 5)
                showTrackTillSold(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 4)
                showTrackTillRetail(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 3)
                showTrackTillDistribution(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 2)
                showTrackTillManufacture(true);
            // eslint-disable-next-line
            else if (MED[ID].stage == 1)
                showTrackTillRMS(true);
            else
                showTrackTillOrdered(true);

        }
    }

    return (
        <Card>
            <CardHeader title='Products Tracking' titleTypographyProps={{ variant: 'h6' }} />
            <Divider sx={{ margin: 0 }} />
            <form onSubmit={handlerSubmit}>
                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                Enter the Product ID to track it 
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField fullWidth type='text' label='Product ID' onChange={handlerChangeID} placeholder='Enter the Product Label' required />
                        </Grid>
                        
                        <CardActions>
                            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onSubmit={handlerSubmit}>
                                Track
                            </Button>
                        </CardActions>

                    </Grid>
                    
                </CardContent>

        </form>
        </Card>
    )
}

export default FormLayoutsProductSeparator
