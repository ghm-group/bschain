// ** React Imports
import { useState, useEffect  } from 'react'
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

function DistributorsTable() {
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [numberOfDistributors, setNumberOfDistributors] = useState(0); // Initialize with an appropriate value
  const [numberOfSuppliers, setNumberOfSuppliers] = useState(0); // Initialize with an appropriate value
  const [numberOfManufacturers, setNumberOfManufacturers] = useState(0); // Initialize with an appropriate value
  const [numberOfRetailers, setNumberOfRetailers] = useState(0); // Initialize with an appropriate value
 

  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, [])
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [DIS, setDIS] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [RET, setRET] = useState();

  // ** Additional State for Search
const [searchTerm, setSearchTerm] = useState('');

const [combinedData, setCombinedData] = useState({ dis: {}, rms: {}, man: {}, ret: {} });

// Function to handle search term change
const handleSearchTermChange = (event) => {
  setSearchTerm(event.target.value);
  setPage(0); // Reset page when the search term changes
};

 // Check if DIS is an object and convert to array before filtering
 const filteredRows = combinedData && typeof combinedData === 'object'
    ? Object.values(combinedData.dis).concat(Object.values(combinedData.rms)).concat(Object.values(combinedData.man)).concat(Object.values(combinedData.ret)).filter(
        (row) =>
            String(row.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.addr.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

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
          const disCtr = await supplychain.methods.disCtr().call();
          const dis = {};
          for (i = 0; i < disCtr; i++) {
              dis[i] = await supplychain.methods.DIS(i + 1).call();
          }
          setDIS(dis);
          
          var j;
          const rmsCtr = await supplychain.methods.rmsCtr().call();
          const rms = {};
          for (j = 0; j < rmsCtr; j++) {
              rms[j] = await supplychain.methods.RMS(j + 1).call();
          }
          setRMS(rms);

          var w;
          const manCtr = await supplychain.methods.manCtr().call();
          const man = {};
          for (w = 0; w < manCtr; w++) {
              man[w] = await supplychain.methods.MAN(w + 1).call();
          }
          setMAN(man);

          var k;
          const retCtr = await supplychain.methods.retCtr().call();
          const ret = {};
          for (k = 0; k < retCtr; k++) {
              ret[k] = await supplychain.methods.RET(k + 1).call();
          }
          setRET(ret);

          // Mise à jour de l'état avec les données combinées de DIS et RMS
          setCombinedData({ dis, rms, man, ret });

          // Mise à jour du nombre total de distributeurs et de fournisseurs
          setNumberOfDistributors(Object.keys(dis).length);
          setNumberOfSuppliers(Object.keys(rms).length);
          setNumberOfManufacturers(Object.keys(man).length);
          setNumberOfRetailers(Object.keys(ret).length);


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
        id='search'
        label='Search'
        variant='outlined'
        value={searchTerm}
        onChange={handleSearchTermChange}
        sx={{ margin: 2 }}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow >
              <TableCell scope="col" sx={{ minWidth: 250}}>Name</TableCell>
              <TableCell scope="col" sx={{ minWidth: 250}}>Place</TableCell>
              <TableCell scope="col">Ethereum Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.place}</TableCell>
                  <TableCell>{row.addr}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        
        count={combinedData <= 10 ? Object.keys(combinedData).length : 1}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default DistributorsTable
