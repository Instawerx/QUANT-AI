'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface TradingChartProps {
  symbol?: string;
  interval?: string;
  height?: number;
  showControls?: boolean;
}

export function TradingChart({
  symbol = 'BTCUSDT',
  interval = '1h',
  height = 400,
  showControls = true
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Generate realistic cryptocurrency data
  const generateCandlestickData = (days: number = 30): CandlestickData[] => {
    const data: CandlestickData[] = [];
    const now = new Date();
    let basePrice = 45000; // Starting price for BTC

    if (symbol.includes('ETH')) basePrice = 2800;
    if (symbol.includes('ADA')) basePrice = 0.45;
    if (symbol.includes('SOL')) basePrice = 95;

    for (let i = days * 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString().split('T')[0];

      // Simulate realistic price movement
      const volatility = 0.02; // 2% volatility
      const trend = Math.sin(i / 24) * 0.001; // Slight trending
      const randomChange = (Math.random() - 0.5) * volatility;

      const open = basePrice;
      const change = basePrice * (trend + randomChange);
      const high = Math.max(open, open + change) + (Math.random() * basePrice * 0.01);
      const low = Math.min(open, open + change) - (Math.random() * basePrice * 0.01);
      const close = open + change;

      const volume = Math.random() * 1000000 + 500000;

      data.push({
        time,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Number(volume.toFixed(0))
      });

      basePrice = close;
    }

    return data;
  };

  // Simulate real-time price updates
  const simulateRealTimeData = () => {
    if (!candlestickSeriesRef.current || !chartRef.current) return;

    const lastData = candlestickSeriesRef.current.dataByIndex(0, -1);
    if (!lastData) return;

    const volatility = 0.001; // 0.1% per update
    const randomChange = (Math.random() - 0.5) * volatility;
    const newPrice = lastData.close * (1 + randomChange);

    const now = new Date();
    const timeString = now.toISOString().split('T')[0];

    const newData: CandlestickData = {
      time: timeString,
      open: lastData.close,
      high: Math.max(lastData.close, newPrice),
      low: Math.min(lastData.close, newPrice),
      close: newPrice,
      volume: Math.random() * 1000000 + 500000
    };

    // Update current price and calculate change
    const oldPrice = currentPrice || lastData.close;
    const change = newPrice - oldPrice;
    const changePercent = ((change / oldPrice) * 100);

    setCurrentPrice(newPrice);
    setPriceChange(change);
    setPriceChangePercent(changePercent);

    // Update chart
    candlestickSeriesRef.current.update(newData);

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.update({
        time: timeString,
        value: newData.volume || 0,
        color: newPrice > lastData.close ? '#00E676' : '#FF5252'
      });
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2d2d2d' },
        horzLines: { color: '#2d2d2d' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485158',
      },
      timeScale: {
        borderColor: '#485158',
        timeVisible: true,
        secondsVisible: false,
      },
      height,
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00E676',
      downColor: '#FF5252',
      borderDownColor: '#FF5252',
      borderUpColor: '#00E676',
      wickDownColor: '#FF5252',
      wickUpColor: '#00E676',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeriesRef.current = volumeSeries;

    // Generate and set initial data
    const data = generateCandlestickData();
    candlestickSeries.setData(data);

    // Set volume data
    const volumeData = data.map(d => ({
      time: d.time,
      value: d.volume || 0,
      color: d.close > d.open ? '#00E676' : '#FF5252'
    }));
    volumeSeries.setData(volumeData);

    // Set initial price
    const lastPrice = data[data.length - 1];
    setCurrentPrice(lastPrice.close);
    setPriceChange(lastPrice.close - lastPrice.open);
    setPriceChangePercent(((lastPrice.close - lastPrice.open) / lastPrice.open) * 100);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height, symbol]);

  // Real-time simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(simulateRealTimeData, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isSimulating, currentPrice]);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return price.toFixed(4);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(Math.abs(change))}`;
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-bold">{symbol}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {interval}
            </Badge>
            {isSimulating && (
              <Badge variant="default" className="text-xs animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </div>

          {showControls && (
            <Button
              variant={isSimulating ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsSimulating(!isSimulating)}
            >
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-foreground">
              ${formatPrice(currentPrice)}
            </span>
            <div className={`flex items-center gap-2 text-sm ${
              priceChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{formatChange(priceChange)}</span>
              <span>({formatPercent(priceChangePercent)})</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={chartContainerRef}
          className="w-full"
          style={{ height: `${height}px` }}
        />
      </CardContent>
    </Card>
  );
}