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

function FormLayoutsManufacturerSeparator() {
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


  const handlerChangeAddressRMS = (event) => {
      setRMSaddress(event.target.value);
  };

  const handlerChangePlaceRMS = (event) => {
      setRMSplace(event.target.value);
  };

  const handlerChangeNameRMS = (event) => {
      setRMSname(event.target.value);
  };

  const handlerChangeAddressMAN = (event) => {
      setMANaddress(event.target.value);
  };

  const handlerChangePlaceMAN = (event) => {
    setMANplace(event.target.value);
  };

  const handlerChangeNameMAN = (event) => {
      setMANname(event.target.value);
  };

 

  const handlerSubmitMAN = async (event) => {
    event.preventDefault();
    const existingMAN = Object.values(MAN).find(man => man.addr === MANaddress);

    if (existingMAN) {
          alert('This MAN already exists');
    }
    else{
    try {
        var reciept = await SupplyChain.methods.addManufacturer(MANaddress, MANname, MANplace).send({ from: currentaccount });
        if (reciept) {
            // Construct a data object from the form input
            const formData = {
              id: MAN.id,  // Replace MAN.id with the actual id you want to use
              name: MANname,
              place: MANplace,
              addr: MANaddress,
            };

            // Pass the form data to the parent component
            onDataSubmit(formData);

            // Reload blockchain data (if needed)
            loadBlockchaindata();
        }
    }
    catch (err) {
        alert("An error occurred!!!")
    }
    }
  };

  const handleFormData = (formData) => {
    // You can do something with the form data, like updating state or passing it to another component
    // For example, update state with the new form data
    setMAN((prevMAN) => ({ ...prevMAN, [formData.id]: formData }));
  };



  
  return (
    <Card>
      <CardHeader title='Manufacturer Form' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={handlerSubmitMAN}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Manufacturer Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField fullWidth type='text' onChange={handlerChangeAddressMAN} label='Etherium Address' placeholder='Enter the Manufacturer @ETH' required/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='text' onChange={handlerChangeNameMAN} label='Manufacturer Name' placeholder='Enter the Manufacturer Name' required/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='text' onChange={handlerChangePlaceMAN} label='Based In' placeholder='Enter the Manufacturer Location' required/>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onSubmit={handlerSubmitMAN}>
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

export default FormLayoutsManufacturerSeparator
