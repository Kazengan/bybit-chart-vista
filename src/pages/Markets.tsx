import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface PairData {
  symbol: string;
  lastPrice: string;
  price24hPcnt: string;
  volume24h: string;
}

type SortField = 'symbol' | 'lastPrice' | 'price24hPcnt' | 'volume24h';
type SortDirection = 'asc' | 'desc';

const Markets: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: spotPairs, isLoading: spotLoading } = useQuery({
    queryKey: ['spotPairs'],
    queryFn: async () => {
      try {
        const response = await fetch('https://api.bybit.com/v5/market/tickers?category=spot');
        const data = await response.json();
        return data.result.list.map((item: any) => ({
          symbol: item.symbol,
          lastPrice: item.lastPrice,
          price24hPcnt: item.price24hPcnt,
          volume24h: item.volume24h,
        }));
      } catch (error) {
        console.error('Error fetching spot pairs:', error);
        return [];
      }
    },
    refetchInterval: 5000,
  });

  const { data: futuresPairs, isLoading: futuresLoading } = useQuery({
    queryKey: ['futuresPairs'],
    queryFn: async () => {
      try {
        const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
        const data = await response.json();
        return data.result.list.map((item: any) => ({
          symbol: item.symbol,
          lastPrice: item.lastPrice,
          price24hPcnt: item.price24hPcnt,
          volume24h: item.volume24h,
        }));
      } catch (error) {
        console.error('Error fetching futures pairs:', error);
        return [];
      }
    },
    refetchInterval: 5000,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortPairs = (pairs: PairData[] | undefined) => {
    if (!pairs) return [];
    
    return [...pairs].sort((a, b) => {
      let compareA, compareB;
      
      switch (sortField) {
        case 'symbol':
          compareA = a.symbol;
          compareB = b.symbol;
          break;
        case 'lastPrice':
          compareA = parseFloat(a.lastPrice);
          compareB = parseFloat(b.lastPrice);
          break;
        case 'price24hPcnt':
          compareA = parseFloat(a.price24hPcnt);
          compareB = parseFloat(b.price24hPcnt);
          break;
        case 'volume24h':
          compareA = parseFloat(a.volume24h);
          compareB = parseFloat(b.volume24h);
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  };

  const renderPairList = (pairs: PairData[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading pairs...</div>;
    }

    if (!pairs || pairs.length === 0) {
      return <div className="text-center py-8">No pairs available</div>;
    }

    const sortedPairs = sortPairs(pairs);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-muted/50 rounded-lg">
          <Button 
            variant="ghost" 
            onClick={() => handleSort('symbol')}
            className="flex justify-between items-center"
          >
            Symbol
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleSort('lastPrice')}
            className="flex justify-between items-center"
          >
            Price
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleSort('price24hPcnt')}
            className="flex justify-between items-center"
          >
            24h Change
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleSort('volume24h')}
            className="flex justify-between items-center"
          >
            24h Volume
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-4">
          {sortedPairs.map((pair) => (
            <Card key={pair.symbol} className="hover:bg-muted/50 cursor-pointer transition-colors">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div className="font-medium">{pair.symbol}</div>
                  <div className="text-right">{Number(pair.lastPrice).toLocaleString()}</div>
                  <div className={`text-right ${Number(pair.price24hPcnt) >= 0 ? "text-positive" : "text-negative"}`}>
                    {Number(pair.price24hPcnt) > 0 ? "+" : ""}{(Number(pair.price24hPcnt) * 100).toFixed(2)}%
                  </div>
                  <div className="text-right">
                    {Number(pair.volume24h).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Markets</h1>
      
      <Tabs defaultValue="spot" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent gap-4">
          <TabsTrigger 
            value="spot"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-8 py-3 font-semibold transition-all"
          >
            Spot
          </TabsTrigger>
          <TabsTrigger 
            value="futures"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-8 py-3 font-semibold transition-all"
          >
            Futures
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="spot">
          {renderPairList(spotPairs, spotLoading)}
        </TabsContent>
        
        <TabsContent value="futures">
          {renderPairList(futuresPairs, futuresLoading)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Markets;