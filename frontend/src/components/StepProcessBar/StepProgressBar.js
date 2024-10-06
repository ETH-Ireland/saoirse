import React from 'react';
import './StepProgressBar.css'; 

function StepProgressBar({ isAnySourceConnected }) {
  const steps = [
    { label: 'Profile set up', completed: true, icon: '✔️' },
    { label: 'First upload', completed: isAnySourceConnected, icon: isAnySourceConnected ? '✔️' : '🆕' },
    { label: 'Engage', completed: false, icon: '💬' },
    { label: 'Connections', completed: false, icon: '👥' },
    { label: 'Earn', completed: false, icon: '💵' },
  ];

  return (
    <div className="step-progress-bar">
      {steps.map((step, index) => (
        <div key={index} className={`step ${step.completed ? 'completed' : ''}`}>
          <div className="step-icon">{step.icon}</div>
          <p className="step-label">{step.label}</p>
          {index < steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
}

export default StepProgressBar;