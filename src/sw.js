importScripts('./ngsw-worker.js');

DYNAMIC_CACHE_VERSION = "V1";

self.addEventListener('sync', (event) => {
   if(event.tag === 'post-data'){
      event.waitUntil(getDataAndSend());
   }
});

function addData(userName) {
  console.log
  //indexDb
  let obj = {
    name: userName,
  };
  fetch('https://dev-taramsys-poc.herokuapp.com/customer', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },    
    body: JSON.stringify(obj),
  })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}

function getDataAndSend() {
    let db;
    const request = indexedDB.open('my-db');
    request.onerror = (event) => {
      console.log('Please allow my web app to use IndexedDB 😃>>>👻');
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      getData(db);
    };
  }
  
  function getData(db) {
    const transaction = db.transaction(['user-store']);
    const objectStore = transaction.objectStore('user-store');
    const request = objectStore.get('name');
    request.onerror = (event) => {
      // Handle errors!
    };
    request.onsuccess = (event) => {
      // Do something with the request.result!
      addData(request.result);
      console.log('Name of the user is ' + request.result);
    }
    // objectStore.getAll()
    // .then((data) => {
    //    data.filter(e => !e.synced)
    //    .map( person => {
    //      addData(person.name)
    //    }); 
    // });
    
}; 

