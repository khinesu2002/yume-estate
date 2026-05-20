import type { Agent, LeadRecord, PropertyRecord, TeamMemberRecord } from "@/lib/types";

export function seedTeamMembers(agent: Agent): TeamMemberRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: agent.teamMemberId || agent.id || "team-admin",
      name: agent.name || "Admin",
      phone: agent.phone || "+95 9 000 000 000",
      role: "admin",
      status: "active",
      firebaseUid: agent.id,
      notes: "Owner/admin account",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "team-1",
      name: "Aung",
      phone: "+95 9 777 111 222",
      role: "agent",
      status: "active",
      firebaseUid: "",
      notes: "Showing specialist",
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function seedProperties(agentName: string): PropertyRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: "seed-1",
      code: "MMR-001",
      listingType: "sale",
      propertyType: "condo",
      landTitleType: "none",
      developmentStatus: "developed",
      location: "Yankin, Yangon",
      price: "350000000",
      currency: "MMK",
      bedrooms: "2",
      bathrooms: "2",
      size: "1050 sqft",
      description: "Bright condo near main road, good for family buyers.",
      status: "available",
      visibility: "private",
      internalNotes: "Owner prefers serious buyers and weekday viewings.",
      owner: { name: "Daw May", phone: "+95 9 4200 11122", notes: "Call after 10 AM." },
      media: [],
      createdBy: agentName,
      createdAt: now,
      updatedAt: now
    },
    {
      id: "seed-2",
      code: "MMR-002",
      listingType: "rent",
      propertyType: "house",
      landTitleType: "grant",
      developmentStatus: "developed",
      location: "Bahan, Yangon",
      price: "2800000",
      currency: "MMK",
      bedrooms: "4",
      bathrooms: "3",
      size: "45 x 60 ft",
      description: "Standalone house with parking and quiet street access.",
      status: "pending",
      visibility: "public",
      internalNotes: "Tenant offer is being discussed.",
      owner: { name: "U Aung", phone: "+95 9 5000 77889", notes: "Owner lives overseas. Use Viber." },
      media: [],
      createdBy: agentName,
      createdAt: now,
      updatedAt: now
    },
    {
      id: "seed-3",
      code: "MMR-003",
      listingType: "sale",
      propertyType: "land",
      landTitleType: "permit",
      developmentStatus: "not_developed",
      location: "Thanlyin, Yangon Region",
      price: "180000000",
      currency: "MMK",
      bedrooms: "",
      bathrooms: "",
      size: "80 x 120 ft",
      description: "Residential land parcel near developing road.",
      status: "available",
      visibility: "private",
      internalNotes: "Check title copy before sharing with buyer.",
      owner: { name: "Daw Khin", phone: "+95 9 3100 44455", notes: "Wants quick sale if cash buyer." },
      media: [],
      createdBy: agentName,
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function seedLeads(agentName: string): LeadRecord[] {
  const now = new Date().toISOString();
  return [
    {
      id: "lead-1",
      clientName: "Ko Hein",
      phone: "+95 9 777 222 333",
      source: "facebook",
      status: "new",
      interestedPropertyId: "seed-1",
      notes: "Looking for condo around Yankin or Bahan.",
      assignedAgent: agentName,
      createdAt: now,
      updatedAt: now
    }
  ];
}
