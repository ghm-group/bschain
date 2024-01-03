// ** React Imports
import { useState, Fragment, useEffect  } from 'react'
import Web3 from "web3";
import SupplyChainABI from "../../artifacts/SupplyChain.json"

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'



const createData = (name, calories, fat, carbs, protein, price) => {
    
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  }
}







const rows = [

  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5)
]

function TableCollapsible() {
    const [openRows, setOpenRows] = useState([]);

    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])


    // ** State
    const [open, setOpen] = useState(false)
    

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();


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
    const [searchTerm, setSearchTerm] = useState('');
      // Fonction pour gérer le changement de la barre de recherche
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
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

      // Function to toggle the state of a specific row
  const toggleRow = (rowIndex) => {
    const updatedOpenRows = [...openRows];
    updatedOpenRows[rowIndex] = !updatedOpenRows[rowIndex];
    setOpenRows(updatedOpenRows);
  };

  return (
    <TableContainer component={Paper}>
      <Grid container spacing={2} alignItems="flex-end" justifyContent="flex-start">
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ marginTop: '8px' }}  // Ajoutez cette ligne pour ajuster la marge au-dessus
            />
          </Grid>
        </Grid>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell scope="col">Product ID</TableCell>
            <TableCell scope="col">Name</TableCell>
            <TableCell scope="col">Current Processing Stage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(MED).map(function (key) {
            if (MedStage[key] === "Raw Material Supply Stage" &&
                (searchTerm === '' ||
                 MED[key].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 MED[key].description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 MED[key].id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
            ) {
              return (
        
              <Fragment key={MED[key].name} row={MED[key]} >
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell>
                    <IconButton aria-label='expand row' size='small' onClick={() => toggleRow(key)}>
                      {openRows[key] ? <ChevronUp /> : <ChevronDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {MED[key].id}
                  </TableCell>
                  <TableCell>{MED[key].name}</TableCell>
                  <TableCell>{MedStage[key]}</TableCell>
                </TableRow>
                <TableRow >
                  <TableCell colSpan={6} sx={{ py: '0 !important' }}>
                    <Collapse in={openRows[key]} timeout='auto' unmountOnExit>
                      <Box sx={{ m: 2 }}>
                        <Typography variant='h6' gutterBottom component='div'>
                          Description
                        </Typography>

                        <p key={MED[key].name}>
                          {MED[key].description}
                        </p>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>

            )
          }

            return null;

          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableCollapsible
