const DB_STORAGE_URL = "https://curva.net/pndiogo/serverdb/serverdb.php";
//const SERVER_STORAGE_URL = "dbstorage.php";

/* callbacks:
function doneFunc (response, textStatus, jqXHR) 
failFunc is optional: function failFunc(jqXHR, textStatus, errorThrown)
*/

// Post function
/* function _post(url, params, parseJSON = false) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('POST', url);

      //Send the proper header information along with the request
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          let resp = req.response;
          if(parseJSON) {
            resp = JSON.parse(resp);
          } 
            // Resolve the promise with the response text
          resolve(resp);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };
  
      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      
      let string = '';

      for(key in params) {
        if (string.length > 0) {
            string += '&';
        }
        string += key + '=' + params[key];
      }

    console.log(string);
    
      // Make the request
      req.send(string);
    });
  } */


  function post(url, params, parseJSON = false) {

    let string = '';

    for(key in params) {
      if (string.length > 0) {
          string += '&';
      }
      string += key + '=' + params[key];
    }

    console.log(string)

    return fetch(url, {
      method:'POST',
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: string
    }).then(res => {
      if (parseJSON) {
        return res.json();
      } else {
        return res.text();
      }
    });
  }  

// DB init

let dbName = '';

function dbStorageInit (db) {
  dbName = db;
}

/*
get count records starting in offset. Params offset and count are optional and all records are returned if you pass '' on each.
failFunc is optional.
*/

function dbStorageGet(offset, count){
    $('.cards').html('<div class="loader"></div>');
    return post(DB_STORAGE_URL, { 'db': dbName, 'op': 'get', 'offset': offset, 'count': count }, true);
}

/*
add or set a record. Pass id=-1 to add. Returns id of created record.
failFunc is optional.
*/
function dbStorageSet(id, text){
    return post(DB_STORAGE_URL, { 'db': dbName, 'op': 'set', 'id': id, 'text': text });
}

/*
del a record by its id
failFunc is optional.
*/
function dbStorageDel(id){
    return post(DB_STORAGE_URL, { 'db': dbName, 'op': 'del', 'id': id });
}

/*
get total record count
failFunc is optional.
*/
function dbStorageCount(){
    return post(DB_STORAGE_URL, { 'db': dbName, 'op': 'cnt'});
}