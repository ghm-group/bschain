// ** React Imports
import { useState, useEffect } from 'react';
import Web3 from 'web3'; // Import Web3

// ** MUI Imports
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import SupplyChainABI from "../../artifacts/SupplyChain.json"

const columns = [
  {
    id: 'id',
    label: 'ID',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString('en-US'),
  },
  {
    id: 'name',
    label: 'Name',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString('en-US'),
  },
  {
    id: 'place',
    label: 'Place',
    minWidth: 170,
    align: 'left',
    format: value => value.toFixed(2),
  },
  {
    id: 'addr',
    label: 'Ethereum Address',
    minWidth: 170,
    align: 'left',
    format: value => value.toFixed(2),
  },
];

function SuppliersTable() {
  // ** States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]); // Added rows state
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [numberOfSuppliers, setNumberOfSuppliers] = useState(0); // Ajoutez cette ligne
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
    try {
      setloader(true);
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      setCurrentaccount(account);
      const networkId = await web3.eth.net.getId();
      const networkData = SupplyChainABI.networks[networkId];

      const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
      setSupplyChain(supplychain);

      const rmsCtr = await supplychain.methods.rmsCtr().call();
      console.log("Number of RMS:", rmsCtr);

      const rms = [];
      for (let i = 0; i < rmsCtr; i++) {
        const rmsData = await supplychain.methods.RMS(i + 1).call();
        console.log("RMS Data:", rmsData);
        rms.push(rmsData);
      }
      console.log("All RMS Data:", rms);
      
       // Mettez à jour le nombre de fournisseurs
       setNumberOfSuppliers(rmsCtr);

      setRows(rms);
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }
  };


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
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {rows
              .filter((row) =>
                Object.values(row).some((value) =>
                  value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align}>
                    {column.format && typeof row[column.id] === 'number' ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default SuppliersTable;
