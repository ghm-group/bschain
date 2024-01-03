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

// ** Third Party Imports
import { usePopper } from 'react-popper'

import Web3 from "web3";
import SupplyChainABI from "../../artifacts/SupplyChain.json"
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
  const [open, setOpen] = useState(false)
  const [popperElement, setPopperElement] = useState(null)
  const [referenceElement, setReferenceElement] = useState(null)
  const [supplyTimestamps, setSupplyTimestamps] = useState({});
  const [manufacturingTimestamps, setManufacturingTimestamps] = useState({});
  const [distributeTimestamps, setDistributeTimestamps] = useState({});
  const [retailTimestamps, setRetailTimestamps] = useState({});

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: 'top-end'
  })

  const handleOpen = () => {
    setOpen(true)
    update ? update() : null
  }

  const handleClose = () => {
    setOpen(false)
  }

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
            const timestampsRMS = {};
            const timestampsMAN = {};
            const timestampsDIS = {};
            const timestampsRET = {};
            for (let i = 1; i <= medCtr; i++) {
                timestampsRMS[i] = await supplychain.methods.supplyTimestamps(i).call();
                timestampsMAN[i] = await supplychain.methods.manufacturingTimestamps(i).call();
                timestampsDIS[i] = await supplychain.methods.distributeTimestamps(i).call();
                timestampsRET[i] = await supplychain.methods.retailTimestamps(i).call();
            }
            setSupplyTimestamps(timestampsRMS);
            setManufacturingTimestamps(timestampsMAN);
            setDistributeTimestamps(timestampsDIS);
            setRetailTimestamps(timestampsRET);


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
                <CardHeader title='Products Sold' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Divider sx={{ margin: 0 }} />
                    <br />
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                        Product Tracked : {MED[ID].id}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Name :  {MED[ID].name}<br />
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
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Supply Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {RMS[MED[ID].RMSid].name}</p>
                                        <p><b>Place: </b><br />{RMS[MED[ID].RMSid].place}</p>
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {RMS[MED[ID].RMSid].addr}
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
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Manufactur Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {MAN[MED[ID].MANid].name}</p>
                                        <p><b>Place: </b><br />{MAN[MED[ID].MANid].place}</p>
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {MAN[MED[ID].MANid].addr}
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
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Distribution Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {DIS[MED[ID].DISid].name}</p>
                                        <p><b>Place: </b><br />{DIS[MED[ID].DISid].place}</p>
                                        <p><b>Distribution Date:</b><br /> {new Date(distributeTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {DIS[MED[ID].DISid].addr}
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
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'warning.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Retailer Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {RET[MED[ID].RETid].name}</p>
                                        <p><b>Place: </b><br />{RET[MED[ID].RETid].place}</p>
                                        <p><b>Retail Date:</b><br /> {new Date(retailTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {RET[MED[ID].RETid].addr}
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
                <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        variant='contained'
        sx={{
          backgroundColor: '#ff3e1d',
          boxShadow: '0 1px 20px 1px #ff3e1d',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
        onClick={() => {
            window.location.href = '/products/track-product';
          }}
        
      >
        Track Another Product
      </Button>
      
    </Box>
                
            </Card>

        )
    }
    if (TrackTillRetail) {
        return (
            <Card >
                <CardHeader title='Products in Retail Stage' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Divider sx={{ margin: 0 }} />
                    <br />
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                        Product Tracked : {MED[ID].id}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Name :  {MED[ID].name}<br />
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
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Supply Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {RMS[MED[ID].RMSid].name}</p>
                                        <p><b>Place: </b><br />{RMS[MED[ID].RMSid].place}</p>
                                        <p><b>Supply Date:</b><br /> {new Date(supplyTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {RMS[MED[ID].RMSid].addr}
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Manufactur Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {MAN[MED[ID].MANid].name}</p>
                                        <p><b>Place: </b><br />{MAN[MED[ID].MANid].place}</p>
                                        <p><b>Manufacturing Date:</b><br /> {new Date(manufacturingTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {MAN[MED[ID].MANid].addr}
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Distribution Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {DIS[MED[ID].DISid].name}</p>
                                        <p><b>Place: </b><br />{DIS[MED[ID].DISid].place}</p>
                                        <p><b>Distribution Date:</b><br /> {new Date(distributeTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {DIS[MED[ID].DISid].addr}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'warning.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Retailer Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {RET[MED[ID].RETid].name}</p>
                                        <p><b>Place: </b><br />{RET[MED[ID].RETid].place}</p>
                                        <p><b>Retail Date:</b><br /> {new Date(retailTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {RET[MED[ID].RETid].addr} 
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


                <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        variant='contained'
        sx={{
          backgroundColor: '#ff3e1d',
          boxShadow: '0 1px 20px 1px #ff3e1d',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
        onClick={() => {
            window.location.href = '/products/track-product';
          }}

      >
        Track Another Product
      </Button>
      
    </Box>
            </Card>
        )
    }
    if (TrackTillDistribution) {
        return (
            <Card >
                <CardHeader title='Products in Distribution Stage' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Divider sx={{ margin: 0 }} />
                    <br />
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                        Product Tracked : {MED[ID].id}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Name :  {MED[ID].name}<br />
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
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Supply Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {RMS[MED[ID].RMSid].name}</p>
                                        <p><b>Place: </b><br />{RMS[MED[ID].RMSid].place}</p>
                                        <p><b>Supply Date:</b><br /> {new Date(supplyTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {RMS[MED[ID].RMSid].addr}
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Manufactur Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {MAN[MED[ID].MANid].name}</p>
                                        <p><b>Place: </b><br />{MAN[MED[ID].MANid].place}</p>
                                        <p><b>Manufacturing Date:</b><br /> {new Date(manufacturingTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {MAN[MED[ID].MANid].addr}
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
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
                                        <p><b>Name:</b><br /> {DIS[MED[ID].DISid].name}</p>
                                        <p><b>Place: </b><br />{DIS[MED[ID].DISid].place}</p>
                                        <p><b>Distribution Date:</b><br /> {new Date(distributeTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {DIS[MED[ID].DISid].addr}
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
                <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        variant='contained'
        sx={{
          backgroundColor: '#ff3e1d',
          boxShadow: '0 1px 20px 1px #ff3e1d',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
        onClick={() => {
            window.location.href = '/products/track-product';
          }}
      >
        Track Another Product
      </Button>
      
    </Box>
            </Card>


        )
    }
    if (TrackTillManufacture) {
        return (
            <Card >
                <CardHeader title='Products in Manufacturing Stage' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Divider sx={{ margin: 0 }} />
                    <br />
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                        Product Tracked : {MED[ID].id}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Name :  {MED[ID].name}<br />
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
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Supply Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {RMS[MED[ID].RMSid].name}</p>
                                        <p><b>Place: </b><br />{RMS[MED[ID].RMSid].place}</p>
                                        <p><b>Supply Date:</b><br /> {new Date(supplyTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {RMS[MED[ID].RMSid].addr}
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.5 }}>
                                                <Icon path={mdiAccountArrowRight} size={2} />

                                            </Box>

                                        </Box>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'success.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Manufactur Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {MAN[MED[ID].MANid].name}</p>
                                        <p><b>Place: </b><br />{MAN[MED[ID].MANid].place}</p>
                                        <p><b>Manufacturing Date:</b><br /> {new Date(manufacturingTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {MAN[MED[ID].MANid].addr}                                            
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
                <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        variant='contained'
        sx={{
          backgroundColor: '#ff3e1d',
          boxShadow: '0 1px 20px 1px #ff3e1d',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
        onClick={() => {
            window.location.href = '/products/track-product';
          }}
      >
        Track Another Product
      </Button>
      
    </Box>
            </Card>
        )
    }
    if (TrackTillRMS) {
        return (
            <Card >
                <CardHeader title='Products Tracking' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Divider sx={{ margin: 0 }} />
                    <br />
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                        Product Tracked : {MED[ID].id}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Name :  {MED[ID].name}<br />
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
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
                                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                                    <Typography
                                        variant='h6'
                                        sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
                                    >
                                        Supply Stage
                                    </Typography>
                                    <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.white' }}>
                                        <p><b>Name:</b><br /> {RMS[MED[ID].RMSid].name}</p>
                                        <p><b>Place: </b><br />{RMS[MED[ID].RMSid].place}</p>
                                        <p><b>Supply Date:</b><br /> {new Date(supplyTimestamps[MED[ID].id] * 1000).toLocaleString()}</p>

                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                            <Avatar alt='Mary Vaughn' src='/images/avatars/4.png' sx={{ width: 34, height: 34, marginRight: 2.75 }} />
                                            <Typography variant='body2' sx={{ color: 'common.white' }}>
                                            {RMS[MED[ID].RMSid].addr}
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
                <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        variant='contained'
        sx={{
          backgroundColor: '#ff3e1d',
          boxShadow: '0 1px 20px 1px #ff3e1d',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
        onClick={() => {
            window.location.href = '/products/track-product';
          }}
      >
        Track Another Product
      </Button>
      
    </Box>
            </Card>
        )
    }
    if (TrackTillOrdered) {
        return (
            <Card >
                <CardHeader title='Products Tracking' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                    <Divider sx={{ margin: 0 }} />
                    <br />
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                        Product Tracked : {MED[ID].id}
                                    </Typography>
                                    <Typography variant='body2'>
                                        Name :  {MED[ID].name}<br />
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
                <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        variant='contained'
        sx={{
          backgroundColor: '#ff3e1d',
          boxShadow: '0 1px 20px 1px #ff3e1d',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
        onClick={() => {
            window.location.href = '/products/track-product';
          }}
      >
        Track Another Product
      </Button>
      
    </Box>
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
