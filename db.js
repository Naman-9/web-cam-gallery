// open db
// create objectStore
// transaction

let db;
let openRequest = indexedDB.open("myDatabase"); // creates Database
openRequest.addEventListener("success", (e) => {
    console.log("DB Success");
    db = openRequest.result;
});


openRequest.addEventListener("error", (e) => {
    console.log("DB Error");

});

openRequest.addEventListener("upgradeneeded", (e) => {   // triggered even when creating first time.
    console.log("DB Upgraded and also for initial DB createion ");
    db = openRequest.result;   // access to new data base

    db.createObjectStore("video", {keyPath: "id"});
    db.createObjectStore("image", {keyPath: "id"});
})