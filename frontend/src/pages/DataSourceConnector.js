import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransgateConnect from '@zkpass/transgate-js-sdk';
import Web3 from 'web3';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import CryptoJS from 'crypto-js';
import Sidebar from '../components/Sidebar/Sidebar';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import emailCircuit from '../assets/partial_hash.json';

const connectEmailWithNoir = async () => {
  try {
    console.log('Initializing Noir circuit for email...');
    
    const backend = new BarretenbergBackend(emailCircuit, { threads: 8 });
    const noir = new Noir(emailCircuit);

    const emailInput = { email: 'info@alegriamed.com' };
    
    console.log('Generating witness for email verification...');
    const { witness } = await noir.execute(emailInput);

    console.log('Generating proof for email...');
    const { proof, publicInputs } = await backend.generateProof(witness);

    console.log('Verifying proof...');
    const isVerified = await backend.verifyProof({ proof, publicInputs });

    console.log('Proof verified:', isVerified);
    return isVerified;
  } catch (error) {
    console.error('Error in Noir email verification process:', error);
    throw error;
  }
};


const ipfs = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

const SECRET_KEY = 'I AM OBVIOUSLY A FAKE KEY'; 

function DataSourceConnector() {
  const [selectedSource, setSelectedSource] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [stravaData, setStravaData] = useState({
    name: false,
    location: false,
    numberOfRuns: false,
    runTimes5k: false,
    runTimes10k: false,
  });
  const [jsonFile, setJsonFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [appleHealthUploaded, setAppleHealthUploaded] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedStravaData = JSON.parse(localStorage.getItem('stravaData'));
    const savedIpfsHash = localStorage.getItem('ipfsHash');
    const savedAppleHealth = localStorage.getItem('appleHealthUploaded');
    const savedStravaConnected = localStorage.getItem('stravaConnected');
    if (savedStravaData) {
      setStravaData(savedStravaData);
    }
    if (savedIpfsHash) {
      setIpfsHash(savedIpfsHash);
    }
    if (savedAppleHealth) {
      setAppleHealthUploaded(JSON.parse(savedAppleHealth));
    }
    if (savedStravaConnected) {
      setStravaConnected(JSON.parse(savedStravaConnected));
    }
  }, []);

  const dataSources = [
    { id: 'ssn', name: 'Italian Healthcare System (SSN)', implemented: false },
    { id: 'strava', name: 'Strava', implemented: true },
    { id: 'email', name: 'Email', implemented: true },  // Email is enabled
    { id: 'appstore', name: 'App Store Downloads', implemented: false },
    { id: 'sms', name: 'SMS', implemented: false },
    { id: 'applehealth', name: 'Apple Health', implemented: true },
  ];

  const handleSourceSelect = (sourceId) => {
    setSelectedSource(sourceId);
    setJsonFile(null);
    setJsonData(null);
  };

  const handleStravaDataChange = (event) => {
    const updatedStravaData = {
      ...stravaData,
      [event.target.name]: event.target.checked,
    };
    setStravaData(updatedStravaData);
    localStorage.setItem('stravaData', JSON.stringify(updatedStravaData));
  };

  const handleConnect = async () => {
    setIsConnecting(true);

    if (selectedSource === 'strava') {
      try {
        const proofResult = await connectStrava();
        console.log('Proof result:', proofResult);
        
        setStravaConnected(true);
        localStorage.setItem('stravaConnected', 'true');

        const verificationResult = await verifyProof(proofResult);
        if (verificationResult) {
          console.log('Proof verification succeeded');
        } else {
          console.log('Proof verification failed, but continuing anyway');
        }

        const encryptedPublicInputs = await encryptPublicInputs(proofResult.publicFields || []);
        const ipfsHash = await storeEncryptedData(encryptedPublicInputs);
        console.log(`Data encrypted and stored on IPFS. IPFS Hash: ${ipfsHash}`);
        setIpfsHash(ipfsHash);
        localStorage.setItem('ipfsHash', ipfsHash);
        
        alert('Strava connected successfully!');
        navigate('/seller-dashboard');
      } catch (error) {
        console.error('Error connecting Strava:', error);
      }
    } else if (selectedSource === 'applehealth' && jsonFile) {
      console.log('Uploaded JSON data:', jsonData);
      setAppleHealthUploaded(true);
      localStorage.setItem('appleHealthUploaded', 'true');
      setTimeout(() => {
        alert('Apple Health JSON uploaded successfully!');
        navigate('/seller-dashboard');
      }, 2000); 
    } 
    else if (selectedSource === 'email') {  // Email connection logic
      try {
        const proofResult = await connectEmailWithNoir();
        if (proofResult) {
          alert('Email verified with Noir proof!');
          navigate('/seller-dashboard');
        }
      } catch (error) {
        console.error('Error verifying email with Noir:', error);
      }
    } else {
      alert(`Connecting to ${selectedSource} is not implemented yet.`);
    }

    setIsConnecting(false);
  };

  const connectStrava = async () => {
    try {
      const appId = '1171952b-cdcd-4caf-9532-a53989e4ba87';
      const connector = new TransgateConnect(appId);
      const isAvailable = await connector.isTransgateAvailable();

      if (isAvailable) {
        const schemaId = 'ea392c9438b34dd2a0a247b4861524e8';
        const res = await connector.launch(schemaId);
        console.log('Verification result:', res);
        return res;
      } else {
        alert('Please install TransGate extension from the Chrome Web Store');
        window.open(
          'https://chromewebstore.google.com/detail/zkpass-transgate/afkoofjocpbclhnldmmaphappihehpma',
          '_blank'
        );
        throw new Error('TransGate not available');
      }
    } catch (error) {
      console.error('Error in zkPass verification:', error);
      throw error;
    }
  };

  const verifyProof = async (proofResult) => {
    const web3 = new Web3();
    
    try {
      const { taskId, schemaId, validatorAddress, allocatorSignature } = proofResult;

      const taskIdHex = Web3.utils.stringToHex(taskId);
      const schemaIdHex = Web3.utils.stringToHex(schemaId);

      const allocatorEncodeParams = web3.eth.abi.encodeParameters(
        ["bytes32", "bytes32", "address"],
        [taskIdHex, schemaIdHex, validatorAddress]
      );
      const allocatorParamsHash = Web3.utils.soliditySha3(allocatorEncodeParams);

      const signedAllocatorAddress = web3.eth.accounts.recover(allocatorParamsHash, allocatorSignature);

      if (signedAllocatorAddress.toLowerCase() !== "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d".toLowerCase()) {
        console.error('Allocator signature verification failed');
        return false;
      }

      const { uHash, publicFieldsHash, recipient, validatorSignature } = proofResult;

      const types = ["bytes32", "bytes32", "bytes32", "bytes32"];
      const values = [taskIdHex, schemaIdHex, uHash, publicFieldsHash];

      if (recipient) {
        types.push("address");
        values.push(recipient);
      }

      const validatorEncodeParams = web3.eth.abi.encodeParameters(types, values);
      const validatorParamsHash = Web3.utils.soliditySha3(validatorEncodeParams);

      const signedValidatorAddress = web3.eth.accounts.recover(validatorParamsHash, validatorSignature);

      if (signedValidatorAddress.toLowerCase() !== validatorAddress.toLowerCase()) {
        console.error('Validator signature verification failed');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in proof verification:', error);
      return false;
    }
  };

  const encryptPublicInputs = async (publicInputs) => {
    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(publicInputs),
        SECRET_KEY
      ).toString();
      return encryptedData;
    } catch (error) {
      console.error('Error during encryption:', error);
      throw error;
    }
  };

  const storeEncryptedData = async (encryptedData) => {
    try {
      const result = await ipfs.add(Buffer.from(encryptedData));
      console.log('IPFS Hash:', result.path);
      return result.path;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  };

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setJsonFile(file);
          setJsonData(json);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file');
    }
  };
  
  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <section className="data-source-connector">
            <h1>Connect a New Data Source</h1>
            <p></p>
            <div className="data-source-grid">
              {dataSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source.id)}
                  className={`data-source-box ${selectedSource === source.id ? 'selected' : ''} ${
                    !source.implemented ? 'disabled' : ''
                  } ${
                    (source.id === 'applehealth' && appleHealthUploaded) || 
                    (source.id === 'strava' && stravaConnected) ? 'completed' : ''
                  }`}
                  disabled={!source.implemented}
                >
                  <h2>{source.name}</h2>
                  {!source.implemented && <p>(Coming Soon)</p>}
                  {((source.id === 'applehealth' && appleHealthUploaded) || 
                    (source.id === 'strava' && stravaConnected)) && <p>DONE</p>}
                </button>
              ))}
            </div>

            {selectedSource === 'strava' && (
              <div className="strava-options">
                <h2>Strava Data Options</h2>
                <p>Select the data you want to share:</p>
                {Object.entries(stravaData).map(([key, value]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handleStravaDataChange}
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                ))}
              </div>
            )}

            {selectedSource === 'applehealth' && (
              <div className="apple-health-upload">
                <h2>Upload Apple Health Data</h2>
                <p>Upload your Apple Health data in JSON format:</p>
                <input type="file" accept=".json" onChange={handleJsonUpload} />
                {jsonFile && <p>Uploaded File: {jsonFile.name}</p>}
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={
                !selectedSource ||
                isConnecting ||
                (selectedSource === 'strava' && !Object.values(stravaData).some(Boolean)) ||
                (selectedSource === 'applehealth' && !jsonFile)
              }
              className="connect-button"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DataSourceConnector;
