/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import RNTextDetector from 'react-native-text-detector';
import { RNCamera } from 'react-native-camera';
import ViewPort from './src/service/ViewPort';

import Api from './src/service/Api';
import {
  Container,
  Content,
  Footer,
  Header,
  Left,
  Body,
  Right,
  Spinner,
  Button,
  Icon,
  Title,
  FooterTab,
  Accordion
} from 'native-base';

import { Col, Grid } from 'react-native-easy-grid';

const CameraView = () => { 
  return (<View
    style={styles.target}>

  </View>)
}

class App extends React.Component {
  camera;
  constructor(props) { 
    super(props);
    this.viewPortService = new ViewPort;

    this.state = {
      message: 'Scan Any Equation',
      visible: false,
      stepSolution: [],
    }
  }

  takePicture = async () => {
    try {
      const options = {
        quality: 1,
        base64: true,
        skipProcessing: true,
      };

      this.setState({ message: 'Scanning...'})
      const { uri } = await this.camera.takePictureAsync(options);
      const visionResp = await RNTextDetector.detectFromUri(uri);
      this.setState({ message: visionResp[0].text.toLowerCase() });
      const equationResponse = await Api.scanEquation(visionResp[0].text.toLowerCase());
      
      if (equationResponse.length > 0) {
        this.setState({
          stepSolution: equationResponse,
          visible: true
        })
      }

    } catch (e) {
      console.warn(e);
    }
  }

  renderModal = ()  => { 
    return (
      <Modal
        visible={this.state.visible}
        animationType={'slide'} >
        <Container>
          <Header>
            <Title>
              <Text>Solution Explained</Text>
            </Title>
            <Right>
              <Button
                transparent
                onPress={() => {
                  this.setState({ visible: false })
                }}>
                <Icon name='close' />
              </Button>
            </Right>
          </Header>
          <Accordion
            dataArray={this.state.stepSolution}
            icon="add"
            expandedIcon="remove"
            iconStyle={{ color: "green" }}
            expandedIconStyle={{ color: "red" }}
            expanded={0}
          />
        </Container>
      </Modal>
    )
  }

  render() {
    return (
      <Container>
        {this.renderModal()}
        <Header>
          <Body style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Title>{this.state.message}</Title>
          </Body>
        </Header>
        <Grid>
          <Col style={{ flex: 1 }}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={{ flex: 1, width: "100%", backgroundColor: '#fff', justifyContent: "flex-start", alignItems:'center' }}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
            >
              {({ camera, status, recordAudioPermissionStatus }) => {
                if (status !== 'READY') return <Spinner />;
                return (
                  <CameraView />
                );
              }}

            </RNCamera>

          </Col>
        </Grid>
        <Footer>
          <FooterTab>
            <Button full onPress={this.takePicture}>
              <Text>SCAN</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
};

const styles = StyleSheet.create({
  target: {
    borderWidth: 5,
    borderColor: 'red',
    height: 100,
    width: 300,
    marginTop: 40,
  }
});

export default App;
