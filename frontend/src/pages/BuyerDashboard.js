import React, { useState } from 'react';

function BuyerDashboard() {
  const [hasPurchased, setHasPurchased] = useState(false); // Tracks if the user has purchased
  const [showKeyInput, setShowKeyInput] = useState(false); // Tracks if "I have a key" is clicked
  const [inputKey, setInputKey] = useState(''); // The key input field value
  const [isKeyValid, setIsKeyValid] = useState(false); // Tracks if the key is valid
  const [loading, setLoading] = useState(false); // Loading state for submitting key

  // Mock CSV Data
  const mockCSVData = `name,age,condition\nJohn Doe,45,Cardiac\nJane Smith,38,Sleep Disorder\nAlice Johnson,50,Sexual Health`;

  // Hardcoded valid key
  const VALID_KEY = '12345-SECRET-KEY';

  // Simulates purchasing a dataset and providing a key
  const purchaseDataset = async () => {
    alert('Dataset purchased! Your key is: ' + VALID_KEY);
    setHasPurchased(true); // Set flag to show they have purchased
  };

  // Handle input key change
  const handleKeyInput = (e) => {
    setInputKey(e.target.value);
  };

  // Simulate key validation
  const handleSubmitKey = () => {
    setLoading(true); // Simulate loading
    setTimeout(() => {
      if (inputKey === VALID_KEY) {
        setIsKeyValid(true);
        alert('Key is valid! You can now download the CSV file and view trends.');
      } else {
        alert('Invalid key. Please try again.');
      }
      setLoading(false);
    }, 2000); // Simulate delay for key verification
  };

  // CSV download function
  const downloadCSV = () => {
    const blob = new Blob([mockCSVData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="dashboard-background">
      <div className="dashboard-container">
        <main className="main-content">
          {!hasPurchased ? (
            <section className="purchase-section">
              <h2>Purchase Dataset</h2>
              <button onClick={purchaseDataset}>Purchase</button>
            </section>
          ) : (
            <section className="key-section">
              <h2>Key Received</h2>
              <p>You have received a key after purchasing the dataset.</p>
              <button onClick={() => setShowKeyInput(true)}>I have a key</button>
            </section>
          )}

          {showKeyInput && (
            <section className="key-input-section">
              <h3>Enter your key</h3>
              <input
                type="text"
                placeholder="Enter your key"
                value={inputKey}
                onChange={handleKeyInput}
              />
              <button onClick={handleSubmitKey} disabled={loading}>
                {loading ? 'Verifying...' : 'Submit'}
              </button>
            </section>
          )}

          {isKeyValid && (
            <section className="download-section">
              <h3>Key is valid!</h3>
              <button onClick={downloadCSV}>Download CSV</button>

              <section className="trends-section">
                <h3>Unlocked Trends</h3>
                <p>Here are some mock health data trends:</p>
                <ul>
                  <li>Cardiac Health: 20% improvement over the last 5 years</li>
                  <li>Sleep Disorders: 15% increase in diagnoses</li>
                  <li>Sexual Health: 10% improvement in reported satisfaction rates</li>
                </ul>
              </section>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default BuyerDashboard;
