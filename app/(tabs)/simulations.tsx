import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Simulation {
  id: string;
  buildingName: string;
  scenarioType: string;
  carbonReduction: string;
  cost: string;
  roi: string;
  paybackPeriod: string;
  status: "Running" | "Completed" | "Failed";
  date: string;
}

const mockSimulations: Simulation[] = [
  {
    id: "1",
    buildingName: "Headquarters Building",
    scenarioType: "Solar Panels",
    carbonReduction: "-32%",
    cost: "$450,000",
    roi: "185%",
    paybackPeriod: "4.2 years",
    status: "Completed",
    date: "2 days ago",
  },
  {
    id: "2",
    buildingName: "Manufacturing Facility",
    scenarioType: "HVAC Optimization",
    carbonReduction: "-18%",
    cost: "$120,000",
    roi: "220%",
    paybackPeriod: "2.8 years",
    status: "Completed",
    date: "1 week ago",
  },
  {
    id: "3",
    buildingName: "Headquarters Building",
    scenarioType: "Wind Turbines",
    carbonReduction: "Calculating...",
    cost: "Calculating...",
    roi: "Calculating...",
    paybackPeriod: "Calculating...",
    status: "Running",
    date: "Just now",
  },
];

const scenarioTypes = [
  { id: "solar", name: "Solar Panels", icon: "☀️", description: "Rooftop solar installation" },
  { id: "wind", name: "Wind Turbines", icon: "💨", description: "On-site wind energy generation" },
  { id: "hvac", name: "HVAC Optimization", icon: "❄️", description: "Heating and cooling efficiency" },
  { id: "water", name: "Water Conservation", icon: "💧", description: "Rainwater harvesting & recycling" },
  { id: "envelope", name: "Building Envelope", icon: "🏠", description: "Insulation and window upgrades" },
  { id: "custom", name: "Custom Combination", icon: "⚙️", description: "Multiple interventions" },
];

export default function SimulationsScreen() {
  const colors = useColors();
  const [simulations, setSimulations] = useState<Simulation[]>(mockSimulations);
  const [showNewModal, setShowNewModal] = useState(false);

  const SimulationCard = ({ simulation }: { simulation: Simulation }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-4 active:opacity-70"
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground mb-1">{simulation.buildingName}</Text>
          <View className="flex-row items-center">
            <View className="bg-secondary/20 px-3 py-1 rounded-full">
              <Text className="text-xs font-medium text-secondary">{simulation.scenarioType}</Text>
            </View>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          simulation.status === "Completed" ? "bg-success/20" :
          simulation.status === "Running" ? "bg-warning/20" :
          "bg-error/20"
        }`}>
          <Text className={`text-xs font-medium ${
            simulation.status === "Completed" ? "text-success" :
            simulation.status === "Running" ? "text-warning" :
            "text-error"
          }`}>{simulation.status}</Text>
        </View>
      </View>

      {/* Metrics Grid */}
      <View className="flex-row flex-wrap gap-3 mb-3">
        <View className="flex-1 min-w-[45%]">
          <Text className="text-xs text-muted mb-1">Carbon Reduction</Text>
          <Text className="text-base font-bold text-success">{simulation.carbonReduction}</Text>
        </View>
        <View className="flex-1 min-w-[45%]">
          <Text className="text-xs text-muted mb-1">Implementation Cost</Text>
          <Text className="text-base font-semibold text-foreground">{simulation.cost}</Text>
        </View>
        <View className="flex-1 min-w-[45%]">
          <Text className="text-xs text-muted mb-1">ROI</Text>
          <Text className="text-base font-semibold text-foreground">{simulation.roi}</Text>
        </View>
        <View className="flex-1 min-w-[45%]">
          <Text className="text-xs text-muted mb-1">Payback Period</Text>
          <Text className="text-base font-semibold text-foreground">{simulation.paybackPeriod}</Text>
        </View>
      </View>

      {/* Footer */}
      <View className="border-t border-border pt-3">
        <Text className="text-xs text-muted">{simulation.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const NewSimulationModal = () => (
    <Modal
      visible={showNewModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowNewModal(false)}
    >
      <View className="flex-1 bg-background">
        <View className="px-6 pt-6 pb-4 border-b border-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">New Simulation</Text>
            <TouchableOpacity onPress={() => setShowNewModal(false)}>
              <Text className="text-lg text-primary font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-muted mt-2">Choose a scenario to simulate</Text>
        </View>

        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
          {scenarioTypes.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              className="bg-surface rounded-xl p-4 mb-3 flex-row items-center active:opacity-70"
              onPress={() => {
                setShowNewModal(false);
                Alert.alert(
                  "Simulation Started",
                  `Starting ${scenario.name} simulation. This would open the configuration wizard in a full app.`
                );
              }}
            >
              <View className="w-14 h-14 bg-primary/10 rounded-xl items-center justify-center mr-4">
                <Text className="text-3xl">{scenario.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground mb-1">{scenario.name}</Text>
                <Text className="text-sm text-muted">{scenario.description}</Text>
              </View>
              <Text className="text-muted text-xl">›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-3xl font-bold text-foreground">Simulations</Text>
            <TouchableOpacity
              className="bg-primary px-4 py-2 rounded-full active:opacity-80"
              onPress={() => setShowNewModal(true)}
            >
              <Text className="text-background font-semibold">+ New</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-sm text-muted">
            Test sustainability scenarios before investment
          </Text>
        </View>

        {/* Simulations List */}
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {simulations.length > 0 ? (
            simulations.map((simulation) => (
              <SimulationCard key={simulation.id} simulation={simulation} />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-6xl mb-4">⚗️</Text>
              <Text className="text-xl font-bold text-foreground mb-2">No Simulations Yet</Text>
              <Text className="text-base text-muted text-center mb-6">
                Run your first simulation to see carbon reduction potential and ROI
              </Text>
              <TouchableOpacity
                className="bg-primary px-6 py-3 rounded-full active:opacity-80"
                onPress={() => setShowNewModal(true)}
              >
                <Text className="text-background font-semibold">Start Simulation</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <NewSimulationModal />
    </ScreenContainer>
  );
}
