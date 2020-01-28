import React from 'react';
import './App.css';
import Autocomplete from 'react-autocomplete'
import { Row, Col, FormGroup, Label, NavLink} from "reactstrap";

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      userName : "",
      usersList : [],
      user : {
                avatar_url : "",
                location : "",
                email : "",
                bio : "",
                url : "",
                public_repos : "",
                followers : ""
              }
    }
  }

  getUserProfile = (event, value) => {
    this.setState({userName : value.name});

    fetch("https://api.github.com/users/"+value.name+"?token=0bc67222f789bad75c311425bea5358617b6ed8e")
    .then(result => result.json()).then(user => {
      this.setState({user : user})
    })
  }

  getUsersList = (event, value) => {
    this.setState({userName:value}, function(){
        fetch("https://api.github.com/users")
        .then(results => results.json()).then(data => {
          let usersData = data.filter(user => !user.login.indexOf(value));
          let users = usersData.map(function(user) {
              return ({name : user.login, id : user.id});
            });
          this.setState({usersList : users});
        })
      }
    );
  }

  render() {
    return (
      <div className="App">
        <header className = "App-header">
          <Row className = "Header-row">
            <Col>
              <Label>Username : </Label>
              <Autocomplete value = {this.state.userName}
                            items = {this.state.usersList}
                            onChange = {(event, value) => {
                              this.getUsersList(event, value)
                            }}
                            onSelect = {(event, value) => {
                              this.getUserProfile(event, value)
                            }}
                            getItemValue={(item) => item.name}
                            renderItem={(item, isHighlighted) => (
                      		            <div
                      		              className = "App-autoComplete"
                                        key={item.id}>{item.name}</div>
                      		          )}
                            >
              </Autocomplete>
            </Col>
          </Row>
        </header>

        <FormGroup className = "App-body">
          <Row>
            <Col>
              <h2>User Profile</h2>
            </Col>
          </Row>

          <Row className = "App-row">
            <Col>
              <img src={this.state.user.avatar_url} className="App-logo" alt="logo" />
            </Col>
          </Row>

          <Row className = "App-row">
            <Col>
              <Label>Location : </Label>
              <Label>{this.state.user.location}</Label>
            </Col>
          </Row>

          <Row className = "App-row">
            <Col>
              <Label>Email : </Label>
              <Label>{this.state.user.email}</Label>
            </Col>
          </Row>

          <Row className = "App-row">
            <Col>
              <Label>Bio : </Label>
              <Label>{this.state.user.bio}</Label>
            </Col>
          </Row>

          <Row className = "App-row">
            <Col>
              <Label>Profile link : </Label>
              <NavLink href = {this.state.user.url}>{this.state.user.url}</NavLink>
            </Col>
          </Row>

          <Row className = "App-row">
            <Col>
              <Label>Total Number of Starred Repo's : </Label>
              <Label>{this.state.user.public_repos}</Label>
            </Col>
          </Row>

          <Row className = "App-row">
            <Col>
              <Label>Followers : </Label>
              <Label>{this.state.user.followers}</Label>
            </Col>
          </Row>

        </FormGroup>
      </div>
    );
  }
}

export default App;
