importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {  
  if(event.tag === 'post-data'){      
      event.waitUntil(setTimeout(() =>{getDataAndSend('post')},500));
  }

  if(event.tag === 'delete-data'){      
    event.waitUntil(setTimeout(() =>{getDataAndSend('delete')},500));
  }

  if(event.tag === 'edit-data'){      
    event.waitUntil(setTimeout(() =>{getDataAndSend('edit')},500));
  }

});

function addData(obj) {  
  fetch('https://dev-taramsys-poc.herokuapp.com/addcustomer', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },    
    body: JSON.stringify(obj),
  })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}

function removeData(obj) {  
  return fetch('https://dev-taramsys-poc.herokuapp.com/customer/delete', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },    
    body: JSON.stringify(obj),
  })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}

function updateData(obj) {
  return fetch('https://dev-taramsys-poc.herokuapp.com/customer/update', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },    
    body: JSON.stringify(obj),
  })
    .then(() => Promise.resolve())
    .catch(() => Promise.reject());
}

function getDataAndSend(type) {
    let db;
    const request = indexedDB.open('my-db');
    request.onerror = (event) => {
      console.log('Please allow my web app to use IndexedDB 😃>>>👻');
    };
    request.onsuccess = (event) => {
      db = event.target.result;
      if(type == 'post'){
        postData(db);
      }else if(type == 'delete'){
        deleteData(db);
      }else if(type == 'edit'){
        editData(db);
      }      
    };
  }
  
  function postData(db) {
    const transaction = db.transaction(['customer-list-store'],'readwrite');
    const objectStore = transaction.objectStore('customer-list-store');
    const request = objectStore.getAll();
    request.onerror = (event) => {
      // Handle errors!
      console.log('db error')
    };
    request.onsuccess = (event) => { 
      for(let key in request.result){
        if(request.result.hasOwnProperty(key)){
          let val = request.result[key];         
          if(val.synced == false){
            let valchanged = val;
            valchanged.synced = true;
            objectStore.put(valchanged,valchanged._id);
            console.log('adding')
            addData({"name":val.name});               
          }
        }
      }
     
    }
  }

  function deleteData(db) {
    const transaction = db.transaction(['customer-sync-store'],'readwrite');
    const objectStore = transaction.objectStore('customer-sync-store');
    const request = objectStore.get('delete');
    request.onerror = (event) => {
      // Handle errors!
      console.log('db error')
    };
    request.onsuccess = (event) => { 
      for(let person of request.result){
        console.log('deleting from server');
        removeData({"id":person._id});       
      }
      objectStore.delete('delete');
    }
  }

  function editData(db) {
    const transaction = db.transaction(['customer-sync-store'],'readwrite');
    const objectStore = transaction.objectStore('customer-sync-store');
    const request = objectStore.get('edit');
    request.onerror = (event) => {
      // Handle errors!
      console.log('db error')
    };
    request.onsuccess = (event) => { 
      for(let person of request.result){
        console.log('updating to server');
        updateData({"id":person._id,"name":person.name});       
      }
      objectStore.delete('edit');
    }
  }

