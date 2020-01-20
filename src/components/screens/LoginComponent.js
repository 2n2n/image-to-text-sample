import React, { Component } from 'react';
import { 
    View,
    Text
} from 'react-native'
import {
    Container,
    Content,
    Card,
    CardItem,
    Input,
    Form,
    Item,
    Header, Title, Button, Left, Right, Body, Icon
} from 'native-base';
// import auth, { firebase } from 'react-native-firebase/auth';


class LoginComponent extends Component { 

    constructor(props) { 
        super(props)
        this.state = {
            username: '',
            password: '',
            loading: false
        }
    }

    onLoginSuccess = (data) => {
        console.log(data)
     }
    onLoginFailFirst = (err) => { 
        console.error(err.message)
    }
    onSingInPress = () => { 
        this.setState({ loading: true });
        // firebase
        //     .auth()
        //     .signInWithEmailAndPassword(this.state.username, this.state.password)
        //     .then(this.onLoginSuccess)
        //     .catch(this.onLoginFailFirst);
    }

    onSingUpPress = () => {
        this.setState({ loading: true });
        // firebase
        //     .auth()
        //     .createUserWithEmailAndPassword(this.state.username, this.state.password)
        //     .then(this.onLoginSuccess)
        //     .catch(this.onLoginFailFirst);
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Login</Title>
                    </Body>
                </Header>
                <Content>
                    <Form>
                        <Item regular>
                            <Input
                                onChangeText={(username) => this.setState({ username, })}
                                value={this.state.value}
                                placeholder="Username" />
                        </Item>
                        <Item last>
                            <Input
                                onChangeText={(password) => this.setState({ password, })}
                                value={this.state.value}
                                placeholder="Password"/>
                        </Item>
                    </Form>
                    <Button block onPress={this.onSingInPress}>
                        <Text>Login</Text>
                    </Button>
                    <Button block onPress={this.onSingUpPress}>
                        <Text>Sign Up</Text>
                    </Button>
                </Content>
            </Container>
        );
     }
}

export default LoginComponent;