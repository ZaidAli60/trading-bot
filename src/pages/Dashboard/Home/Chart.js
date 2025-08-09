
// ChartWithToolbar.js
import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  createSeriesMarkers,
} from "lightweight-charts";
import axios from "axios";
import { Button, Space, Spin } from "antd";
import "antd/dist/reset.css";

const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d"];

export default function ChartWithToolbar() {
  const chartContainerRef = useRef();
  const chartInstanceRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const seriesMarkersRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [activeTF, setActiveTF] = useState("15m");

  const fetchData = async (tf) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/signals?symbol=TAO/USDT&tf=${tf}`
      );

      const { ohlc_data, Analysis_Summary } = res.data;

      const candleData = ohlc_data.map((d) => ({
        time: Math.floor(new Date(d.timestamp).getTime() / 1000),
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const volumeData = ohlc_data.map((d) => ({
        time: Math.floor(new Date(d.timestamp).getTime() / 1000),
        value: d.volume,
        color: d.close >= d.open ? "#4fff8f" : "#ff4976",
      }));

      candleSeriesRef.current.setData(candleData);
      volumeSeriesRef.current.setData(volumeData);

      let markerColor = "#d1d4dc";
      let shape = "circle";
      if (Analysis_Summary.overall_recommendation.includes("Buy")) {
        markerColor = "#4fff8f";
        shape = "arrowUp";
      } else if (Analysis_Summary.overall_recommendation.includes("Sell")) {
        markerColor = "#ff4976";
        shape = "arrowDown";
      }

      if (candleData.length > 0) {
        const lastCandle = candleData[candleData.length - 1];
        seriesMarkersRef.current.setMarkers([
          {
            time: lastCandle.time,
            position: shape === "arrowUp" ? "belowBar" : "aboveBar",
            color: markerColor,
            shape: shape,
            text: Analysis_Summary.overall_recommendation,
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 700,
      layout: {
        background: { color: "#1e222d" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#2B2B43" },
      },
      crosshair: { mode: 0 },
    });

    chart.applyOptions({
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const date = new Date(time * 1000);
          if (tickMarkType === 'year') {
            return date.getFullYear().toString();
          }
          if (tickMarkType === 'month') {
            return date.toLocaleString(locale, { month: 'short', year: 'numeric' });
          }
          return date.toLocaleDateString(locale);
        }
      }
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#4fff8f",
      borderUpColor: "#4fff8f",
      wickUpColor: "#4fff8f",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      wickDownColor: "#ff4976",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: 'volume',
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    const markers = createSeriesMarkers(candleSeries, []);

    chartInstanceRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    seriesMarkersRef.current = markers;

    fetchData(activeTF);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  const handleTimeframeChange = (tf) => {
    setActiveTF(tf);
    fetchData(tf);
  };

  return (
    <div style={{ background: "#131722", padding: "10px", borderRadius: "8px" }}>
      {/* Toolbar */}
      <Space style={{ marginBottom: "10px", flexWrap: "wrap" }}>
        {timeframes.map((tf) => (
          <Button
            key={tf}
            type={activeTF === tf ? "primary" : "default"}
            style={{
              backgroundColor: activeTF === tf ? "#2962FF" : "#1e222d",
              color: "#fff",
              border: "none",
            }}
            onClick={() => handleTimeframeChange(tf)}
          >
            {tf.toUpperCase()}
          </Button>
        ))}
      </Space>

      {/* Chart with Loading */}
      <div style={{ position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <Spin size="large" />
          </div>
        )}
        <div
          ref={chartContainerRef}
          style={{
            width: "100%",
            height: "700px",
            opacity: loading ? 0.3 : 1,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}
