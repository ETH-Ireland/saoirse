import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar'; 
import StepProgressBar from '../components/StepProcessBar/StepProgressBar'; 

function SellerDashboard() {
  const [connectedSources, setConnectedSources] = useState([]);

  useEffect(() => {
    const appleHealthConnected = localStorage.getItem('appleHealthUploaded');
    const stravaConnected = localStorage.getItem('stravaConnected');
    
    let sources = [];
    if (appleHealthConnected === 'true') {
      sources.push('applehealth');
    }
    if (stravaConnected === 'true') {
      sources.push('Strava');
    }
    
    setConnectedSources(sources);
  }, []);

  const isAnySourceConnected = connectedSources.length > 0;

  const communityPartners = [
    { id: 1, name: 'CerebrumDAO', address: '0x8bE8AE739f560fB0ebc0b1520EA5C4BcFEec5129', requiredSource: 'Strava' },
    { id: 2, name: 'AthenaDAO', address: '0x8bE8AE739f560fB0ebc0b1520EA5C4BcFEec5129', requiredSource: 'applehealth' },
    { id: 3, name: 'DeSci Gitcoin Community', address: '0x8bE8AE739f560fB0ebc0b1520EA5C4BcFEec5129', requiredSource: 'sms' },
  ];

  const isSourceConnected = (requiredSource) => {
    if (!requiredSource) return true; 
    return connectedSources.includes(requiredSource);
  };

  const isAppleHealthConnected = connectedSources.includes('applehealth');

  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
          <section className="impact-section">
            <h2>Personal Stats</h2>
            <StepProgressBar isAnySourceConnected={isAnySourceConnected} />
          </section>

          <section className="info-blocks">
            <h3>Activity & Sleep</h3>
            <div className="block-container">
              <div className="block-item">
                <span className="emoji">👣</span>
                <div>
                  <h4>Step Count</h4>
                  {isAppleHealthConnected ? (
                    <p>89,250</p>
                  ) : (
                    <p>Add a data source</p>
                  )}
                </div>
              </div>
              <div className="block-item">
                <span className="emoji">💤</span>
                <div>
                  <h4>REM Sleep</h4>
                  {isAppleHealthConnected ? (
                    <p>12 Hours</p>
                  ) : (
                    <p>Add a data source</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="info-blocks">
            <h3>Cardiac Health</h3>
            <div className="block-container">
              <div className="block-item">
                <span className="emoji">❤️</span>
                <div>
                  <h4>Average ECG Readings</h4>
                  {isAppleHealthConnected ? (
                    <p>76</p>
                  ) : (
                    <p>Add a data source</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="info-blocks">
            <h3>Sexual Health</h3>
            <div className="block-container">
              <div className="block-item">
                <span className="emoji">🧬</span>
                <div>
                  <h4>STI/STD Status</h4>
                  {isAppleHealthConnected ? (
                    <p>Clean</p>
                  ) : (
                    <p>Add a data source</p>
                  )}
                </div>
              </div>
              <div className="block-item">
                <span className="emoji">💊</span>
                <div>
                  <h4>Contraceptive Use</h4>
                  {isAppleHealthConnected ? (
                    <p>Microgynon30</p>
                  ) : (
                    <p>Add a data source</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="community-section">
            <h2>Communities</h2>
            <div className="partner-list">
              {communityPartners.map((partner) => (
                <div key={partner.id} className="partner-card">
                  {isSourceConnected(partner.requiredSource) ? (
                    <Link to="/community" state={{ community: partner }}>
                      {partner.name}
                    </Link>
                  ) : (
                    <p>
                      Upload {partner.requiredSource} data to be considered to access {partner.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="analytics-sidebar">
          <h2>Rewards</h2>
          <div className="progress-bar">
            <div className="progress-circle completed"></div>
            <div className="progress-circle completed"></div>
            <div className="progress-circle"></div>
            <div className="progress-circle"></div>
          </div>
          <div className="expenses">
            <p>Physical Activity: {isAppleHealthConnected ? "0.02 ETH" : "Add a data source"}</p>
            <p>Cardiac: {isAppleHealthConnected ? "0.001 ETH" : "Add a data source"}</p>
            <p>Screen Time: {isAppleHealthConnected ? "0 ETH" : "Add a data source"}</p>
            <p>Sexual Health: {isAppleHealthConnected ? "0.1 ETH" : "Add a data source"}</p>
          </div>

          <div className="protected-paid">
            <h3>Protected. Private. Paid.</h3>
            <p>Your data is secure and private. Connect a new data source below.</p>
            <Link to="/connect-data" className="upload-btn">Add Data Source</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default SellerDashboard;