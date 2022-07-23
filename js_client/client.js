const contentContainer = document.getElementById('content-container')
const loginForm = document.getElementById('login-form')
const searchForm = document.getElementById('search-form')
const baseEndpoint = 'http://127.0.0.1:8000/api'
if (loginForm){
    // handle this login form
    loginForm.addEventListener('submit', handleLogin)
}
if (searchForm){
    // handle this search form
    searchForm.addEventListener('submit', handleSearch)
}

function handleLogin(event){
    event.preventDefault()
    const loginEndpoint = `${baseEndpoint}/token/`  // f strings in javascript
    let loginFormData = new FormData(loginForm)
    let loginObjectData = Object.fromEntries(loginFormData)
    let bodyStr = JSON.stringify(loginObjectData)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyStr
    }
    fetch(loginEndpoint, options)  // requests.post  // this returns a "promise"
    .then(response => {  // handles the promise
        console.log(response)
        return response.json()
    })
    .then(authData => {
    handleAuthData(authData, getProductList)
    })
    .catch(err => {
        console.log('err', err)
    })
}

function handleSearch(event){
    event.preventDefault()
    let formData = new FormData(searchForm)
    let data = Object.fromEntries(formData)
    let searchParams = new URLSearchParams(data)
    const endpoint = `${baseEndpoint}/search/?${searchParams}`  // f strings in javascript
    const headers = {
        'Content-Type': 'application/json'
    }
    const authToken = localStorage.getItem('access')
    if(authToken){
        headers['Authorization'] = `Bearer $(authToken)`
    }
    const options = {
        method: 'GET',
        headers: headers
    }
    fetch(endpoint, options)  // requests.post  // this returns a "promise"
    .then(response => {  // handles the promise
        console.log(response)
        return response.json()
    })
    .then(data => {
       writeToContainer(data)
    })
    .catch(err => {
        console.log('err', err)
    })
}

function handleAuthData(authData, callback){
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)
    if (callback){
        callback()
    }
}

function writeToContainer(data){
    if (contentContainer){
        contentContainer.innerHTML = '<pre>' + JSON.stringify(data, null, 4  /* formatting stuff */) + '</pre>'
    }
}

function getFetchOptions(method, body){
    return {
        method: method === null ? 'GET': method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        body: body ? body: null
    }
}

function isTokenNotValid(jsonData){
    if(jsonData.code && jsonData.code === 'token_not_valid'){
        // run a refresh token fetch
        alert('Please login again')
        return false
    }
    return true
}

function validateJWTToken(){
    // fetch
    const endpoint = `${baseEndpoint}/token/verify/`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: localStorage.getItem('access')
        })
    }
    fetch(endpoint, options)
    .then(response => {
        return response.json()
    })
    .then(x => {
        // refresh token
    })
}

function getProductList(){
    const endpoint = `${baseEndpoint}/products/`
    const options = getFetchOptions()
    fetch(endpoint, options)
    .then(response => {
        return response.json()
    })
    .then(data => {
    if (isTokenNotValid(data)){
        writeToContainer(data)
    }
    })
}

validateJWTToken()


const searchClient = algoliasearch('D7VPUZCJFP', 'c9595a0449eb1994dd21b1e0b5a10805');

const search = instantsearch({
  indexName: 'cfe_Product',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.refinementList({
    container: '#user-list',
    attribute: 'user'
  }),

  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements'
  }),

  instantsearch.widgets.refinementList({
    container: '#public-list',
    attribute: 'public'
  }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
        item: `
        <div>
            <div>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</div>
            <div>{{#helpers.highlight}}{ "attribute": "body" }{{/helpers.highlight}}</div>
            <p>{{ user }}</p><p>{{ price }}
        </div>`
    }
  })
]);

search.start();


