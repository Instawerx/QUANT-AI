"use client";
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;
      
      // Clean up existing scripts if any
      const scripts = container.current.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        scripts[i].remove();
      }

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BINANCE:MATICUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "details": true,
        "hotlist": true,
        "calendar": true,
        "support_host": "https://www.tradingview.com"
      }`;
      
      container.current.appendChild(script);

      return () => {
        if (container.current) {
            const scripts = container.current.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                scripts[i].remove();
            }
        }
      }
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "500px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

const MemoizedTradingViewWidget = memo(TradingViewWidget);

export function TradingChart() {
    return <MemoizedTradingViewWidget />;
}
