# SupplyChain Logistics Traceability Solution based on Blockchain Technology

## 1. Introduction
The project, "Traçabilité Logistique basée sur la Technologie Blockchain," aims to revolutionize supply chain management using 
blockchain technology. The solution provides real-time tracking of products, materials, and goods throughout the supply chain, 
offering unparalleled transparency, enhanced data security, and true traceability for all stakeholders.
## 2. The project Architecture 

![schema](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/69330046-0fcb-4fff-b2e3-5becbfab5524)

1. Owner Registration of Users:

The owner of the supply chain platform registers participants such as suppliers, manufacturers, logistics providers, and clients. Each participant is assigned a unique identifier and provided with authentication credentials.

2. Product Creation by Owner:

The owner, who has administrative privileges, creates a new product entry in the system. This involves specifying details such as product name, description, and any initial information relevant to the supply chain.

3. Participant Registration of Product Information:

As the product moves through different stages of the supply chain, each participant registers relevant information about the product when it reaches their custody. This information may include:
Supplier: Records initial information, such as manufacturing date and origin.
Manufacturer: Adds details on production and quality control.
Distributor: Updates information on shipping, transportation, and delivery schedules.
Retailer: Records product arrival and storage details.

4. Smart Contract Recording and Validation:

At each stage, the participant registers this information on the blockchain using the smart contract. The smart contract ensures the integrity of the data, making it tamper-proof and traceable.

5. User Access and Permissions:

Participants log in to the system with their credentials. The smart contract manages permissions, allowing each participant to perform actions based on their role in the supply chain.

6. Tracking Product by ID:

The final user, which can be a client or any participant with the appropriate permissions, can enter the product's unique identifier (ID) into the system.

7. Traceability Information Retrieval:

The system retrieves and displays the complete traceability information for the entered product ID. This includes all the recorded data from each stage of the supply chain.

8. Real-time Monitoring and Alerts:

The system continuously monitors the supply chain data in real-time. Alerts are triggered for any anomalies or irregularities in the data, providing timely notifications to relevant participants.

9. Enhanced Transparency for Clients:

Clients benefit from enhanced transparency, as they can track the origin and journey of their purchased products. This information builds trust in the authenticity and quality of the products.

## 3. Overall Architecture

![architecturefinal](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/976ff37b-b6c2-4981-99fa-86879fbeefc1)

The smart contract is written in Solidity, which is then compiled, migrated, and deployed using Truffle.js on the local blockchain network created with Ganache-cli. 
The frontend utilizes Web3.js to communicate with the smart contract and the local blockchain network, and is written using the React.js framework for better management 
of component lifecycle and states. User requests are transmitted to the frontend through Nginx (load balancer) and Express.js for dynamic routing.


## 4. Technologies and tools 
### Programming Languages:

Solidity: for smart contract implementation on the Ethereum blockchain.
JavaScript: for frontend development.
Python: for various tasks including data management and backend application development.
Technologies:
### Blockchain: Ethereum for implementing the distributed ledger technology.
Web 3.0: Emerging technologies for interoperability between blockchain and web applications.
Cryptography: for securing transactions and stored data.
### Development Tools:
Truffle: Framework for Ethereum development.
Remix: Online development environment for Ethereum.
Ganache: Local Ethereum blockchain for development and testing.
Metamask: Browser extension for interacting with Ethereum applications.
Visual Studio Code (VS Code): Popular code editor with Ethereum development extensions.
### Database:
IPFS (InterPlanetary File System): for decentralized and distributed file storage.

## 5. Guide Line 
### Installation and Setup :
* VSCODE : VSCode can be downloaded from https://code.visualstudio.com/
* Node.js : Download the latest version of Node.js from https://nodejs.org/ and after installation check Version using terimal: node -v .
* Git : Download the latest version of Git from the official website at https://git-scm.com/downloads and check Version using terimal: git --version.
* Ganache : Download the latest version of Ganache from the official website at https://www.trufflesuite.com/ganache.
* MetaMask : can be installed as a browser extension from the Chrome Web Store or Firefox Add-ons store.

