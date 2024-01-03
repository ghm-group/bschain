import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import Web3 from "web3";
import SupplyChainABI from "../../artifacts/SupplyChain.json"

const WeeklyOverview = () => {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, [])

  // ** Hook
  const theme = useTheme()
  

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();

  const [RMSCount, setRMSCount] = useState();
  const [MANCount, setMANCount] = useState();
  const [DISCount, setDISCount] = useState();
  const [RETCount, setRETCount] = useState();


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
          setRMSCount(rmsCtr);
          setRMS(rms);
          const manCtr = await supplychain.methods.manCtr().call();
          const man = {};
          for (i = 0; i < manCtr; i++) {
              man[i] = await supplychain.methods.MAN(i + 1).call();
          }
          setMANCount(manCtr);
          setMAN(man);
          const disCtr = await supplychain.methods.disCtr().call();
          const dis = {};
          for (i = 0; i < disCtr; i++) {
              dis[i] = await supplychain.methods.DIS(i + 1).call();
          }
          setDISCount(disCtr);
          setDIS(dis);
          const retCtr = await supplychain.methods.retCtr().call();
          const ret = {};
          for (i = 0; i < retCtr; i++) {
              ret[i] = await supplychain.methods.RET(i + 1).call();
          }
          setRETCount(retCtr);
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

  const values = [RMSCount, MANCount, DISCount, RETCount];
  const names = ['RM Suppliers', 'Manufacturers', 'Distributor', 'Retailer'];

  // Utilisez Math.max pour obtenir la plus grande valeur parmi les variables
  const maxValue = Math.max(...values);

  // Trouvez l'index de la plus grande valeur
  const indexOfMaxValue = values.indexOf(maxValue);

  // Obtenez le nom correspondant à la plus grande valeur
  const nameOfMaxValue = names[indexOfMaxValue];

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.primary.main,
      theme.palette.background.default,
      theme.palette.background.default
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['RM Suppliers', 'Manufacturers', 'Distributor', 'Retailer'],
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -8,
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}`
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Members Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <ReactApexcharts type='bar' height={205} options={options} series={[{ data: [RMSCount, MANCount, DISCount, RETCount] }]} />
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          
          <Typography variant='body2'>This Represents the number of the Big Actors of your Supply Chain added by the Owner.</Typography>
        </Box>
        <Button fullWidth variant='contained' onClick={() => {
            window.location.href = '/members';
          }}>
             Members Table
        
        </Button>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
