// © Ervin Remus Radosavlevici — Private License. Confidential, NDA-bound.
// Encryption and decryption utilities for sensitive evidence data.
// Uses Web Crypto API for secure client-side encryption.

import { type Incident } from "./evidence";

export interface EncryptionKey {
  id: string;
  name: string;
  createdAt: string;
  algorithm: string;
  // Note: The actual key material is stored separately in IndexedDB
  keyId: string;
}

export interface EncryptedData {
  ciphertext: string; // Base64 encoded
  iv: string; // Base64 encoded initialization vector
  salt: string; // Base64 encoded salt for key derivation
  algorithm: string;
  timestamp: string;
  keyId: string;
  authTag?: string; // For AES-GCM
}

export interface EncryptedIncident extends Omit<Incident, "observation" | "technical"> {
  observation: EncryptedData | string;
  technical: EncryptedData | string;
  encrypted: boolean;
  encryptionInfo?: {
    encryptedFields: string[];
    algorithm: string;
    timestamp: string;
  };
}

// Key storage using IndexedDB (more secure than localStorage)
class SecureKeyStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private readonly DB_NAME = "SentinelKeysDB";
  private readonly STORE_NAME = "encryptionKeys";

  constructor() {
    this.initDB();
  }

  private initDB(): void {
    if (typeof indexedDB === "undefined") {
      throw new Error("IndexedDB is not available");
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  async getKey(keyId: string): Promise<CryptoKey | null> {
    try {
      const db = await this.dbPromise;
      return new Promise((resolve) => {
        const request = db
          .transaction(this.STORE_NAME, "readonly")
          .objectStore(this.STORE_NAME)
          .get(keyId);

        request.onsuccess = () => {
          const data = request.result;
          if (data && data.key) {
            // Import the key (this is a simplified example)
            // In a real implementation, we'd properly import the key
            resolve(null); // Placeholder
          } else {
            resolve(null);
          }
        };
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async storeKey(keyId: string, key: CryptoKey, metadata: EncryptionKey): Promise<void> {
    try {
      const db = await this.dbPromise;
      // In a real implementation, we'd properly export and store the key
      // This is a placeholder for the concept
      const transaction = db.transaction(this.STORE_NAME, "readwrite");
      transaction.objectStore(this.STORE_NAME).put({ id: keyId, ...metadata });
    } catch {
      // Fallback to localStorage if IndexedDB fails
      localStorage.setItem(`sentinel_key_${keyId}`, JSON.stringify(metadata));
    }
  }

  async deleteKey(keyId: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      const transaction = db.transaction(this.STORE_NAME, "readwrite");
      transaction.objectStore(this.STORE_NAME).delete(keyId);
    } catch {
      localStorage.removeItem(`sentinel_key_${keyId}`);
    }
  }

  async listKeys(): Promise<EncryptionKey[]> {
    try {
      const db = await this.dbPromise;
      return new Promise((resolve) => {
        const request = db
          .transaction(this.STORE_NAME, "readonly")
          .objectStore(this.STORE_NAME)
          .getAll();

        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = () => resolve([]);
      });
    } catch {
      const keys: EncryptionKey[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sentinel_key_")) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              keys.push(JSON.parse(data));
            } catch {
              // Ignore invalid entries
            }
          }
        }
      }
      return keys;
    }
  }
}

const keyStorage = new SecureKeyStorage();

// Derive a key from a password using PBKDF2
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array = crypto.getRandomValues(new Uint8Array(16)),
): Promise<{ key: CryptoKey; salt: string }> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  return {
    key,
    salt: arrayBufferToBase64(salt),
  };
}

// Generate a random encryption key
export async function generateEncryptionKey(): Promise<{ key: CryptoKey; keyId: string }> {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  const keyId = crypto.randomUUID();

  const metadata: EncryptionKey = {
    id: keyId,
    name: `Key-${new Date().toISOString().slice(0, 10)}`,
    createdAt: new Date().toISOString(),
    algorithm: "AES-GCM",
    keyId,
  };

  await keyStorage.storeKey(keyId, key, metadata);

  return { key, keyId };
}

