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

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

import Web3 from "web3";
import SupplyChainABI from "../../artifacts/SupplyChain.json"

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

function FormLayoutsDistributorSeparator() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [RMSname, setRMSname] = useState();
  const [MANname, setMANname] = useState();
  const [DISname, setDISname] = useState();
  const [RETname, setRETname] = useState();
  const [RMSplace, setRMSplace] = useState();
  const [MANplace, setMANplace] = useState();
  const [DISplace, setDISplace] = useState();
  const [RETplace, setRETplace] = useState();
  const [RMSaddress, setRMSaddress] = useState();
  const [MANaddress, setMANaddress] = useState();
  const [DISaddress, setDISaddress] = useState();
  const [RETaddress, setRETaddress] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();

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
        const rmsCtr = await supplychain.methods.rmsCtr().call();
        const rms = {};
        for (i = 0; i < rmsCtr; i++) {
            rms[i] = await supplychain.methods.RMS(i + 1).call();
        }
        setRMS(rms);
        const manCtr = await supplychain.methods.manCtr().call();
        const man = {};
        for (i = 0; i < manCtr; i++) {
            man[i] = await supplychain.methods.MAN(i + 1).call();
        }
        setMAN(man);
        const disCtr = await supplychain.methods.disCtr().call();
        const dis = {};
        for (i = 0; i < disCtr; i++) {
            dis[i] = await supplychain.methods.DIS(i + 1).call();
        }
        setDIS(dis);
        const retCtr = await supplychain.methods.retCtr().call();
        const ret = {};
        for (i = 0; i < retCtr; i++) {
            ret[i] = await supplychain.methods.RET(i + 1).call();
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



  const handlerChangeAddressDIS = (event) => {
    setDISaddress(event.target.value);
  }

  const handlerChangePlaceDIS = (event) => {
      setDISplace(event.target.value);
  }
  
  const handlerChangeNameDIS = (event) => {
      setDISname(event.target.value);
  }

  const handlerSubmitDIS = async (event) => {
    event.preventDefault();
    const existingDIS = Object.values(DIS).find(dis => dis.addr === DISaddress);

    if (existingDIS) {
          alert('This DIS already exists');
    }
    else{
    try {
        var reciept = await SupplyChain.methods.addDistributor(DISaddress, DISname, DISplace).send({ from: currentaccount });
        if (reciept) {
            loadBlockchaindata();
        }
    }
    catch (err) {
        alert("An error occured!!!")
    }
    }
  }


  
  return (
    <Card>
      <CardHeader title='Distributor Form' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={handlerSubmitDIS}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Distributor Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField fullWidth type='text' onChange={handlerChangeAddressDIS} label='Etherium Address' placeholder='Enter the Distributor @ETH' required/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='text' onChange={handlerChangeNameDIS} label='Distributor Name' placeholder='Enter the Distributor Name' required/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='text' onChange={handlerChangePlaceDIS} label='Based In' placeholder='Enter the Distributor Location' required/>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onSubmit={handlerSubmitDIS}>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined'>
            Cancel
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default FormLayoutsDistributorSeparator
