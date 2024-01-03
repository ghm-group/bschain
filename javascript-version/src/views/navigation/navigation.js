// ** React Imports
import { useState, useEffect } from 'react';

// ** Icon imports
import Login from 'mdi-material-ui/Login';
import Table from 'mdi-material-ui/Table';
import CubeOutline from 'mdi-material-ui/CubeOutline';
import HomeOutline from 'mdi-material-ui/HomeOutline';
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase';
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline';
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline';
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline';
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline';
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended';

import Web3 from 'web3';
import SupplyChainABI from '../../artifacts/SupplyChain.json';

function Navigation() {
    const [navItems, setNavItems] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await loadWeb3();
            await loadBlockchaindata();
        };

        fetchData();
    }, []);

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
        setLoader(true);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        const networkId = await web3.eth.net.getId();
        const networkData = SupplyChainABI.networks[networkId];

        if (networkData) {
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);

            // Check if RM, MAN, DIST, or RET are registered
            const isRMRegistered = await supplychain.methods.rmsCtr().call() > 0;
            const isMANRegistered = await supplychain.methods.manCtr().call() > 0;
            const isDISTRegistered = await supplychain.methods.disCtr().call() > 0;
            const isRETRegistered = await supplychain.methods.retCtr().call() > 0;

            // Check if the current user is an owner
            const isOwner = await supplychain.methods.Owner().call() === account;

            // Use these values as needed in your application
            console.log("Is RM Registered:", isRMRegistered);
            console.log("Is MAN Registered:", isMANRegistered);
            console.log("Is DIST Registered:", isDISTRegistered);
            console.log("Is RET Registered:", isRETRegistered);
            console.log("Is Owner:", isOwner);

            // Define your navigation items based on the fetched data
            let newNavItems;

            // Choose the appropriate navigation constant based on user's role
            if (isRMRegistered || isMANRegistered || isDISTRegistered || isRETRegistered) {
                newNavItems = supplyChainUserNav;
            }
            if (isOwner) {
                newNavItems = ownerNav;
            }

            setNavItems(newNavItems);
            setLoader(false);
        } else {
            window.alert('The smart contract is not deployed to the current network');
        }
    };

    // Separate constants for different navigation scenarios
    const supplyChainUserNav = [
        {
            title: 'Dashboard',
            icon: HomeOutline,
            path: '/'
          },
          {
            sectionTitle: 'Products Section'
          },
          {
            icon: CubeOutline,
            title: 'Buy Product',
            path: '/products/buy-product'
          },
          {
            title: 'All Products Stages',
            icon: Table,
            path: '/products/products-stages'
          },
          {
            sectionTitle: 'Tracking'
          },
          {
            icon: CubeOutline,
            title: 'Track the Product',
            path: '/products/track-product'
          }
    ];

    const ownerNav = [
        {
            title: 'Dashboard',
            icon: HomeOutline,
            path: '/'
          },
          {
            sectionTitle: 'RM Suppliers Management'
          },
          {
            icon: CubeOutline,
            title: 'New RM Supplier',
            path: '/suppliers/add-supplier'
          },
          {
            icon: Table,
            title: 'All RM Suppliers',
            path: '/suppliers/all-suppliers'
          },
          {
            sectionTitle: 'Manufacturers Management'
          },
          {
            icon: CubeOutline,
            title: 'New Manufacturer',
            path: '/manufacturers/add-manufacturer'
          },
          {
            title: 'All Manufacturers',
            icon: Table,
            path: '/manufacturers/all-manufacturers'
          },
          {
            sectionTitle: 'Distributors Management'
          },
          {
            icon: CubeOutline,
            title: 'New Distributor',
            path: '/distributors/add-distributor'
          },
          {
            title: 'All Distributors',
            icon: Table,
            path: '/distributors/all-distributors'
          },
          {
            sectionTitle: 'Retailers Management'
          },
          {
            icon: CubeOutline,
            title: 'New Retailer',
            path: '/retailers/add-retailer'
          },
          {
            title: 'All Retailers',
            icon: Table,
            path: '/retailers/all-retailers'
          },
          {
            sectionTitle: 'Product Order'
          },
          {
            icon: CubeOutline,
            title: 'New Order',
            path: '/products/add-product'
          },
          {
            title: 'All Products',
            icon: Table,
            path: '/products/all-products'
          },
          {
            sectionTitle: 'Supply Chain Flow'
          },
          {
            title: 'All Products Stages',
            icon: Table,
            path: '/products/products-stages'
          },
          {
            sectionTitle: 'Tracking'
          },
          {
            icon: CubeOutline,
            title: 'Track the Product',
            path: '/products/track-product'
          }
    ];

    const defaultNav = [
        {
            title: 'Dashboard',
            icon: HomeOutline,
            path: '/'
        },
        {
          sectionTitle: 'Tracking'
        },
        {
          icon: CubeOutline,
          title: 'Track the Product',
          path: '/products/track-product'
        }
    ];

    return navItems;
}

export default Navigation;