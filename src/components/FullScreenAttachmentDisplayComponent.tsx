import React from 'react';
import {
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import {BaseViewComponent} from './core';
import {Colors, ImageConfig} from '../constants';
import CommonFunctions from '../helpers/CommonFunctions';
import WebView from 'react-native-webview';

export interface FullScreenAttachmentDisplayComponentProps {
  style?: StyleProp<ViewStyle>;
  showFullscreen: any | null;
  setShowFullscreen: (v: any | null) => void;
}

const FullScreenAttachmentDisplayComponent = (
  props: FullScreenAttachmentDisplayComponentProps,
) => {
  const style = props.style || {};
  const {setShowFullscreen, showFullscreen} = props;
  const dimensions = useWindowDimensions();
  // const [showFullscreen, setShowFullscreen] = useState<any | null>(null);
  return (
    <Modal
      visible={!!showFullscreen}
      onRequestClose={() => {
        setShowFullscreen(null);
      }}
      animated={true}
      animationType={'slide'}>
      <TouchableOpacity
        onPress={() => {
          setShowFullscreen(null);
        }}
        style={{
          position: 'absolute',
          backgroundColor: Colors.primary,
          top: 20,
          width: 36,
          ...CommonFunctions.getElevationStyle(4),
          height: 36,
          right: 20,
          zIndex: 2,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ImageConfig.IconClose
          height={24}
          width={24}
          color={Colors.textOnTextDark}
        />
      </TouchableOpacity>
      {showFullscreen && (
        <BaseViewComponent>
          {
            <WebView
              contentMode={'mobile'}
              style={{
                width: dimensions.width,
                backgroundColor: Colors.backgroundColor,
                height: dimensions.height,
              }}
              source={{uri: showFullscreen.url}}
            />
          }
          {/*{showFullscreen.type === 'pdf' && (*/}
          {/*  <ImageBackground*/}
          {/*    resizeMethod={'auto'}*/}
          {/*    source={{*/}
          {/*      uri: showFullscreen.url,*/}
          {/*    }}*/}
          {/*    resizeMode={'contain'}*/}
          {/*    style={{*/}
          {/*      width: dimensions.width,*/}
          {/*      height: dimensions.height,*/}
          {/*      backgroundColor: Colors.iconTabletColor,*/}
          {/*      // borderRadius: 5,*/}
          {/*      justifyContent: 'center',*/}
          {/*      alignItems: 'center',*/}
          {/*    }}*/}
          {/*  />*/}
          {/*)}*/}
        </BaseViewComponent>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
});

export default FullScreenAttachmentDisplayComponent;
