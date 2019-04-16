import React, { Component } from 'react';
import firebase from "firebase";
import FileUpload from "./FileUpload";

import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user=>{
      this.setState({ user });
    })

    firebase.database().ref('pictures').on('child_added', snapshot =>{
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
  }


  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
    .then(result => console.log(`${result.user.email} ha iniciado sesión`))
    .catch(error => console.error(`Error ${error.code}: ${error.message}`))
  }
  
  handleLogout(){
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha cerrado sesión`))
    .catch(error => console.error(`Error ${error.code}: ${error.message}`))
  }

  handleUpload(event){
    console.log("Subir foto");
    
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    
    task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
            uploadValue: percentage
        })
    }, error => { 
        console.error(error.message)
    },()=>{
        storageRef.getDownloadURL()
        .then(url => {
          const record  ={
            photoURL: this.state.user.photoURL,
            displayName: this.state.user.displayName,
            image: url
          }

          const dbRef = firebase.database().ref('pictures');
          const newPicture = dbRef.push();
          newPicture.set(record);    
        });

    });
  }


  renderLoginButton(){
    // Si el usuario está logueado
    if(this.state.user){
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}> Cerrar sesión </button>
    
          <FileUpload  onUpload={this.handleUpload} />

          {
            this.state.pictures.map(picture => (
              <div>
                <img src={picture.image} />
                <br/>
                <img width="50" src={picture.photoURL}  alt={picture.displayName} />
                <br/>
                <span> {picture.displayName} </span>
              </div>
            )).reverse()
          }
    
        </div>  
      );
    }
    else{
      // Si no lo está
      return (
        <button onClick={this.handleAuth}> Login con Google </button>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pseudogram</h1>
        </header>
        <p className="App-intro">
        </p>
        { this.renderLoginButton() }
      </div>
    );
  }
}

export default App;
