import React from 'react';
import { Text } from 'react-native';
import { Container, Icon } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';


const SplashScreen = ({ navigation }) => {
    setTimeout(() => {
        navigation.navigate('Home')
    }, 1500)
    return (<Container>
        <Grid>
            <Col style={{ justifyContent: "center", alignItems: "center", backgroundColor: '#302D58'}}>
                <Icon ios='ios-menu' android="md-menu" style={{ fontSize: 50, color: '#fff' }} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: '#fff' }}>Pic-To-Math</Text>
            </Col>
        </Grid>
    </Container >)
        
};

export default SplashScreen;