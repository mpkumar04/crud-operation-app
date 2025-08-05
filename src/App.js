import { useEffect, useState } from 'react';
import './App.css';
import { Button, EditableText, InputGroup, OverlayToaster } from '@blueprintjs/core';

const AppOverlayToaster = OverlayToaster.create({
  position: 'top',
  className: 'app-overlay-toaster',
});

function App() {


  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response)=>response.json())
    .then((json)=>setUsers(json))
  },[]);

  function addUser(){
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if(name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", 
      {
        method: "POST",
        body:JSON.stringify({
          name,
          email,
          website
        }), 
        headers:{
            "content-type": "application/json; chareset=UTF-8"
        }
      }
    )
      .then((response)=>response.json())
      .then((data)=>{
        setUsers([...users, data]);
        AppOverlayToaster.current?.show({
          message: "User added successfully!",
          intent: "success",
          timeout: 2000,
        });

        setNewName('');
        setNewEmail('');
        setNewWebsite('');

      });
    }
  }


  function onChnageHandler(id, key, value) {
      setUsers((users)=>{
          return users.map(user=>{
            return user.id === id ? {...user, [key]: value }: user;
          })
        }
      )
  }

  function updateUser(id) {
    const user = users.find((user)=> user.id === id)
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
      {
        method: "PUT",
        body:JSON.stringify(user), 
        headers:{
            "content-type": "application/json; chareset=UTF-8"
        }
      }
    )
      .then((response)=>response.json())
      .then((data)=>{
        AppOverlayToaster.current?.show({
          message: "User updated successfully!",
          intent: "success",
          timeout: 2000,
        });
      });

  }

  function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
      {
        method: "DELETE",
      }
    )
      .then((response)=>response.json())
      .then((data)=>{
        setUsers((users)=>{
          return users.filter((user)=>user.id !== id)
        })
        AppOverlayToaster.current?.show({
          message: "User deleted successfully!",
          intent: "success",
          timeout: 2000,
        });
      });

  }


  return (
    <div className="App">
      <table className='bp4-html-table modifier'>
        <thead>
          <th>ID</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>WEBSITE</th>
          <th>ACTION</th>
        </thead>
        <tbody>
          {users.map((user)=>
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><EditableText onChange={(value)=>onChnageHandler(user.id, 'email', value)} value={user.email}/></td>
              <td><EditableText onChange={(value)=>onChnageHandler(user.id, 'website', value)} value={user.website}/></td>
              <td>
                  <Button intent='primary' onClick={()=>updateUser(user.id)}>Update</Button> 
                  <Button intent='Danger' onClick={()=>deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup value={newName} 
              onChange={(e)=>setNewName(e.target.value)} 
              placeholder='Enter Name'/>
            </td>
            <td>
              <InputGroup value={newEmail} 
              onChange={(e)=>setNewEmail(e.target.value)} 
              placeholder='Enter Email'/>
            </td>
            <td>
              <InputGroup value={newWebsite} 
              onChange={(e)=>setNewWebsite(e.target.value)} 
              placeholder='Enter Website'/>
            </td>
            <td>
              <Button intent='success' onClick={addUser} >Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
      
    </div>
  ) 
}


export default App;
