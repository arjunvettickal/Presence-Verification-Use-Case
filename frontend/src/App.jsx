import React, { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import OrderForm from './components/OrderForm';
import DetectionView from './components/DetectionView';
import ResultDisplay from './components/ResultDisplay';
import HistoryLog from './components/HistoryLog';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [selectedModel, setSelectedModel] = useState('');
  const [order, setOrder] = useState({});
  const [orderId, setOrderId] = useState(new Date().getTime().toString());
  const [result, setResult] = useState(null);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    img_size: 640,
    conf_thres: 0.25,
    iou_thres: 0.45
  });

  const handleOrderReset = () => {
    setResult(null);
    setOrderId(new Date().getTime().toString());
    setOrder({});
    window.location.reload();
  };

  const handleVerificationComplete = (res) => {
    setResult(res);
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Part Presence Verification</h1>
        <p className="text-gray-500">Industrial Order Verification System</p>
      </header>

      {!result ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <ModelSelector onSelect={setSelectedModel} />

              <SettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
                isOpen={showSettings}
                onToggle={() => setShowSettings(!showSettings)}
              />

              <OrderForm onOrderChange={setOrder} />
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-blue-50 p-4 rounded text-blue-800 mb-4">
                <strong>Current Order ID:</strong> {orderId}
                <br />
                <strong>Items Selected:</strong> {Object.keys(order).length}
              </div>

              {Object.keys(order).length > 0 && selectedModel && (
                <DetectionView
                  orderId={orderId}
                  orderParts={order}
                  selectedModel={selectedModel}
                  settings={settings}
                  onVerificationComplete={handleVerificationComplete}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <ResultDisplay result={result} onReset={handleOrderReset} />
      )}

      <HistoryLog />
    </div>
  );
}

export default App;