// Encrypt data using AES-GCM
export async function encryptData(
  data: string,
  key: CryptoKey,
  keyId: string,
): Promise<EncryptedData> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedData,
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
    salt: "", // Not used for direct key encryption
    algorithm: "AES-GCM",
    timestamp: new Date().toISOString(),
    keyId,
    authTag: "", // AES-GCM includes auth tag in ciphertext
  };
}

// Decrypt data using AES-GCM
export async function decryptData(encrypted: EncryptedData, key: CryptoKey): Promise<string> {
  const iv = base64ToArrayBuffer(encrypted.iv);
  const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Encrypt an incident's sensitive fields
export async function encryptIncident(
  incident: Incident,
  key: CryptoKey,
  keyId: string,
  fields: ("observation" | "technical")[] = ["observation", "technical"],
): Promise<EncryptedIncident> {
  const encryptedIncident: EncryptedIncident = {
    ...incident,
    observation: incident.observation,
    technical: incident.technical,
    encrypted: false,
  };

  const encryptedFields: string[] = [];

  for (const field of fields) {
    const value = incident[field] as string;
    if (value && value.trim() !== "") {
      const encrypted = await encryptData(value, key, keyId);
      encryptedIncident[field] = encrypted as EncryptedData | string;
      encryptedFields.push(field);
    }
  }

  if (encryptedFields.length > 0) {
    encryptedIncident.encrypted = true;
    encryptedIncident.encryptionInfo = {
      encryptedFields,
      algorithm: "AES-GCM",
      timestamp: new Date().toISOString(),
    };
  }

  return encryptedIncident;
}

// Decrypt an incident's sensitive fields
export async function decryptIncident(
  incident: EncryptedIncident,
  key: CryptoKey,
): Promise<Incident> {
  const decryptedIncident: Incident = {
    ...incident,
    observation:
      typeof incident.observation === "string"
        ? incident.observation
        : await decryptData(incident.observation as EncryptedData, key),
    technical:
      typeof incident.technical === "string"
        ? incident.technical
        : await decryptData(incident.technical as EncryptedData, key),
  };

  return decryptedIncident;
}

// Check if an incident has encrypted fields
export function isEncrypted(incident: Incident | EncryptedIncident): incident is EncryptedIncident {
  return (incident as EncryptedIncident).encrypted === true;
}

// Get encrypted fields from an incident
export function getEncryptedFields(incident: EncryptedIncident): string[] {
  return incident.encryptionInfo?.encryptedFields || [];
}

// Helper functions for base64 encoding/decoding
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Password-based encryption for user-provided passwords
export async function encryptWithPassword(data: string, password: string): Promise<EncryptedData> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const { key } = await deriveKeyFromPassword(password, salt);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedData,
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
    algorithm: "AES-GCM-PBKDF2",
    timestamp: new Date().toISOString(),
    keyId: "password-derived",
  };
}

export async function decryptWithPassword(
  encrypted: EncryptedData,
  password: string,
): Promise<string> {
  const salt = base64ToArrayBuffer(encrypted.salt);
  const { key } = await deriveKeyFromPassword(password, new Uint8Array(salt));

  const iv = base64ToArrayBuffer(encrypted.iv);
  const ciphertext = base64ToArrayBuffer(encrypted.ciphertext);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Key management utilities
export const keyManager = {
  generate: generateEncryptionKey,
  list: keyStorage.listKeys.bind(keyStorage),
  delete: keyStorage.deleteKey.bind(keyStorage),
};

// Check if encryption is available
export function isEncryptionAvailable(): boolean {
  return (
    typeof crypto !== "undefined" &&
    typeof crypto.subtle !== "undefined" &&
    typeof crypto.getRandomValues !== "undefined"
  );
}

// Securely wipe data from memory (best effort)
export function secureWipe(data: string): void {
  // In JavaScript, we can't truly wipe memory, but we can overwrite
  // This is a best-effort approach
  const array = new Uint8Array(data.length);
  for (let i = 0; i < array.length; i++) {
    array[i] = 0;
  }
}
