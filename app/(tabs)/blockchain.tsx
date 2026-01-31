import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Transaction {
  id: string;
  supplierName: string;
  transactionType: string;
  co2Value: string;
  verificationStatus: "Verified" | "Pending";
  timestamp: string;
  blockchainId: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    supplierName: "Steel Supplier Inc.",
    transactionType: "Material Shipment",
    co2Value: "12.5 tons CO₂",
    verificationStatus: "Verified",
    timestamp: "2 hours ago",
    blockchainId: "0x7f3a...9c2e",
  },
  {
    id: "2",
    supplierName: "Green Energy Co.",
    transactionType: "Energy Purchase",
    co2Value: "-8.2 tons CO₂",
    verificationStatus: "Verified",
    timestamp: "1 day ago",
    blockchainId: "0x4b1c...7d8f",
  },
  {
    id: "3",
    supplierName: "Concrete Solutions Ltd.",
    transactionType: "Material Shipment",
    co2Value: "18.7 tons CO₂",
    verificationStatus: "Pending",
    timestamp: "3 days ago",
    blockchainId: "0x9e5a...3f1b",
  },
  {
    id: "4",
    supplierName: "Carbon Offset Partners",
    transactionType: "Carbon Credit",
    co2Value: "-25.0 tons CO₂",
    verificationStatus: "Verified",
    timestamp: "1 week ago",
    blockchainId: "0x2c7d...8a4e",
  },
];

