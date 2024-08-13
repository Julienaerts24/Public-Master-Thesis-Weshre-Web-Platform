import * as admin from "firebase-admin";
import * as fs from 'fs';

const crypto = require('crypto');
const path = require('path');
const serviceAccount = require("./firebase-service.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com` // "https://PROJECTID.firebaseio.com"
  });
} catch (e) {}

const db = admin.firestore();

function getFirestoreInstance(): admin.firestore.Firestore {
  return db;
}

function removeEmptyFields(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === "object") {
      removeEmptyFields(obj[key]);
    } else if (obj[key] === null || obj[key] === "" || obj[key] === " ") {
      delete obj[key];
    }
  });
}

const outputDir = 'JSON_files';

const cleanUp = (recordCounters: any) => {
  for (let key in recordCounters) {
    if (key.startsWith('_')) {
      const filePath = path.join(outputDir, `${key}.json`);
      fs.appendFileSync(filePath, '\n]', 'utf8');
    }
  }
};

const writeRecord = (name: string, doc: any, recordCounters: any) => {
  // Ensure the directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, `${name}.json`);

  if (!recordCounters[name] || recordCounters[name] === 0) {
    if (name.startsWith('_')) {
      fs.writeFileSync(filePath, '[\n', 'utf8');
    }
    recordCounters[name] = 0;
  }

  if (name.startsWith('_')) {
    fs.appendFileSync(filePath, (recordCounters[name] > 0 ? ',\n' : '') + JSON.stringify(doc, null, 2), 'utf8');
  }
  recordCounters[name]++;
}

// Function to convert Firebase timestamp to supabase string date type

const convertFirebaseTimeStampToISODate = (timestamp: any): string => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toISOString();
}

const convertFirebaseTimeStampToDate = (timestamp: any): string => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return date.toISOString().split('T')[0]; // Returns the date in YYYY-MM-DD format
}

// Function to verify that a string is a valid ISOString
const isValidISOString = (dateString: string): boolean => {
  // Check if the string matches the ISO 8601 date formats
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  if (!iso8601Regex.test(dateString)) {
      return false;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
      return false; // Invalid date
  }

  return date.toISOString() === dateString;
}

// Function to convert a 20 caracter long document ID, to a 32 hexa decimal string
const convertFirebaseDocumentIdToSupabaseUUID = (firebaseId: string): string => {
  const hash = crypto.createHash('sha256').update(firebaseId).digest('hex');
  
  // Take the first 32 characters of the hash to create a 128-bit number
  const uuidStr = hash.slice(0, 32);
  
  // Format the string as a UUID
  const formattedUuid = [
      uuidStr.slice(0, 8),
      uuidStr.slice(8, 12),
      uuidStr.slice(12, 16),
      uuidStr.slice(16, 20),
      uuidStr.slice(20, 32)
  ].join('-');

  if (firebaseId === 'aXae0i0B29eti63fRdmFfM8jAAw2') {
    console.log('Need to remove manually remove everything link to user:', formattedUuid);
  }

  return formattedUuid;
}

type Language = {
  code: string;
  name: string;
  title: string;
};

const convertLanguagesArray = (languages: (Language | string)[]): string[] => {
  return languages.map(language => {
      if (typeof language === 'string') {
          return language;
      } else {
          return language.name;
      }
  });
}

export { removeEmptyFields, getFirestoreInstance, cleanUp, writeRecord, convertFirebaseTimeStampToDate, convertFirebaseTimeStampToISODate, isValidISOString, convertFirebaseDocumentIdToSupabaseUUID, convertLanguagesArray };
