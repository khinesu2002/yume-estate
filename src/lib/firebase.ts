import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { collection, doc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type {
  AccessLogRecord,
  Agent,
  ClientRequirementRecord,
  LeadRecord,
  PropertyMedia,
  PropertyRecord,
  RevealRequestRecord,
  SensitiveAccessLogRecord,
  ShowingRecord,
  TeamMemberRecord
} from "@/lib/types";
import { makeId } from "@/lib/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.appId
  );
}

function getFirebaseServices() {
  if (!isFirebaseConfigured()) return null;

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return {
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app)
  };
}

async function ensureFirebaseUser() {
  const services = getFirebaseServices();
  if (!services) return null;

  if (services.auth.currentUser) return { services, user: services.auth.currentUser };
  const credential = await signInAnonymously(services.auth);
  return { services, user: credential.user };
}

export async function saveAgentToFirebase(agent: Agent): Promise<Agent> {
  const session = await ensureFirebaseUser();
  if (!session) return agent;

  const cloudAgent = { ...agent, id: session.user.uid };
  await setDoc(doc(session.services.db, "agents", cloudAgent.id), {
    ...cloudAgent,
    updatedAt: new Date().toISOString()
  });

  return cloudAgent;
}

export async function loadPropertiesFromFirebase(): Promise<PropertyRecord[]> {
  const session = await ensureFirebaseUser();
  if (!session) return [];

  const snapshot = await getDocs(query(collection(session.services.db, "properties"), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((entry) => entry.data() as PropertyRecord);
}

async function loadCollection<T>(collectionName: string): Promise<T[]> {
  const session = await ensureFirebaseUser();
  if (!session) return [];

  const snapshot = await getDocs(query(collection(session.services.db, collectionName), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((entry) => entry.data() as T);
}

async function saveCollection<T extends { id: string }>(collectionName: string, records: T[]) {
  const session = await ensureFirebaseUser();
  if (!session) return;

  await Promise.all(records.map((record) => setDoc(doc(session.services.db, collectionName, record.id), record)));
}

export async function savePropertyToFirebase(property: PropertyRecord) {
  const session = await ensureFirebaseUser();
  if (!session) return;

  await setDoc(doc(session.services.db, "properties", property.id), property);
}

export async function savePropertiesToFirebase(properties: PropertyRecord[]) {
  await saveCollection("properties", properties);
}

export async function loadLeadsFromFirebase(): Promise<LeadRecord[]> {
  return loadCollection<LeadRecord>("leads");
}

export async function saveLeadsToFirebase(leads: LeadRecord[]) {
  await saveCollection("leads", leads);
}

export async function loadRequirementsFromFirebase(): Promise<ClientRequirementRecord[]> {
  return loadCollection<ClientRequirementRecord>("clientRequirements");
}

export async function saveRequirementsToFirebase(requirements: ClientRequirementRecord[]) {
  await saveCollection("clientRequirements", requirements);
}

export async function loadShowingsFromFirebase(): Promise<ShowingRecord[]> {
  return loadCollection<ShowingRecord>("showings");
}

export async function saveShowingsToFirebase(showings: ShowingRecord[]) {
  await saveCollection("showings", showings);
}

export async function loadTeamMembersFromFirebase(): Promise<TeamMemberRecord[]> {
  return loadCollection<TeamMemberRecord>("teamMembers");
}

export async function saveTeamMembersToFirebase(teamMembers: TeamMemberRecord[]) {
  await saveCollection("teamMembers", teamMembers);
}

export async function loadAccessLogsFromFirebase(): Promise<AccessLogRecord[]> {
  return loadCollection<AccessLogRecord>("accessLogs");
}

export async function saveAccessLogsToFirebase(accessLogs: AccessLogRecord[]) {
  await saveCollection("accessLogs", accessLogs);
}

export async function loadSensitiveAccessLogsFromFirebase(): Promise<SensitiveAccessLogRecord[]> {
  return loadCollection<SensitiveAccessLogRecord>("sensitiveAccessLogs");
}

export async function saveSensitiveAccessLogsToFirebase(logs: SensitiveAccessLogRecord[]) {
  await saveCollection("sensitiveAccessLogs", logs);
}

export async function loadRevealRequestsFromFirebase(): Promise<RevealRequestRecord[]> {
  return loadCollection<RevealRequestRecord>("revealRequests");
}

export async function saveRevealRequestsToFirebase(requests: RevealRequestRecord[]) {
  await saveCollection("revealRequests", requests);
}

export async function uploadPropertyFiles(propertyId: string, files: FileList | null): Promise<PropertyMedia[]> {
  if (!files?.length) return [];

  const session = await ensureFirebaseUser();
  if (!session) {
    return Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<PropertyMedia>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: makeId("media"),
                url: String(reader.result),
                name: file.name,
                caption: ""
              });
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          })
      )
    );
  }

  return Promise.all(
    Array.from(files).map(async (file) => {
      const mediaId = makeId("media");
      const storagePath = `properties/${propertyId}/${mediaId}-${file.name}`;
      const storageRef = ref(session.services.storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      return {
        id: mediaId,
        url,
        name: file.name,
        caption: ""
      };
    })
  );
}
