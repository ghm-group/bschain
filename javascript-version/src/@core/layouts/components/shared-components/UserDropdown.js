// ** React Imports
import React, { useState, Fragment, useEffect } from 'react'
import Web3 from "web3";
import SupplyChainABI from "../../../../artifacts/SupplyChain.json"

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

function UserDropdown() {

  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, [])

  
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();
  
  
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
  const [OwnerConnected, setOwnerConnected] = useState();
  const [RMSConnected, setRMSConnected] = useState();
  const [MANConnected, setMANConnected] = useState();
  const [DISConnected, setDISConnected] = useState();
  const [RETConnected, setRETConnected] = useState();

  const [VisitorsCount, setVisitorsCount] = useState();

  
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

          const isMANRegistered = await supplychain.methods.manCtr().call() > 0;

          // Check if the current user is an owner
          const isOwner = await supplychain.methods.Owner().call() === account;


          let owner;
          let actor;
          let visitor = 1;
          if (isOwner) {
            owner = "Owner";
            visitor = 0;
          }
          if (isMANRegistered){
            actor ="Manufacturer";
            visitor = 0;
          }
          setVisitorsCount(visitor);
          setOwnerConnected(owner);
          setMANConnected(actor);
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
          const medCtr = await supplychain.methods.medicineCtr().call();
          const med = {};
          const medStage = [];
          for (i = 0; i < medCtr; i++) {
              med[i] = await supplychain.methods.MedicineStock(i + 1).call();
              medStage[i] = await supplychain.methods.showStage(i + 1).call();
          }
          setMED(med);
          setMedStage(medStage);

          //setloader(false);
      }
      else {
          window.alert('The smart contract is not deployed to current network')
      }
  }
  if (loader) {
      return (
          <div>
              {/*<h1 className="wait">Loading...</h1>*/}
          </div>
      )
  
  }


  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 430, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              
                {/** If the connected Person is RM Supplier */
              currentaccount && Object.keys(RMS).map(key => {

                if (currentaccount === RMS[key].addr) {
                  VisitorsCount = setVisitorsCount(0);

                    return (
                        <Typography sx={{ fontWeight: 600 }} key={key}>{RMS[key].name}</Typography>
                    );
                }


                return null;
            })}
            {/** If the connected Person is RM Supplier */
              currentaccount && Object.keys(MAN).map(key => {

                if (currentaccount === MAN[key].addr) {
                  VisitorsCount = setVisitorsCount(0);

                    return (
                        <Typography sx={{ fontWeight: 600 }} key={key}>{MAN[key].name}</Typography>
                    );
                }


                return null;
            })}
            {/** If the connected Person is RM Supplier */
              currentaccount && Object.keys(DIS).map(key => {


                if (currentaccount === DIS[key].addr) {
                  VisitorsCount = setVisitorsCount(0);

                    return (
                        <Typography sx={{ fontWeight: 600 }} key={key}>{DIS[key].name}</Typography>
                    );
                }


                return null;
            })}

            {/** If the connected Person is RM Supplier */
              currentaccount && Object.keys(RET).map(key => {
                
                if (currentaccount === RET[key].addr) {
                  VisitorsCount = setVisitorsCount(0);

                    return (
                        <Typography sx={{ fontWeight: 600 }} key={key}>{RET[key].name}</Typography>
                    );
                }


                return null;
            })}
{MANConnected == "Manufacturer" && (
          <Typography sx={{ fontWeight: 600 }}>Manufacturer</Typography>
      )}
      {OwnerConnected == "Owner" && (
          <Typography sx={{ fontWeight: 600 }}>Owner</Typography>
      )}


      {VisitorsCount == 1 && <Typography sx={{ fontWeight: 600 }}>Visiteur</Typography>}
              
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
              {currentaccount}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <EmailOutline sx={{ marginRight: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <MessageOutline sx={{ marginRight: 2 }} />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ marginRight: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ marginRight: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={() => handleDropdownClose('/pages/login')}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
