import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./artifacts/build-info/RigdonhouseFundRaiserDAO.json";


function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isDAOManager, setIsDAOManager] = useState(false);
  const [isDAOOwner, setIsDAOOwner] = useState(false);
  const [inputValue, setInputValue] = useState({proposalAmount: "", proposalApproval: "", proposalFinal: "", contribution: "", mascotName: "" });
  const [DAOMinimumContribution, setDAOMinimumContribution] = useState(null);
  const [DAOTotalBalance, setDAOTotalBalance] = useState(null);
  const [DAOManagerAddress, setDAOManagerAddress] = useState(null);
  const [DAOOwnerAddress, setDAOOwnerAddress] = useState(null);
  const [DAOApproversCount, setDAOApproversCount] = useState(null);
  const [ProjectProposalNumber, setProjectProposalNumber] = useState(null);
  const [ProjectDescription, setProjectDescription] = useState(null);
  const [ProjectFundingAmount, setProjectFundingAmount] = useState(null);
  const [ProjectFundingRecipient, setProjectFundingRecipient] = useState(null);
  const [ProjectApprovalCount, setProjectApprovalCount] = useState(null);
  const [ProjectComplete, setProjectComplete] = useState(null);
  const [currentMascotName, setcurrentMascotName] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = '0x8a25c5D0c8ab0E29B37590EC05A19B8cc4e63CeB';
  const contractABI = abi.abi;
  const BigNumber = require('bignumber.js');

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our DAO.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getMascotName = async () => {
    try {
      if (window.ethereum) {

        console.log("getMascotName");

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        let mascotName = await DAOContract.DAOMascot();
        mascotName = utils.parseBytes32String(mascotName);
        setcurrentMascotName(mascotName.toString());
        console.log("TheMascotName", mascotName.toString());

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setMascotNameHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await DAOContract.setDAOMascot(utils.formatBytes32String(inputValue.mascotName));
        console.log("Setting Mascot Name...");
        await txn.wait();
        console.log("Mascot Name Changed", txn.hash);
        getMascotName();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const processDAOOwnerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        const owner = await DAOContract.owner();
        setDAOOwnerAddress(owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsDAOOwner(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const processDAOManagerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        const manager = await DAOContract.manager();
        setDAOManagerAddress(manager);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (manager.toLowerCase() === account.toLowerCase()) {
          setIsDAOManager(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const processDAOBalanceHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        let balance = await DAOContract.getDAOBalance();
        setDAOTotalBalance(utils.formatEther(balance));
        console.log("Retrieved balance...", balance);

        let contribution = await DAOContract.minimumContribution();
        setDAOMinimumContribution(utils.formatEther(contribution));
        console.log("Retrieved contribution...", contribution);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const processDAOApproversHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await DAOContract.approversCount();

        setDAOApproversCount(utils.stripZeros(count));
        console.log("Retrieved countC...", count);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const processDAOProposalsHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        let proposalNum = await DAOContract.proposalNumber();
        console.log("ProposalNum", proposalNum);

        let proposals = await DAOContract.proposals(proposalNum);
        console.log("Proposals", proposals);

        setProjectProposalNumber(utils.stripZeros(proposals.number));
        setProjectDescription(proposals.description);
        setProjectFundingAmount(utils.formatEther(proposals.fundAmount));
        setProjectFundingRecipient(proposals.recipient);
        setProjectApprovalCount(utils.stripZeros(proposals.approvalCount));        
        setProjectComplete((proposals.complete).toString());

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  const contributionMoneyHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        //write data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await DAOContract.contributeFunds({ value: ethers.utils.parseEther(inputValue.contribution) });
        console.log("Sending money...");
        await txn.wait();
        console.log("Sending money...done", txn.hash);

        processDAOBalanceHandler();
        processDAOApproversHandler();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const newProposalHandler = async (event) => {
    try {
      event.preventDefault();

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        let description = "A Cool New Project";
        let amount = ethers.utils.parseEther(inputValue.proposalAmount);
        let recipientaddress = DAOOwnerAddress;        
        const txn = await DAOContract.createProjectProposal(description, amount, recipientaddress);

        console.log("Creating project proposal...");
        await txn.wait();
        console.log("Project proposal creation...done", txn.hash);

        processDAOProposalsHandler();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const approveProposalHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await DAOContract.approveProjectProposal(inputValue.proposalApproval);
        console.log("Approving project proposal...");
        await txn.wait();
        console.log("Project proposal approval...done", txn.hash);

        processDAOProposalsHandler();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const completeApprovalHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DAOContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await DAOContract.completeProjectProposal(inputValue.proposalFinal);
        console.log("Completing project proposal...");
        await txn.wait();
        console.log("Project proposal completing...done", txn.hash);

        processDAOProposalsHandler();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our DAO.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getMascotName();
    processDAOManagerHandler();    
    processDAOOwnerHandler();  
    processDAOBalanceHandler();
    processDAOProposalsHandler();
    processDAOApproversHandler();
  }, [isWalletConnected])

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">Rigdonhouse DAO Fundraiser Project</span> 💰</h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          {currentMascotName === "" && isDAOOwner ?
            <p>"Setup the mascot name of your DAO." </p> :
            <p className="text-3xl font-bold">DAO Mascot: {currentMascotName}</p>
          }
        </div>
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="contribution"
              placeholder="0.0000 ETH"
              value={inputValue.contribution}
            />
            <button
              className="btn-green"
              onClick={contributionMoneyHandler}>
              Contribute Money In ETH - Anyone
            </button>
          </form>
        </div>

        <div className="mt-5">
          <p><span className="font-bold">** Most Recent Project Proposals **</span></p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Proposal Number: </span>{ProjectProposalNumber}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Proposal Description: </span>{ProjectDescription}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Proposal Funding Amount: </span>{ProjectFundingAmount}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Proposal Recipient: </span>{ProjectFundingRecipient}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Proposal Approval Count: </span>{ProjectApprovalCount}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Proposal Completed / Funds Sent Status: </span>{ProjectComplete}</p>
        </div>

        <div className="mt-10 mb-10">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="proposalApproval"
              placeholder="0 Proposal Number"
              value={inputValue.proposalApproval}
            />
            <button
              className="btn-purple"
              onClick={approveProposalHandler}>
              Approve Proposal Number - Any Contributor
            </button>
          </form>
        </div>

        <div className="mt-10 mb-10">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="proposalAmount"
              placeholder="0.0000 ETH"
              value={inputValue.proposalAmount}
            />
            <button
              className="btn-blue"
              onClick={newProposalHandler}>
              Create New Project Proposal Funding - Manager Only
            </button>
          </form>
        </div>

        <div className="mt-10 mb-10">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="proposalFinal"
              placeholder="0 Proposal Number"
              value={inputValue.proposalFinal}
            />
            <button
              className="btn-blue"
              onClick={completeApprovalHandler}>
              Complete Approval & Issue Funds - Manager Only
            </button>
          </form>
        </div>

        <div className="mt-5">
          <p><span className="font-bold">DAO Min ETH Contribution: </span>{DAOMinimumContribution}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">DAO ETH Balance: </span>{DAOTotalBalance}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">DAO Approvers Count: </span>{DAOApproversCount}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">DAO Owner Address: </span>{DAOOwnerAddress}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">DAO Manager Address: </span>{DAOManagerAddress}</p>
        </div>        
        <div className="mt-5">
          {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{customerAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>
      </section>
      {
        isDAOOwner && (
          <section className="dao-owner-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">DAO Onwer Admin Panel</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="mascotName"
                  placeholder="Enter a Mascot Name for Your DAO"
                  value={inputValue.mascotName}
                />
                <button
                  className="btn-grey"
                  onClick={setMascotNameHandler}>
                  Set Mascot Name
                </button>
              </form>
            </div>
          </section>
        )
      }
    </main>
  );
}
export default App;
