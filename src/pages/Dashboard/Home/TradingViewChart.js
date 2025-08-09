import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

const signalData = [
  { time: "2025-08-06T10:00:00Z", signal: "buy", price: 28400 },
  { time: "2025-08-06T11:30:00Z", signal: "sell", price: 28800 },
  { time: "2025-08-06T13:00:00Z", signal: "buy", price: 28350 },
];

const TradingViewWidgetWithSignals = () => {
  const [signals, setSignals] = useState([]);
  const [signal, setSignal] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("signal => ", signal);

  useEffect(() => {
    setTimeout(() => {
      setSignals(signalData);
    }, 1000);
  }, []);


  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/signals',
          {
            params: {
              symbol: 'TAO/USDT',
              tf: '15m'
            },
            headers: {
              accept: 'application/json'
            }
          }
        );
        setSignal(response.data);
      } catch (error) {
        console.error('Error fetching signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  return (
    <div style={{ position: 'relative', height: '600px' }}>
      <TradingViewWidget
        symbol="BINANCE:TAOUSDT"
        theme="light"
        locale="en"
        autosize={false}
        height={600} // Set chart height here
        width="100%" // optional: make it responsive horizontally
      />

      {signals.map((signal, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: `${50 + index * 50}px`, // simulate different Y positions
            left: '20px',
            color: signal.signal === 'buy' ? 'lime' : 'red',
            background: '#111',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            zIndex: 999,
          }}
        >
          {signal.signal.toUpperCase()} @ ${signal.price}
        </div>
      ))}
    </div>
  );
};

export default TradingViewWidgetWithSignals;