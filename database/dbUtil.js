/* File containing utility functions to work with the Firestore database */
module.exports = { dbGetCollection, dbGetDocument, dbSetDocument }

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

const db = getFirestore();

/* --- General Get/Set database functions --- */

/** Returns the contents of the given collection (colName) as an array of document objects */
async function dbGetCollection(colName) {
    const data = await db.collection(colName).get();
    return data;
}

/** Returns the contents of the given document (docName) within the given collection (colName) as a document object */
async function dbGetDocument(colName, docName) {
    const doc = await db.collection(colName).doc(docName).get();
    return doc;
}

/** Sets the given document (docName) within the given collection (colName) to the given JavaScript Object */
async function dbSetDocument(colName, docName, docObject) {
    const doc = db.collection(colName).doc(docName);
    await doc.set(docObject);
    return true;
}

