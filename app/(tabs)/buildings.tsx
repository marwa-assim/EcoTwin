import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface Building {
  id: string;
  name: string;
  location: string;
  size: string;
  carbonFootprint: string;
  status: "Active" | "Needs Attention" | "Optimized";
  lastSimulation: string;
}

const mockBuildings: Building[] = [
  {
    id: "1",
    name: "Headquarters Building",
    location: "San Francisco, CA",
    size: "150,000 sq ft",
    carbonFootprint: "850 tons CO₂/year",
    status: "Active",
    lastSimulation: "2 days ago",
  },
  {
    id: "2",
    name: "Manufacturing Facility",
    location: "Austin, TX",
    size: "300,000 sq ft",
    carbonFootprint: "1,200 tons CO₂/year",
    status: "Needs Attention",
    lastSimulation: "1 week ago",
  },
];

export default function BuildingsScreen() {
  const colors = useColors();
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const BuildingCard = ({ building }: { building: Building }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-4 active:opacity-70"
    >
      {/* Building Image Placeholder */}
      <View className="w-full h-32 bg-primary/10 rounded-lg mb-3 items-center justify-center">
        <Text className="text-5xl">🏢</Text>
        <Text className="text-xs text-muted mt-2">3D Digital Twin</Text>
      </View>

      {/* Building Info */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground mb-1">{building.name}</Text>
          <Text className="text-sm text-muted">{building.location}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          building.status === "Active" ? "bg-success/20" :
          building.status === "Optimized" ? "bg-primary/20" :
          "bg-warning/20"
        }`}>
          <Text className={`text-xs font-medium ${
            building.status === "Active" ? "text-success" :
            building.status === "Optimized" ? "text-primary" :
            "text-warning"
          }`}>{building.status}</Text>
        </View>
      </View>

      {/* Metrics */}
      <View className="flex-row gap-4 mb-3">
        <View className="flex-1">
          <Text className="text-xs text-muted mb-1">Size</Text>
          <Text className="text-sm font-semibold text-foreground">{building.size}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-muted mb-1">Carbon Footprint</Text>
          <Text className="text-sm font-semibold text-foreground">{building.carbonFootprint}</Text>
        </View>
      </View>

      <View className="border-t border-border pt-3">
        <Text className="text-xs text-muted">Last simulation: {building.lastSimulation}</Text>
      </View>
    </TouchableOpacity>
  );

  const AddBuildingModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View className="flex-1 bg-background">
        <View className="px-6 pt-6 pb-4 border-b border-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Add Building</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text className="text-lg text-primary font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
          {/* Option 1: Upload Existing */}
          <TouchableOpacity
            className="bg-surface rounded-xl p-6 mb-4 border-2 border-dashed border-border active:border-primary"
            onPress={() => {
              setShowAddModal(false);
              Alert.alert("Upload Building", "File picker would open here to upload building sketches or CAD files");
            }}
          >
            <View className="items-center">
              <Text className="text-5xl mb-3">📄</Text>
              <Text className="text-lg font-bold text-foreground mb-2">Upload Existing Building</Text>
              <Text className="text-sm text-muted text-center">
                Upload building sketches, CAD files, or blueprints. Our AI will convert them to 3D digital twins.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: Design New */}
          <TouchableOpacity
            className="bg-surface rounded-xl p-6 border-2 border-dashed border-border active:border-primary"
            onPress={() => {
              setShowAddModal(false);
              Alert.alert("Design New Building", "Design wizard would open here to create a new building from scratch");
            }}
          >
            <View className="items-center">
              <Text className="text-5xl mb-3">🏗️</Text>
              <Text className="text-lg font-bold text-foreground mb-2">Design New Building</Text>
              <Text className="text-sm text-muted text-center">
                Design a building from scratch. Specify land area, facilities, floors, and sustainability goals.
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <ScreenContainer className="flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground mb-4">My Buildings</Text>
          
          {/* Search Bar */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-lg px-4 py-3 flex-row items-center">
              <Text className="text-muted mr-2">🔍</Text>
              <TextInput
                className="flex-1 text-foreground"
                placeholder="Search buildings..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              className="bg-primary w-12 h-12 rounded-lg items-center justify-center active:opacity-80"
              onPress={() => setShowAddModal(true)}
            >
              <Text className="text-background text-2xl font-light">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buildings List */}
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {filteredBuildings.length > 0 ? (
            filteredBuildings.map((building) => (
              <BuildingCard key={building.id} building={building} />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-6xl mb-4">🏗️</Text>
              <Text className="text-xl font-bold text-foreground mb-2">No Buildings Found</Text>
              <Text className="text-base text-muted text-center mb-6">
                {searchQuery ? "Try a different search term" : "Add your first building to get started"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  className="bg-primary px-6 py-3 rounded-full active:opacity-80"
                  onPress={() => setShowAddModal(true)}
                >
                  <Text className="text-background font-semibold">Add Building</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <AddBuildingModal />
    </ScreenContainer>
  );
}
