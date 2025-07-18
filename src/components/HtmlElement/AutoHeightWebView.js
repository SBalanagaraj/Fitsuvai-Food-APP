// import react from 'react';
// import {View, Text} from 'react-native';

// const AutoHeightWebView = () => {
//   return (
//     <View>
//       <Text>gfcxfcgh</Text>
//     </View>
//   );
// };

// export default AutoHeightWebView;
import {StyleSheet, Text, View} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import React from 'react';
import {scrnHeight, scrnWidth} from '../../utilities/helperFunction';
import appColors from '../../utilities/appColors';

const AutoHeightHTML = ({url, AdjustHeight = false}) => {
  const htmlContent = `<html>
                          <head>
                            <style>
                              @font-face {
                                font-family: 'MyCustomFont';
                                src: url('https://app.smart-golf.eu/assets/fonts/Roboto-regular.ttf') format('truetype');
                              }
                              body {
                                font-family: 'MyCustomFont', sans-serif;
                                color:${appColors().bgBlack};
                                font-size:17px;
                                 padding-top: 0px;
                                  padding-right: 15px;
                                  padding-bottom: 0px;
                                  padding-left: 15px;
                                  text-align: left;
                              }
                            </style>
                          </head>
                          <body>
                            ${url}
                          </body>
                        </html>`;

  return (
    <AutoHeightWebView
      style={{
        width: scrnWidth - 40,
        padding: 10,
        // height: AdjustHeight ? scrnHeight / 2 : 'auto',
      }}
      onSizeUpdated={size => {}}
      files={[
        {
          href: 'cssfileaddress',
          type: 'text/css',
          rel: 'stylesheet',
        },
      ]}
      source={{
        html: htmlContent,
      }}
      scalesPageToFit={false}
      viewportContent={
        'width=device-width,height=device-height, user-scalable=no'
      }
    />
  );
};

export default AutoHeightHTML;

const styles = StyleSheet.create({});
