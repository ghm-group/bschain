import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'

import ProductsOrderStageTable from '../tables/ProductsOrderStageTable'
import ProductsSupplyStageTable from '../tables/ProductsSupplyingStageTable'
import ProductsManufacturingStageTable from '../tables/ProductsManufacturingStageTable'
import ProductsDistributionStageTable from '../tables/ProductsDistributionStageTable'


import Web3 from "web3";
import SupplyChainABI from "../../artifacts/SupplyChain.json"


function CardBuyProduct() {

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

const handlerChangeID = (event) => {
    setID(event.target.value);
}

const handlerSubmitRMSsupply = async (event) => {
    event.preventDefault();
    try {
        var reciept = await SupplyChain.methods.RMSsupply(ID).send({ from: currentaccount });
        if (reciept) {
            loadBlockchaindata();
        }
    }
    catch (err) {
        alert("An error occured!!!")
    }
}

const handlerSubmitManufacturing = async (event) => {
    event.preventDefault();
    try {
        var reciept = await SupplyChain.methods.Manufacturing(ID).send({ from: currentaccount });
        if (reciept) {
            loadBlockchaindata();
        }
    }
    catch (err) {
        alert("An error occured!!!")
    }
}

const handlerSubmitDistribute = async (event) => {
    event.preventDefault();
    try {
        var reciept = await SupplyChain.methods.Distribute(ID).send({ from: currentaccount });
        if (reciept) {
            loadBlockchaindata();
        }
    }
    catch (err) {
        alert("An error occured!!!")
    }
}

const handlerSubmitRetail = async (event) => {
    event.preventDefault();
    try {
        var reciept = await SupplyChain.methods.Retail(ID).send({ from: currentaccount });
        if (reciept) {
            loadBlockchaindata();
        }
    }
    catch (err) {
        alert("An error occured!!!")
    }
}

const handlerSubmitSold = async (event) => {
    event.preventDefault();
    try {
        var reciept = await SupplyChain.methods.sold(ID).send({ from: currentaccount });
        if (reciept) {
            loadBlockchaindata();
        }
    }
    catch (err) {
        alert("An error occured!!!")
    }
}

  return (

    
    <Grid item xs={12} sm={12} md={12}>



    
              
          {/** If the connected Person is RM Supplier */
              currentaccount && Object.keys(RMS).map(key => {

                  if (currentaccount === RMS[key].addr) {
                      return (
                          <Grid item xs={12} sm={12} md={12} key={key}>



                              <Card>
                                  <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }} >
                                      <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                          Supply Raw Materials
                                      </Typography>
                                      <Divider sx={{ margin: 0 }} />

                                      <form onSubmit={handlerSubmitRMSsupply}>

                                          <CardContent>
                                              <Grid item xs={12} sm={12}>
                                                  <TextField fullWidth type='text' onChange={handlerChangeID} label='Raw Material ID' placeholder='Enter the Raw Material ID' required />
                                              </Grid>

                                          </CardContent>

                                          <Button variant='contained' type='submit' onSubmit={handlerSubmitRMSsupply} sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                                              Supply
                                          </Button>
                                      </form>
                                  </CardContent>

                              </Card>
                              <br />
                              <ProductsOrderStageTable />
                          </Grid>
                      );
                  }


                  return null;
              })}

              {/** If the connected Person is Manufacturer */
              currentaccount && Object.keys(MAN).map(key => {
                
                if (currentaccount === MAN[key].addr) {
                    return (
                        <Grid item xs={12} sm={12} md={12} key={key}>



                        <Card>
                        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
                            <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                Manufacture the product
                            </Typography>
                            <Divider sx={{ margin: 0 }} />

                            <form onSubmit={handlerSubmitManufacturing}>

                                <CardContent>
                                    <Grid item xs={12} sm={12}>
                                        <TextField fullWidth type='text' onChange={handlerChangeID} label='Manufacturer ID' placeholder='Enter the Manufacturer ID' required />
                                    </Grid>

                                </CardContent>

                                <Button variant='contained' type='submit' onSubmit={handlerSubmitManufacturing} sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                                    Manufacture
                                </Button>
                            </form>
                        </CardContent>
                        
    </Card>
    <br />
        <ProductsSupplyStageTable />
        </Grid>
                    );
                }


                return null;
            })}

            {/** If the connected Person is Distributor */
              currentaccount && Object.keys(DIS).map(key => {
                
                if (currentaccount === DIS[key].addr) {
                    
                    return (
                        <Grid item xs={12} sm={12} md={12} key={key}>



                        <Card>
                        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }} >
                            <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                Distribute the product
                            </Typography>
                            <Divider sx={{ margin: 0 }} />

                            <form onSubmit={handlerSubmitDistribute}>

                                <CardContent>
                                    <Grid item xs={12} sm={12}>
                                        <TextField fullWidth type='text' onChange={handlerChangeID} label='Distributor ID' placeholder='Enter the Distributor ID' required />
                                    </Grid>

                                </CardContent>

                                <Button variant='contained' type='submit' onSubmit={handlerSubmitDistribute} sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                                    Distribute
                                </Button>
                            </form>
                        </CardContent>
                        
    </Card>
    <br />
        <ProductsManufacturingStageTable />
        </Grid>
                    );
                }


                return null;
            })}

            {/** If the connected Person is Retailer */
              currentaccount && Object.keys(RET).map(key => {
                
                if (currentaccount === RET[key].addr) {
                    return (
                        <Grid item xs={12} sm={12} md={12} key={key}>



                        <Card>
                        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
                            <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                Retail the product
                            </Typography>
                            <Divider sx={{ margin: 0 }} />

                            <form onSubmit={handlerSubmitRetail}>

                                <CardContent>
                                    <Grid item xs={12} sm={12}>
                                        <TextField fullWidth type='text' onChange={handlerChangeID} label='Retailer ID' placeholder='Enter the Retailer ID' required />
                                    </Grid>

                                </CardContent>

                                <Button variant='contained' type='submit' onSubmit={handlerSubmitRetail} sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                                    Retail
                                </Button>
                            </form>
                        </CardContent>
                        
                    </Card>
                    <br />
                    <ProductsDistributionStageTable />
                    </Grid>
                    );
                }


                return null;
            })}





    </Grid>
    
  )
}

export default CardBuyProduct