### Create,Compile & Deploy Smart Contract :
* Install truffle : Type the following command and press Enter: ``` npm install -g truffle```
* Install dependencies : Type the following command and press Enter: ```npm i```
File structure for DApp :
* contracts: This folder contains the Solidity smart contracts for the DApp. The Migrations.sol contract is automatically created by Truffle and is used for managing migrations.
* migrations: This folder contains the JavaScript migration files used to deploy the smart contracts to the blockchain network.
* test: This folder contains the JavaScript test files used to test the smart contracts.
* truffle-config.js: This file contains the configuration for the Truffle project, including the blockchain network to be used and any necessary settings.
* package.json: This file contains information about the dependencies and scripts used in the project.
* package-lock.json: This file is generated automatically and contains the exact version of each dependency used in the project.

Compile the smart contract : In the terminal, use the following command to compile the smart contract: ``` truffle compile ```

<div align="center">

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/44e5f2a2-41d2-4ddf-8c69-4df125244ba6)

</div>

The RPC server is used to allow applications to communicate with the Ethereum blockchain and execute smart contract transactions, query the state of the blockchain, and interact with the Ethereum network.
Now to add Rcp address in our truffle-config.js and the replace host address and port address with Our Ganache Rcp.

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/be939360-88ca-4100-9a42-1b7f79030151)

After Changing RCP address.Open terminal and run this cmd : ``` truffle migrate ```
This Command Will deploye Smart Contract to Blockchain.
### Run The Application :
Open a second terminal and enter the root folder

```cd client```
Install all packages in the package.json file

```npm i```
Install Web3 in the package.json file

```npm install -save web3```
Run this Command :

```npm```
Run the app

```npm start```
The app gets hosted by default at port 3000.

### Connect with metamask:

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/cc70c90c-c2ea-4634-8a14-7e04ddcd7c4a)

Start Ganache: Start the Ganache application and make note of the RPC server URL and port number.
Connect MetaMask: Open MetaMask in your browser and click on the network dropdown in the top-right corner.

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/d87342f7-7e6a-4a8c-95f9-4e91d1675104)

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/8c2f559c-7d7e-438d-9d9e-0f9bea83814e)

Import an account: In Ganache, click on the "Accounts" tab and select the first account listed. Click on the "Copy" 

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/9b7e39df-02e9-4b00-bd8b-cc66bc639147)

In MetaMask, click on the three dots in the top-right corner, select "Import Account", and paste the private key into the private key field. Click "Import".

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/153216815/b64c7738-816c-43b7-b093-e03068e3d2fa)

Add All participate(Raw Material,Supplier,Manufacture,Retail). by following above Step

### To Run the containerized application : 
After clonning the project, get to javascript-version and run the following commands :
(make sure you have ganache and metamask in your system )

```npm install```

```truffle compile```

```truffle migrate```

Then run the following command t containerize the app after openning your docker desktop App:

```docker compose up -d```

check the containers :

![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/105124542/7ca363ee-f142-498f-b510-6b0cc77335f8)

click on 3000:3000 to test the application, the creation of roles and users is valid as the one in local application.

## 6. Interfaces 
* Dashboard:
  
![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/105124542/c07a794d-3821-46a8-8535-1420a6c6a661)

* Tracking a Product:
  
![image](https://github.com/ghm-group/Tracabilit-logistique-basee-sur-la-technologie-Blockchain/assets/105124542/d2fdc307-c347-4379-bd95-7fc8d1e2d99a)

## 7. Conclusion 
The "Traçabilité Logistique basée sur la Technologie Blockchain" project aims to transform supply chain management, ensuring transparency, security, and traceability. By leveraging blockchain technology, the solution offers a robust and reliable platform for logistics stakeholders.

## Collaborators

- **LAYOUNE Ghita** - [GitHub Profile](https://github.com/Bam04bi)
- **HANIM Hanae** - [GitHub Profile](https://github.com/hhanae)
- **YOUSFI Meryem** - [GitHub Profile](https://github.com/MeryemYOUSFI)