export default function BlockchainScreen() {
  const colors = useColors();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const totalScope3 = "1,847 tons CO₂";
  const verifiedCount = transactions.filter(t => t.verificationStatus === "Verified").length;
  const partnerCount = new Set(transactions.map(t => t.supplierName)).size;
  const carbonCredits = "125.3 tons";

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-3 active:opacity-70"
      onPress={() => setSelectedTransaction(transaction)}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground mb-1">{transaction.supplierName}</Text>
          <View className="flex-row items-center">
            <View className="bg-secondary/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-medium text-secondary">{transaction.transactionType}</Text>
            </View>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          transaction.verificationStatus === "Verified" ? "bg-success/20" : "bg-warning/20"
        }`}>
          <Text className={`text-xs font-medium ${
            transaction.verificationStatus === "Verified" ? "text-success" : "text-warning"
          }`}>
            {transaction.verificationStatus === "Verified" ? "✓ Verified" : "⏳ Pending"}
          </Text>
        </View>
      </View>

      {/* CO2 Value */}
      <View className="mb-3">
        <Text className="text-xs text-muted mb-1">Carbon Emissions</Text>
        <Text className={`text-2xl font-bold ${
          transaction.co2Value.startsWith("-") ? "text-success" : "text-foreground"
        }`}>
          {transaction.co2Value}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between border-t border-border pt-3">
        <Text className="text-xs text-muted">{transaction.timestamp}</Text>
        <Text className="text-xs font-mono text-muted">{transaction.blockchainId}</Text>
      </View>
    </TouchableOpacity>
  );

  const TransactionDetailModal = () => (
    <Modal
      visible={selectedTransaction !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedTransaction(null)}
    >
      {selectedTransaction && (
        <View className="flex-1 bg-background">
          <View className="px-6 pt-6 pb-4 border-b border-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-foreground">Transaction Details</Text>
              <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
                <Text className="text-lg text-primary font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
            {/* Verification Badge */}
            <View className="items-center mb-6">
              <View className={`w-20 h-20 rounded-full items-center justify-center mb-3 ${
                selectedTransaction.verificationStatus === "Verified" ? "bg-success/20" : "bg-warning/20"
              }`}>
                <Text className="text-4xl">
                  {selectedTransaction.verificationStatus === "Verified" ? "✓" : "⏳"}
                </Text>
              </View>
              <Text className={`text-lg font-bold ${
                selectedTransaction.verificationStatus === "Verified" ? "text-success" : "text-warning"
              }`}>
                {selectedTransaction.verificationStatus === "Verified" ? "Verified on Blockchain" : "Pending Verification"}
              </Text>
            </View>

            {/* Transaction Information */}
            <View className="bg-surface rounded-xl p-4 mb-4">
              <Text className="text-sm font-semibold text-muted mb-3">TRANSACTION INFORMATION</Text>
              
              <View className="mb-4">
                <Text className="text-xs text-muted mb-1">Supplier/Partner</Text>
                <Text className="text-base font-semibold text-foreground">{selectedTransaction.supplierName}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-xs text-muted mb-1">Transaction Type</Text>
                <Text className="text-base font-semibold text-foreground">{selectedTransaction.transactionType}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-xs text-muted mb-1">Carbon Emissions</Text>
                <Text className={`text-2xl font-bold ${
                  selectedTransaction.co2Value.startsWith("-") ? "text-success" : "text-foreground"
                }`}>
                  {selectedTransaction.co2Value}
                </Text>
              </View>

              <View>
                <Text className="text-xs text-muted mb-1">Timestamp</Text>
                <Text className="text-base font-semibold text-foreground">{selectedTransaction.timestamp}</Text>
              </View>
            </View>

            {/* Blockchain Verification */}
            <View className="bg-surface rounded-xl p-4 mb-4">
              <Text className="text-sm font-semibold text-muted mb-3">BLOCKCHAIN VERIFICATION</Text>
              
              <View className="mb-4">
                <Text className="text-xs text-muted mb-1">Network</Text>
                <Text className="text-base font-semibold text-foreground">Energy Web Chain</Text>
              </View>

              <View className="mb-4">
                <Text className="text-xs text-muted mb-1">Transaction ID</Text>
                <Text className="text-sm font-mono text-foreground">{selectedTransaction.blockchainId}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-xs text-muted mb-1">Block Number</Text>
                <Text className="text-base font-semibold text-foreground">12,458,392</Text>
              </View>

              <View>
                <Text className="text-xs text-muted mb-1">Smart Contract</Text>
                <Text className="text-sm font-mono text-foreground">0x742d...5e9a</Text>
              </View>
            </View>

            {/* Actions */}
            <TouchableOpacity
              className="bg-secondary/10 border border-secondary rounded-xl py-4 items-center active:opacity-70"
              onPress={() => {
                Alert.alert("Blockchain Explorer", "This would open the transaction in a blockchain explorer");
              }}
            >
              <Text className="text-secondary font-semibold">View on Blockchain Explorer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </Modal>
  );

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-foreground">Blockchain</Text>
            <TouchableOpacity className="active:opacity-70">
              <Text className="text-2xl">ℹ️</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-muted">
            Supply Chain Carbon Tracking
          </Text>
        </View>

        {/* Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <View className="bg-surface rounded-2xl p-4 mr-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Total Scope 3</Text>
            <Text className="text-2xl font-bold text-foreground mb-1">{totalScope3}</Text>
            <Text className="text-xs text-muted">Emissions</Text>
          </View>

          <View className="bg-surface rounded-2xl p-4 mr-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Verified Txns</Text>
            <Text className="text-2xl font-bold text-success mb-1">{verifiedCount}</Text>
            <Text className="text-xs text-success">✓ On blockchain</Text>
          </View>

          <View className="bg-surface rounded-2xl p-4 mr-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Supply Chain</Text>
            <Text className="text-2xl font-bold text-foreground mb-1">{partnerCount}</Text>
            <Text className="text-xs text-muted">Partners</Text>
          </View>

          <View className="bg-surface rounded-2xl p-4" style={{ width: 160 }}>
            <Text className="text-xs text-muted mb-1">Carbon Credits</Text>
            <Text className="text-2xl font-bold text-primary mb-1">{carbonCredits}</Text>
            <Text className="text-xs text-muted">Available</Text>
          </View>
        </ScrollView>

        {/* Transactions List */}
        <View className="flex-1 px-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-foreground">Recent Transactions</Text>
            <TouchableOpacity
              className="bg-primary px-4 py-2 rounded-full active:opacity-80"
              onPress={() => Alert.alert("Add Partner", "This would open a form to add a new supply chain partner")}
            >
              <Text className="text-background text-sm font-semibold">+ Partner</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </ScrollView>
        </View>
      </View>

      <TransactionDetailModal />
    </ScreenContainer>
  );
}
