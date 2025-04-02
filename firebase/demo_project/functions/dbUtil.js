/* File containing utility functions to work with the Firestore database */
module.exports = { dbGetCollection, dbOpenCollection, dbGetCollectionDoc, dbSetCollectionDoc,
		    dbGetDocument, dbSetDocument,
		    dbGetPage, dbGetPages, dbSetPage, 
		    dbGetWord, dbSetWord,
		    dbGetLastID, dbSetLastID,
		    dbGetPageVec, dbSetPageVec,
		    dbGetPageMetadata, dbSetPageMetadata,
		    dbGetPageContent, dbSetPageContent };

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

/** Returns an open database collection which can be used later */
function dbOpenCollection(colName) {
    return db.collection(colName);
}

/** Returns a document from a given open collection */
async function dbGetCollectionDoc(openCol, docName) {
    const data = await openCol.doc(docName).get();
    return data;
}

/** Sets data to a document in a given open collection */
async function dbSetCollectionDoc(openCol, docName, docObject) {
    await openCol.doc(docName).set(docObject);
    return true;
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

/* --- Project-specific database functions */

/* Page Functions */

async function dbGetPage(pageUrl) {
    let result = await dbGetDocument("pages", pageUrl);
    return result;
}

async function dbGetPages(pageSite) {
    let result = await db.collection("pages").where("pageSite", "==", pageSite).get();
    return result;
}

async function dbSetPage(pageUrl, pageSite, dateAdded, pageTitle, pageID) {
    let docObj = {
    	pageSite: pageSite,
	dateAdded: dateAdded,
	pageTitle: pageTitle,
	pageID: pageID
    };
    await dbSetDocument("pages", pageUrl, docObj);
}

/* Word Functions */

async function dbGetWord(word) {
    let result = await dbGetDocument("words", word);
    return result;
}

async function dbSetWord(word, vec) {
    await dbSetDocument("words", word, {vec: vec});
}

/* Database Metadata Functions */

async function dbGetLastID() {
    let result = await dbGetDocument("dbMetadata", "dbMetadata");
    return result.data().lastPageID;
}

async function dbSetLastID(newID) {
    await dbSetDocument("dbMetadata", "dbMetadata", { lastPageID: newID });
}

/* Page Specific Functions */

async function dbGetPageVec(pageID) {
    let result = await dbGetDocument("pageVec", pageID);
    result.matrix = JSON.parse(result.matrix);
    return result;
}

async function dbSetPageVec(pageID, matrix, percentKnown, nextID) {
    let docObj = {
	matrix: matrix,
	percentKnowns: percentKnown,
	nextID: nextID
    };
    await dbSetDocument("pageVec", pageID, docObj);
}

async function dbGetPageMetadata(pageID) {
    let result = await dbGetDocument("pageMetadata", pageID);
    return result;
}

async function dbSetPageMetadata(pageID, termFrequency) {
    await dbSetDocument("pageMetadata", pageID, {termFrequency: termFrequency});
}

async function dbGetPageContent(pageID) {
    let result = await dbGetDocument("pageContent", pageID);
    return result;
}

async function dbSetPageContent(pageID, processedPage) {
    await dbSetDocument("pageContent", pageID, {processedPage: processedPage});
}
