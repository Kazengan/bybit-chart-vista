import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';

interface PairData {
  symbol: string;
  lastPrice: string;
  price24hPcnt: string;
}

const Markets: React.FC = () => {
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
        }));
      } catch (error) {
        console.error('Error fetching spot pairs:', error);
        return [];
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
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
        }));
      } catch (error) {
        console.error('Error fetching futures pairs:', error);
        return [];
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const renderPairList = (pairs: PairData[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return <div className="text-center py-8">Loading pairs...</div>;
    }

    if (!pairs || pairs.length === 0) {
      return <div className="text-center py-8">No pairs available</div>;
    }

    return (
      <div className="grid gap-4">
        {pairs.map((pair) => (
          <Card key={pair.symbol} className="hover:bg-muted/50 cursor-pointer transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{pair.symbol}</div>
                <div className="flex flex-col items-end">
                  <div>{Number(pair.lastPrice).toLocaleString()}</div>
                  <div className={Number(pair.price24hPcnt) >= 0 ? "text-positive" : "text-negative"}>
                    {Number(pair.price24hPcnt) > 0 ? "+" : ""}{Number(pair.price24hPcnt).toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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