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
  View,
  Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import ViewPort from '../../../src/service/ViewPort';
import Api from '../../../src/service/Api';
import {
  Container,
  Header,
  Right,
  Spinner,
  Button,
  Icon,
  Title,
  Accordion,
  Badge,
  Footer,
  FooterTab,
  Text,
} from 'native-base';

import { Calculator } from 'react-native-calculator'

import { Col, Grid } from 'react-native-easy-grid';
import BarcodeMask from 'react-native-barcode-mask';


const viewfinderHeight = 100;
const viewfinderWidth = 300;

const aabb = (obj1, obj2) => obj1.x < obj2.x + obj2.width
  && obj1.x + obj1.width > obj2.x
  && obj1.y < obj2.y + obj2.height
  && obj1.y + obj1.height > obj2.y;

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
const viewFinderBounds = {
  height: viewfinderHeight,
  width: viewfinderWidth,
  x: (windowWidth - viewfinderWidth) / 2,
  y: (windowHeight - viewfinderHeight) / 2,
};

class App extends React.Component {
  camera;
  constructor(props) { 
    super(props);
    this.viewPortService = new ViewPort;

    this.state = {
      message: 'Scan Any Equation',
      visible: false,
      stepSolution: [],
      textBlocks: [],
      lookingAt: {},
      isScanning: false,
      scanMode: true
    }
  }

  takePicture = async () => {
    
    if (this.state.textBlocks.length == 0) {
      return;
    }

    this.setState({ isScanning: true });
    const equationResponse = await Api.scanEquation(this.state.textBlocks[0].value);
    if (equationResponse.length > 0 && equationResponse != "" ) {
      this.setState({
          isScanning: false,
          stepSolution: equationResponse,
          visible: true
        })
    }
    else if (equationResponse == "") {
      this.setState({ isScanning: false });
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
    let boundedBoxes = this.state.textBlocks.map((block, idx) =>
      <View
        key={idx}
        style={[
          { borderColor: 'orange', borderWidth: 1, position: 'absolute', height: 10, width: 10 },
          block.bounds.size,
          { top: block.bounds.origin.y, left: block.bounds.origin.x }]}>
          </View>)
    return (
      <Container>
        {this.renderModal()}
        <Grid>
          <Col style={{ flex: 1 }}>
        {this.state.scanMode ? (
              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={{ flex: 1, width: "100%", backgroundColor: '#fff', justifyContent: "flex-start", alignItems: 'center' }}
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
                onTextRecognized={({ textBlocks }) => {
                  if (this.state.isScanning == true) return;
                  const collidingTexts = textBlocks.filter((barcode) => {
                    let elementBounds = {
                      height: barcode.bounds.size.height,
                      width: barcode.bounds.size.width,
                      x: barcode.bounds.origin.x,
                      y: barcode.bounds.origin.y,
                    };

                    return aabb(viewFinderBounds, elementBounds);
                  });

                  function toLowerCase(obj) {
                    obj.value = obj.value.toLowerCase();
                    return obj;
                  }
                  let scannableText = collidingTexts.length > 0 ? [toLowerCase(collidingTexts[0])] : []
                  this.setState({ textBlocks: scannableText })
                }}
              >
                {({ camera, status, recordAudioPermissionStatus }) => {
                  if (status !== 'READY') return <Spinner />;
                  return (
                    <React.Fragment>
                      <BarcodeMask
                        ref={(ref) => this.cameraView = ref}
                        width={viewfinderWidth}
                        height={viewfinderHeight}
                        showAnimatedLine={false}
                        transparency={0.8} />
                      {boundedBoxes}
                      <Text style={{ color: '#fff', fontSize: 20, maxHeight: 30, textAlign: "center" }}>
                        {this.state.textBlocks[0] != undefined ? this.state.textBlocks[0].value : ''}
                      </Text>
                      <Button
                        disabled={this.state.isScanning}
                        onPress={this.takePicture}
                        rounded
                        block
                        style={{ margin: 10, top: "100%" }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Scan</Text>
                      </Button>
                    </React.Fragment>
                  );
                }}

              </RNCamera>
            ) : <Calculator
                onTextChange={(text) => this.setState({ textBlocks: [{ value: text, bounds: { size: {}, origin: {x: 0, y:0}} }]})}
                onCalc={(number, text) => this.takePicture() }
                style={{ flex: 1 }} />}
            </Col>
        </Grid>
        <Footer>
          <FooterTab>
            <Button vertical active={this.state.scanMode} onPress={() => this.setState({scanMode: true})}>
              <Icon name="camera" />
              <Text>Scan</Text>
            </Button>

            <Button vertical active={!this.state.scanMode} onPress={() => this.setState({ scanMode: false })}>
              <Icon name="calculator" />
              <Text>Calculator</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
  
}

export default App;
