import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import Sidebar from '../components/Sidebar/Sidebar';
import StepProgressBar from '../components/StepProcessBar/StepProgressBar';

function BuyerDashboard() {
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [researchImpact, setResearchImpact] = useState({});
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    connectWallet();
    fetchAvailableDatasets();
    fetchPurchaseHistory();
    fetchResearchImpact();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setWallet(signer);
      } else {
        setError('Please install MetaMask to use this feature');
      }
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  const fetchAvailableDatasets = async () => {
    setAvailableDatasets([
      { id: 1, name: 'Health Data Set 1', price: '0.1 ETH', category: 'Cardiac Health' },
      { id: 2, name: 'Health Data Set 2', price: '0.2 ETH', category: 'Activity & Sleep' },
      { id: 3, name: 'Health Data Set 3', price: '0.15 ETH', category: 'Sexual Health' },
    ]);
  };

  const fetchPurchaseHistory = async () => {
    setPurchaseHistory([
      { id: 1, datasetName: 'Health Data Set 1', date: '2023-05-01', price: '0.1 ETH' },
      { id: 2, datasetName: 'Health Data Set 2', date: '2023-05-15', price: '0.2 ETH' },
    ]);
  };

  const fetchResearchImpact = async () => {
    setResearchImpact({
      datasetsContributed: 2,
      researchPapersImpacted: 5,
      totalCitations: 23,
    });
  };

  const purchaseDataset = async (datasetId) => {
    console.log('Purchasing dataset:', datasetId);
    // Implement purchase logic here
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
          <section className="impact-section">
            <h2>Research Impact</h2>
            <StepProgressBar />
          </section>

          <section className="info-blocks">
            <h3>Available Datasets</h3>
            <div className="block-container">
              {availableDatasets.map((dataset) => (
                <div key={dataset.id} className="block-item">
                  <span className="emoji">📊</span>
                  <div>
                    <h4>{dataset.name}</h4>
                    <p>{dataset.price}</p>
                    <p>{dataset.category}</p>
                    <button onClick={() => purchaseDataset(dataset.id)}>Purchase</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="info-blocks">
            <h3>Purchase History</h3>
            <div className="block-container">
              {purchaseHistory.map((purchase) => (
                <div key={purchase.id} className="block-item">
                  <span className="emoji">🛒</span>
                  <div>
                    <h4>{purchase.datasetName}</h4>
                    <p>Date: {purchase.date}</p>
                    <p>Price: {purchase.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="community-section">
            <h2>Research Community</h2>
            <div className="partner-list">
              <div className="partner-card">
                <Link to="/research-community">Join Research Community</Link>
              </div>
            </div>
          </section>
        </main>

        <aside className="analytics-sidebar">
          <h2>Research Impact</h2>
          <div className="progress-bar">
            <div className="progress-circle completed"></div>
            <div className="progress-circle completed"></div>
            <div className="progress-circle"></div>
            <div className="progress-circle"></div>
          </div>
          <div className="expenses">
            <p>Datasets Contributed: {researchImpact.datasetsContributed}</p>
            <p>Papers Impacted: {researchImpact.researchPapersImpacted}</p>
            <p>Total Citations: {researchImpact.totalCitations}</p>
          </div>

          <div className="protected-paid">
            <h3>Ethical. Impactful. Innovative.</h3>
            <p>Your research contributes to advancing healthcare. Explore more datasets below.</p>
            <Link to="/explore-datasets" className="upload-btn">Explore Datasets</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BuyerDashboard;