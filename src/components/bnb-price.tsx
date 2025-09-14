"use client";
import React, { useEffect, useRef, memo } from 'react';

function BnbPriceWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
      {
        "symbols": [
          [
            "BINANCE:BNBUSDT|1D"
          ]
        ],
        "chartOnly": true,
        "width": 120,
        "height": 40,
        "locale": "en",
        "colorTheme": "dark",
        "autosize": false,
        "showVolume": false,
        "showMA": false,
        "hideDateRanges": true,
        "hideMarketStatus": true,
        "hideSymbolLogo": true,
        "scalePosition": "no",
        "scaleMode": "Normal",
        "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        "fontSize": "10",
        "noTimeScale": true,
        "valuesTracking": "1",
        "changeMode": "price-and-percent",
        "chartType": "area",
        "maLineColor": "#2962FF",
        "maLineWidth": 1,
        "maLength": 9,
        "backgroundColor": "rgba(0, 0, 0, 0)",
        "widgetFontColor": "rgba(255, 255, 255, 1)"
      }`;
      
      container.current.innerHTML = '';
      container.current.appendChild(script);

      return () => {
        if (container.current) {
            container.current.innerHTML = '';
        }
      }
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "40px", width: "120px" }}>
    </div>
  );
}

const MemoizedBnbPriceWidget = memo(BnbPriceWidget);

export function BnbPrice() {
    return <MemoizedBnbPriceWidget />;
}
