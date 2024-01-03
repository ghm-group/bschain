import React, { useState, useEffect } from 'react'
import Web3 from "web3";
import SupplyChainABI from "../artifacts/SupplyChain.json"

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import StatisticsProduct from 'src/views/dashboard/StatisticsProduct'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview1'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import DistributorsTable from 'src/views/tables/DistributorsTable';
import ManufacturersTable from 'src/views/tables/ManufacturersTable';
import RetailersTable from 'src/views/tables/RetailersTable';

function Dashboard() {
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
}, [])
  const [numberOfProducts, setNumberOfProducts] = useState(0); // Initialize with an appropriate value
  const [numberOfDistributors, setNumberOfDistributors] = useState(0);
  const [numberOfManufacturers, setNumberOfManufacturers] = useState(0);
  const [numberOfSuppliers, setNumberOfSuppliers] = useState(0); // Add this line
  const [numberOfRetailers, setNumberOfRetailers] = useState(0); // Ajoutez cette ligne
  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();
  const [DIS, setDIS] = useState(); // Initialize DIS state
  const [MAN, setMAN] = useState();
  const [rows, setRows] = useState([]); 



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
              med[i] = await supplychain.methods.MedicineStock(i + 1).call();
              medStage[i] = await supplychain.methods.showStage(i + 1).call();
          }
          setMED(med);
          setMedStage(medStage);

           // Update the numberOfProducts state
          setNumberOfProducts(Object.keys(med).length);

          // Update the DIS state
          const disCtr = await supplychain.methods.disCtr().call();
          const dis = {};
          for (i = 0; i < disCtr; i++) {
            dis[i] = await supplychain.methods.DIS(i + 1).call();
          }
          setDIS(dis);
          setNumberOfDistributors(Object.keys(dis).length);
          const manCtr = await supplychain.methods.manCtr().call();
          const man = {};
          for (i = 0; i < manCtr; i++) {
              man[i] = await supplychain.methods.MAN(i + 1).call();
          }
          setMAN(man);
          
          // Update the numberOfDistributors state
          setNumberOfManufacturers(Object.keys(man).length);
          const rmsCtr = await supplychain.methods.rmsCtr().call();
          console.log("Number of RMS:", rmsCtr);
          
          // Set the number of suppliers state
          setNumberOfSuppliers(rmsCtr);
          const rms = [];
          for (let i = 0; i < rmsCtr; i++) {
            const rmsData = await supplychain.methods.RMS(i + 1).call();
            console.log("RMS Data:", rmsData);
            rms.push(rmsData);
          }
          console.log("All RMS Data:", rms);

          setRows(rms);
          const retCtr = await supplychain.methods.retCtr().call();
          console.log("Number of Retailers:", retCtr);
          setNumberOfRetailers(retCtr);
      
          const retailers = [];
          for (let i = 0; i < retCtr; i++) {
            const retData = await supplychain.methods.RET(i + 1).call();
            console.log("Retailer Data:", retData);
            retailers.push(retData);
          }
          console.log("All Retailers Data:", retailers);
      
      setRows(retailers);
          setloader(false);
      }
      else {
          window.alert('The smart contract is not deployed to current network')
      }
  };
  if (loader) {
      return (
          <div>
              <h1 className="wait">Loading...</h1>
          </div>
      )

  };

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Trophy  numberOfProducts={numberOfProducts} />
        </Grid>
        {/* Pass the numberOfProducts to the StatisticsCard component */}
        <Grid item xs={12} md={8}>
          {/* Change from StatisticsProduct to StatisticsCard */}
          <StatisticsProduct numberOfDistributors={numberOfDistributors} numberOfManufacturers={numberOfManufacturers}  numberOfSuppliers={numberOfSuppliers} numberOfRetailers={numberOfRetailers}/>
        </Grid>
        <Grid item xs={12} md={6} lg={12}>
          <WeeklyOverview />
        </Grid>
        
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
