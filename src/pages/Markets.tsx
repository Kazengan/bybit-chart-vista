import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface PairData {
  symbol: string;
  lastPrice: string;
  price24hPcnt: string;
}

const Markets: React.FC = () => {
  const { data: spotPairs, isLoading: spotLoading } = useQuery({
    queryKey: ['spotPairs'],
    queryFn: async () => {
      // Temporary mock data for spot pairs
      return [
        { symbol: "BTCUSDT", lastPrice: "43250.50", price24hPcnt: "2.5" },
        { symbol: "ETHUSDT", lastPrice: "2250.75", price24hPcnt: "-1.2" },
      ];
    }
  });

  const { data: futuresPairs, isLoading: futuresLoading } = useQuery({
    queryKey: ['futuresPairs'],
    queryFn: async () => {
      // Temporary mock data for futures pairs
      return [
        { symbol: "BTCUSDT", lastPrice: "43255.50", price24hPcnt: "2.6" },
        { symbol: "ETHUSDT", lastPrice: "2251.75", price24hPcnt: "-1.1" },
      ];
    }
  });

  const renderPairList = (pairs: PairData[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return <div className="text-center">Loading pairs...</div>;
    }

    return (
      <div className="grid gap-4">
        {pairs?.map((pair) => (
          <Card key={pair.symbol} className="hover:bg-muted/50 cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">{pair.symbol}</div>
                <div className="flex flex-col items-end">
                  <div>{pair.lastPrice}</div>
                  <div className={Number(pair.price24hPcnt) >= 0 ? "text-positive" : "text-negative"}>
                    {Number(pair.price24hPcnt) > 0 ? "+" : ""}{pair.price24hPcnt}%
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
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="spot">Spot</TabsTrigger>
          <TabsTrigger value="futures">Futures</TabsTrigger>
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