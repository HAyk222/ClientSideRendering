const state = {
	update: false,
	updateInp: '',
	addInp: '',
	editDesable: false
}
const content = document.querySelector(".todo-content");
const url = "http://localhost:3000/api/todos"
let db = []

const fetchData = ( href ) => {
	fetch( href, { method: "GET" } )
    .then( response => response.json() )
    .then( data => {
    	data.forEach( item => db.push(item) )
    	return	renderUI( data )
    } )
    .catch( error => console.log( error ) );
}

fetchData( url )

addTodo = () => {
	event.preventDefault()
	
	state.addInp !== "" && fetch( url, {
    	method: "POST",
    	body: JSON.stringify({ todo: document.querySelector(".formInput").value, completed: false }),
    	headers: {"Content-Type": "application/json"}
    })
    .then( () => {fetchData( url ); state.addInp = ""} )
    .catch( error => console.log( error ) );
}

deleteTodo = id => {
	fetch( `${url}/${id}`,{ method: "DELETE" } )
    .then( data => fetchData( url ) )
    .catch( error => console.log(error) )
}

editTodo = (id, todo) => {
	
	console.log(state.editDesable)
	!state.editDesable && fetch( `${url}/${id}`,{
		method: 'PUT',
    	body: JSON.stringify({ todo, completed: true  }),
    	headers: {"Content-Type": "application/json"}
	} )
	.then( data => {fetchData( url ); state.updateInp = todo} )
    .catch( error => console.log(error) );

    state.editDesable = true
}

writeTodo = e => {
	state.addInp = e.target.value
}

changeUpdateInp = e => state.updateInp = e.target.value

updateTodo = id => {
	event.preventDefault()
	fetch( `${url}/${id}`,{
		method: 'PUT',
    	body: JSON.stringify({ todo: state.updateInp, completed: false  }),
    	headers: {"Content-Type": "application/json"}
	} )
	.then( data => {fetchData( url )} )
    .catch( error => console.log(error) );
    state.editDesable = false
}

const todo = ({ item }) => {
	return `<li>
		${item.completed ? `<form class="todo-form" onsubmit="updateTodo(${item.id})" >
				<input 
					class="formInput" 
					type="text" 
					name="todo" 
					onkeyup="changeUpdateInp(event)"
					value="${item.todo}" 
					autofocus
					  />
				<input 
					class="add"   
					type="submit" 
					value="Update Todo" 
					 />
			</form>` :  `<span class="text">${item.todo}</span>
			<a class="edit" href="#" onclick="editTodo(${item.id}, '${item.todo}')">edit</a>
			<a class="delete" href="#" onclick="deleteTodo(${item.id})">delete</a>`}
	</li>`
}

const listTodo = ({ json }) => json.map( item => todo({ item })).join('\n')

const renderUI = ( json ) => {
	content.innerHTML = `<form class="todo-form" onsubmit="addTodo()" >
				<input 
					class="formInput" 
					type="text" 
					name="todo" 
					value="" 
					onkeyup="writeTodo(event)"
					  />
				<input 
					class="add"   
					type="submit" 
					value="Add Todo" 
					 />
			</form>
			</div>
			<ul>
				${listTodo({ json })}
			</ul>
			<div class="todo">
				<span>Todo</span>
				<span class="count"> ${json.length} </span>
			</div>`
}