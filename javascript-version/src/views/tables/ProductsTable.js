// ** React Imports
import { useState , useEffect  } from 'react'
import Web3 from "web3";
import SupplyChainABI from "../../artifacts/SupplyChain.json"

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import StatisticsProduct from 'src/views/dashboard/StatisticsProduct'; // Adjust the import path accordingly


function ProductsTable() {
  
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)


    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedName, setMedName] = useState();
    const [MedDes, setMedDes] = useState();
    const [MedStage, setMedStage] = useState();
    const [medicineTimestamps, setMedicineTimestamps] = useState({});

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
            const timestamps = {};
            for (i = 0; i < medCtr; i++) {
                med[i] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i] = await supplychain.methods.showStage(i + 1).call();
                timestamps[i] = parseInt(await supplychain.methods.medicineTimestamps(i + 1).call(), 10);
            }
            setMED(med);
            setMedStage(medStage);
            setMedicineTimestamps(timestamps);

             // Update the numberOfProducts state
            
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

    const handlerChangeNameMED = (event) => {
        setMedName(event.target.value);
    }

    const handlerChangeDesMED = (event) => {
        setMedDes(event.target.value);
    }

    const handlerSubmitMED = async (event) => {
        event.preventDefault();
        try {
            var reciept = await SupplyChain.methods.addMedicine(MedName, MedDes).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        }
        catch (err) {
            alert("An error occured!!!")
        }
    }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ margin: 2 }}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell scope="col">ID</TableCell>
              <TableCell scope="col">Name</TableCell>
              <TableCell scope="col">Description</TableCell>
              <TableCell scope="col">Current Stage</TableCell>
              <TableCell scope="col">Transactions Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(MED)
              .filter((key) =>
                Object.values(MED[key])
                  .some((value) =>
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                  ) ||
                MedStage[key].toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(function (key) {
                return (
                  <TableRow key={key}>
                    <TableCell>{MED[key].id}</TableCell>
                    <TableCell>{MED[key].name}</TableCell>
                    <TableCell>{MED[key].description}</TableCell>
                    <TableCell>{MedStage[key]}</TableCell>
<TableCell>{new Date(medicineTimestamps[key] * 1000).toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={Object.keys(MED).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
     
    </Paper>
  );
}

export default ProductsTable;