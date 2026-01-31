import { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface CompanyProfile {
  companyName: string;
  industry: string;
  buildingCount: number;
  goals: string;
}

export default function HomeScreen() {
  const colors = useColors();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem("companyProfile");
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const StatCard = ({ icon, label, value, trend }: { icon: string; label: string; value: string; trend?: string }) => (
    <View className="bg-surface rounded-2xl p-4 mr-4" style={{ width: 160 }}>
      <Text className="text-3xl mb-2">{icon}</Text>
      <Text className="text-2xl font-bold text-foreground mb-1">{value}</Text>
      <Text className="text-sm text-muted">{label}</Text>
      {trend && (
        <Text className="text-xs text-success mt-1">{trend}</Text>
      )}
    </View>
  );

  const ProjectCard = ({ name, location, status }: { name: string; location: string; status: string }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-3 active:opacity-70"
      onPress={() => router.push("/buildings" as any)}
    >
      <View className="flex-row items-center mb-2">
        <View className="w-12 h-12 bg-primary/20 rounded-lg items-center justify-center mr-3">
          <Text className="text-2xl">🏢</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{name}</Text>
          <Text className="text-sm text-muted">{location}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          status === "Active" ? "bg-success/20" : "bg-warning/20"
        }`}>
          <Text className={`text-xs font-medium ${
            status === "Active" ? "text-success" : "text-warning"
          }`}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const SimulationCard = ({ building, scenario, reduction, date }: { building: string; scenario: string; reduction: string; date: string }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-3 active:opacity-70"
      onPress={() => router.push("/simulations" as any)}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-semibold text-foreground flex-1">{building}</Text>
        <View className="bg-success/20 px-3 py-1 rounded-full">
          <Text className="text-xs font-bold text-success">{reduction}</Text>
        </View>
      </View>
      <Text className="text-sm text-muted mb-1">{scenario}</Text>
      <Text className="text-xs text-muted">{date}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-muted">Welcome back</Text>
            <Text className="text-2xl font-bold text-foreground">
              {profile?.companyName || "Digital Twin Platform"}
            </Text>
          </View>
          <TouchableOpacity
            className="w-10 h-10 bg-surface rounded-full items-center justify-center active:opacity-70"
            onPress={() => router.push("/profile" as any)}
          >
            <Text className="text-xl">👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground px-6 mb-3">Overview</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <StatCard icon="🏢" label="Total Buildings" value={profile?.buildingCount?.toString() || "0"} />
            <StatCard icon="🌱" label="Carbon Footprint" value="1,250t" trend="↓ 15% this month" />
            <StatCard icon="⚗️" label="Active Simulations" value="3" />
            <StatCard icon="🔗" label="Blockchain Txns" value="127" trend="✓ All verified" />
          </ScrollView>
        </View>

        {/* Active Projects */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-foreground">Active Projects</Text>
            <TouchableOpacity onPress={() => router.push("/buildings" as any)}>
              <Text className="text-sm font-medium text-primary">View All</Text>
            </TouchableOpacity>
          </View>
          
          {profile?.buildingCount && profile.buildingCount > 0 ? (
            <>
              <ProjectCard name="Headquarters Building" location="San Francisco, CA" status="Active" />
              <ProjectCard name="Manufacturing Facility" location="Austin, TX" status="Optimizing" />
            </>
          ) : (
            <View className="bg-surface rounded-xl p-6 items-center">
              <Text className="text-6xl mb-3">🏗️</Text>
              <Text className="text-base font-semibold text-foreground mb-2">No Buildings Yet</Text>
              <Text className="text-sm text-muted text-center mb-4">
                Add your first building to start creating digital twins and running simulations
              </Text>
              <TouchableOpacity
                className="bg-primary px-6 py-3 rounded-full active:opacity-80"
                onPress={() => router.push("/buildings" as any)}
              >
                <Text className="text-background font-semibold">Add Building</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent Simulations */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-foreground">Recent Simulations</Text>
            <TouchableOpacity onPress={() => router.push("/simulations" as any)}>
              <Text className="text-sm font-medium text-primary">View All</Text>
            </TouchableOpacity>
          </View>
          
          <SimulationCard
            building="Headquarters Building"
            scenario="Solar Panel Installation"
            reduction="-32% CO₂"
            date="2 days ago"
          />
          <SimulationCard
            building="Manufacturing Facility"
            scenario="HVAC Optimization"
            reduction="-18% CO₂"
            date="1 week ago"
          />
        </View>

        {/* Insights */}
        <View className="px-6">
          <Text className="text-lg font-bold text-foreground mb-3">AI Insights</Text>
          <View className="bg-secondary/10 border-l-4 border-secondary rounded-lg p-4">
            <View className="flex-row items-start">
              <Text className="text-2xl mr-3">💡</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  Optimization Opportunity Detected
                </Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Based on your building's energy consumption patterns, adding solar panels could reduce your carbon footprint by 35% and provide ROI within 4.2 years.
                </Text>
                <TouchableOpacity className="mt-3" onPress={() => router.push("/simulations" as any)}>
                  <Text className="text-sm font-semibold text-secondary">Run Simulation →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
