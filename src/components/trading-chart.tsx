"use client";
import React, { useEffect, useRef, memo } from 'react';

type TradingViewWidgetProps = {
  symbol: string;
};

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "withdateranges": false,
        "allow_symbol_change": true,
        "details": true,
        "hotlist": true,
        "calendar": true,
        "support_host": "https://www.tradingview.com"
      }`;
      
      container.current.appendChild(script);

      return () => {
        if (container.current) {
            const chartWidget = container.current.querySelector('.tradingview-widget-container__widget');
            if (chartWidget) {
                container.current.removeChild(chartWidget);
            }
        }
      }
    },
    [symbol]
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "700px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

const MemoizedTradingViewWidget = memo(TradingViewWidget);

export function TradingChart({ symbol }: TradingViewWidgetProps) {
    return <MemoizedTradingViewWidget symbol={symbol} />;
}
