"use client";

import { useState } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useQuantToken } from '@/hooks/use-quant-token';
import { useAccessRegistry } from '@/hooks/use-access-registry';
import { useTransactions } from '@/hooks/use-transactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Wallet as WalletIcon,
  Copy,
  ExternalLink,
  Send,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function WalletPage() {
  const {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  } = useWallet();

  const {
    tokenInfo,
    balance: tokenBalance,
    availableRewards,
    transfer,
    refresh: refreshToken,
  } = useQuantToken();

  const {
    userStatus,
    userTierName,
    isVerifiedUser,
    canUserTrade,
  } = useAccessRegistry();

  const {
    transactions,
    executeTransaction,
    clearTransactions,
  } = useTransactions();

  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  // Handle token transfer
  const handleTransfer = async () => {
    if (!transferTo || !transferAmount || !tokenInfo) return;

    setIsTransferring(true);
    try {
      await executeTransaction(
        'transfer',
        `Transfer ${transferAmount} ${tokenInfo.symbol} to ${transferTo.slice(0, 6)}...${transferTo.slice(-4)}`,
        () => transfer(transferTo, transferAmount)
      );

      setTransferTo('');
      setTransferAmount('');
      refreshToken();
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsTransferring(false);
    }
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get network name
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 11155111:
        return 'Sepolia Testnet';
      case 1:
        return 'Ethereum Mainnet';
      case 31337:
        return 'Local Network';
      default:
        return `Unknown (${chainId})`;
    }
  };

  // Get transaction status icon
  const getTransactionIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <WalletIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your MetaMask wallet to access QuantAI trading features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Make sure you're on the Sepolia testnet for the best experience
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Wallet Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <WalletIcon className="h-5 w-5" />
                  Wallet Connected
                </CardTitle>
                <CardDescription>
                  Manage your tokens and trading account
                </CardDescription>
              </div>
              <Button variant="outline" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {formatAddress(account!)}
                  </code>
                  <Button size="sm" variant="ghost" onClick={copyAddress}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Network</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={chainId === 11155111 ? "default" : "secondary"}>
                    {getNetworkName(chainId!)}
                  </Badge>
                  {chainId !== 11155111 && (
                    <Button size="sm" variant="outline" onClick={switchToSepolia}>
                      Switch to Sepolia
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">ETH Balance</Label>
                <p className="text-lg font-semibold mt-1">
                  {balance ? parseFloat(balance).toFixed(4) : '0.0000'} ETH
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Verification</Label>
                <Badge variant={isVerifiedUser ? "default" : "secondary"} className="mt-1">
                  {isVerifiedUser ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Trading Status</Label>
                <Badge variant={canUserTrade ? "default" : "destructive"} className="mt-1">
                  {canUserTrade ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Tier</Label>
                <Badge variant="outline" className="mt-1">
                  {userTierName}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Suspended</Label>
                <Badge variant={userStatus.isSuspended ? "destructive" : "default"} className="mt-1">
                  {userStatus.isSuspended ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Token Information */}
          <TabsContent value="tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QuantAI Token (QUANT)</CardTitle>
                <CardDescription>
                  Your QUANT token balance and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tokenInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Balance</Label>
                      <p className="text-2xl font-bold mt-1">
                        {parseFloat(tokenBalance).toFixed(2)} {tokenInfo.symbol}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Available Rewards</Label>
                      <p className="text-xl font-semibold mt-1 text-green-600">
                        {parseFloat(availableRewards).toFixed(2)} {tokenInfo.symbol}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Supply</Label>
                      <p className="text-lg mt-1">
                        {parseFloat(tokenInfo.totalSupply).toLocaleString()} {tokenInfo.symbol}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Unable to load token information. Make sure you're connected to the correct network.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfer Tokens */}
          <TabsContent value="transfer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Tokens</CardTitle>
                <CardDescription>
                  Send QUANT tokens to another address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="transferTo">Recipient Address</Label>
                  <Input
                    id="transferTo"
                    placeholder="0x..."
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="transferAmount">Amount</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    placeholder="0.0"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Available: {parseFloat(tokenBalance).toFixed(2)} {tokenInfo?.symbol || 'QUANT'}
                  </p>
                </div>
                <Button
                  onClick={handleTransfer}
                  disabled={!transferTo || !transferAmount || isTransferring || !canUserTrade}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isTransferring ? 'Transferring...' : 'Transfer Tokens'}
                </Button>
                {!canUserTrade && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your account is not authorized to trade. Please contact support for verification.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Recent transactions and their status
                    </CardDescription>
                  </div>
                  {transactions.length > 0 && (
                    <Button variant="outline" onClick={clearTransactions}>
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(tx.status)}
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleString()}
                            </p>
                            {tx.error && (
                              <p className="text-sm text-red-500">{tx.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            tx.status === 'success' ? 'default' :
                            tx.status === 'error' ? 'destructive' : 'secondary'
                          }>
                            {tx.status}
                          </Badge>
                          {tx.hash && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}