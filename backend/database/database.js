/* Module with demo functions for interacting with a Firestore database in a Firebase project 
 * requires firebase installed, including the firebase-functions and firebase-admin modules */
module.exports = { readDB, writeDB }

const functions = require('firebase-functions');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

const db = getFirestore();

async function readDB(collection) {
    const data = await db.collection(collection).get();
    let result = "";
    data.forEach((doc) =>  {
	result += doc.id + " => " + JSON.stringify(doc.data()) + "\n";
    });
    return result;
}

async function writeDB(collection, docName, jsonObj) {
    const doc = db.collection(collection).doc(docName);
    await doc.set(jsonObj);
    return "Written Successfully";
}
