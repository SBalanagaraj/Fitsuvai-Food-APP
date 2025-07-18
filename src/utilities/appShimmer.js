import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {fontScalling, scrnWidth, widthResponse} from './helperFunction';
import appColors from './appColors';
export const MenuShimmer = () => {
  const {width} = Dimensions.get('window');
  const appColor = appColors();
  const {styles} = useStyle();

  const shimmerData = Array.from({length: 12});

  return (
    <FlatList
      data={shimmerData}
      keyExtractor={(_, index) => index.toString()}
      numColumns={3}
      contentContainerStyle={{paddingVertical: 10}}
      scrollEnabled={false}
      renderItem={() => (
        <SkeletonPlaceholder
          borderRadius={4}
          angle={90}
          speed={500}
          highlightColor={appColor.gold}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
              marginRight: 10,
              marginBottom: 5,
              width: width / 3 - 20,
              height: width / 3,
              borderRadius: 10,
              borderWidth: 3,
              borderColor: appColor.borderColor,
              padding: 7,
            }}>
            <View style={{width: 70, height: 70, borderRadius: 50}} />
            <View
              style={{width: 70, height: 15, borderRadius: 5, marginBottom: 10}}
            />
          </View>
        </SkeletonPlaceholder>
      )}
    />
  );
};

export const DashShimmer = () => {
  const {width, height} = Dimensions.get('window');
  const appColor = appColors();
  const {styles} = useStyle();

  return (
    <SkeletonPlaceholder angle={90}>
      <ScrollView style={{width: '85%', marginHorizontal: 'auto'}}>
        <View
          style={{
            width: '100%',
            height: widthResponse ? 160 : 210,
            marginHorizontal: 'auto',
            borderRadius: 15,
            marginVertical: 20,
            overflow: 'hidden',
          }}
        />
        <View
          style={{
            width: '50%',
            height: 20,
            borderRadius: 10,
            marginHorizontal: 'auto',
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 20,
            width: '100%',
            marginHorizontal: 'auto',
            justifyContent: 'space-between',
          }}>
          <View style={styles.sqr}></View>
          <View style={styles.sqr}></View>
          <View style={styles.sqr}></View>
        </View>
        <View style={{width: '50%', height: 20, borderRadius: 10}} />
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 20,
            width: '100%',
            marginHorizontal: 'auto',
            justifyContent: 'space-between',
          }}>
          <View style={styles.prd}>
            <View style={styles.crc} />
            <View style={styles.prdTtl} />
            <View style={styles.prdPrc} />
            <View style={styles.cartsq} />
          </View>
          <View style={styles.prd}>
            <View style={styles.crc} />
            <View style={styles.prdTtl} />
            <View style={styles.prdPrc} />
            <View style={styles.cartsq} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            // marginVertical: 10,
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <View style={styles.shop} />
          <View style={styles.shop} />
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const DetailShimmer = () => {
  const {width, height} = Dimensions.get('window');
  const appColor = appColors();
  const {styles} = useStyle();
  return (
    <SkeletonPlaceholder>
      <ScrollView>
        <View
          style={{
            width: '70%',
            height: 20,
            borderRadius: 5,
            marginHorizontal: 'auto',
            marginBottom: 10,
            marginTop: 10,
          }}
        />
        <View
          style={{
            width: '40%',
            height: 10,
            borderRadius: 5,
            marginHorizontal: 'auto',
            marginBottom: 15,
          }}
        />
        <View style={{margin: 10}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'flex-start',
              height: height / 4.3,
              marginBottom: 10,
              borderRadius: 20,
            }}></View>
          <View
            style={{
              width: '60%',
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 'auto',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 5,
              }}
            />
          </View>
          <View
            style={{
              width: '50%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginHorizontal: 'auto',
            }}>
            <View style={{width: 80, height: 17, borderRadius: 5}} />
            <View
              style={{width: 60, height: 13, borderRadius: 5, marginLeft: 8}}
            />
          </View>
          <View style={{height: 40, borderRadius: 30, marginVertical: 15}} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginBottom: 15,
            }}>
            <View style={{width: 90, height: 17, borderRadius: 5}} />
            <View
              style={{width: 140, height: 17, borderRadius: 5, marginLeft: 20}}
            />
          </View>
          <View
            style={{
              height: 10,
              borderRadius: 5,
              marginBottom: 4,
              width: '100%',
            }}
          />
          <View
            style={{
              height: 10,
              borderRadius: 5,
              marginBottom: 4,
              width: '100%',
            }}
          />
          <View
            style={{
              height: 10,
              borderRadius: 5,
              marginBottom: 4,
              width: '100%',
            }}
          />
          <View
            style={{
              height: 10,
              borderRadius: 5,
              marginBottom: 4,
              width: '100%',
            }}
          />
          <View
            style={{
              height: 10,
              borderRadius: 5,
              marginBottom: 4,
              width: '100%',
            }}
          />
          <View style={{height: 40, borderRadius: 30, marginVertical: 15}} />
          <View style={{width: '50%', height: 20, borderRadius: 10}} />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 20,
              width: '100%',
              marginHorizontal: 'auto',
              justifyContent: 'space-between',
            }}>
            <View style={styles.prd}>
              <View style={styles.crc} />
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
              <View style={styles.cartsq} />
            </View>
            <View style={styles.prd}>
              <View style={styles.crc} />
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
              <View style={styles.cartsq} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const NotifiShimmer = () => {
  const {width, height} = Dimensions.get('window');
  const appColor = appColors();
  return (
    <SkeletonPlaceholder>
      <ScrollView style={{marginHorizontal: 5, marginTop: 30, width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: 55, height: 55, borderRadius: 35}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 15,
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                height: 15,
                width: width / 1.9,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 12,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 3, borderRadius: 5}}></View>
          </View>
          <View style={{width: 50, height: 50, borderRadius: 15}}></View>
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const RewardShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView style={{marginTop: 20}}>
        <View
          style={{
            width: 95,
            height: 15,
            borderRadius: 5,
            marginHorizontal: 'auto',
            marginBottom: 10,
          }}
        />
        <View
          style={{
            width: scrnWidth / 5,
            height: 30,
            borderRadius: 30,
            marginHorizontal: 'auto',
            marginBottom: 20,
          }}
        />
        <View style={{height: 100, borderRadius: 10}} />
        <View style={{marginTop: 30}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 15,
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 20,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 60, height: 15, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: appColor.borderColor,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 10,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 50, height: 20, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: appColor.borderColor,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 10,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 50, height: 20, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: appColor.borderColor,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 10,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 50, height: 20, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: appColor.borderColor,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 10,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 50, height: 20, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: appColor.borderColor,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 10,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 50, height: 20, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: appColor.borderColor,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 10,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 50, height: 20, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              padding: 10,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: appColor.borderColor,
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 10,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
            </View>
            <View style={{width: 50, height: 20, borderRadius: 10}}></View>
          </View>
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const OverviewShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            width: '100%',
          }}>
          <View
            style={{width: '25%', height: 25, borderRadius: 5, marginRight: 10}}
          />
          <View
            style={{width: '25%', height: 25, borderRadius: 5, marginRight: 10}}
          />
          <View
            style={{
              width: '30%',
              height: 25,
              borderRadius: 5,
              marginLeft: 'auto',
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            marginVertical: 5,
            width: '100%',
            marginHorizontal: 'auto',
            justifyContent: 'space-between',
          }}>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            marginVertical: 5,
            width: '100%',
            marginHorizontal: 'auto',
            justifyContent: 'space-between',
          }}>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            marginVertical: 5,
            width: '100%',
            marginHorizontal: 'auto',
            justifyContent: 'space-between',
          }}>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            marginVertical: 5,
            width: '100%',
            marginHorizontal: 'auto',
            justifyContent: 'space-between',
          }}>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            marginVertical: 5,
            width: '100%',
            marginHorizontal: 'auto',
            justifyContent: 'space-between',
          }}>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
          <View style={styles.prdOvr}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                marginHorizontal: 'auto',
              }}
            />
            <View>
              <View style={styles.prdTtl} />
              <View style={styles.prdPrc} />
            </View>
            <View style={styles.cartsq} />
          </View>
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const OrderShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView style={{marginHorizontal: 10}} horizontal={false}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 7,
          }}>
          <View style={{width: 75, height: 75, borderRadius: 15}}></View>
          <View
            style={{
              alignItems: 'flex-start',
              paddingHorizontal: 10,
              justifyContent: 'flex-start',
              flex: 1,
            }}>
            <View
              style={{
                height: 15,
                width: width / 2.2,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{
                height: 15,
                width: width / 3,
                marginBottom: 5,
                borderRadius: 5,
              }}></View>
            <View
              style={{height: 10, width: width / 5, borderRadius: 5}}></View>
          </View>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 50,
              marginLeft: 'auto',
            }}></View>
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const OrderdetailShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView style={{marginTop: 20}}>
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 50,
            marginHorizontal: 'auto',
            marginBottom: 7,
          }}
        />
        <View
          style={{
            width: 75,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 'auto',
            marginBottom: 7,
          }}
        />
        <View
          style={{
            width: scrnWidth / 1.8,
            height: 35,
            borderRadius: 30,
            marginHorizontal: 'auto',
            marginBottom: 7,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 40,
          }}>
          <View
            style={{width: 20, height: 20, borderRadius: 20, marginRight: 15}}
          />
          <View style={{flex: 1}}>
            <View
              style={{width: 95, height: 17, borderRadius: 5, marginBottom: 13}}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 40,
          }}>
          <View
            style={{width: 20, height: 20, borderRadius: 20, marginRight: 15}}
          />
          <View style={{flex: 1}}>
            <View
              style={{width: 95, height: 17, borderRadius: 5, marginBottom: 13}}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
            <View
              style={{
                width: '90%',
                height: 8,
                borderRadius: 5,
                marginBottom: 7,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: '95%',
            height: 35,
            borderRadius: 30,
            marginHorizontal: 'auto',
            marginBottom: 7,
            marginTop: 40,
          }}
        />
        <View style={{marginTop: 30}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{width: 55, height: 55, borderRadius: 35}}></View>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 15,
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 8,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{height: 8, width: width / 5, borderRadius: 5}}></View>
            </View>
            <View style={{width: 80, height: 25, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{width: 55, height: 55, borderRadius: 35}}></View>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 15,
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 8,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{height: 8, width: width / 5, borderRadius: 5}}></View>
            </View>
            <View style={{width: 80, height: 25, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{width: 55, height: 55, borderRadius: 35}}></View>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 15,
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 8,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{height: 8, width: width / 5, borderRadius: 5}}></View>
            </View>
            <View style={{width: 80, height: 25, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{width: 55, height: 55, borderRadius: 35}}></View>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 15,
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 8,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{height: 8, width: width / 5, borderRadius: 5}}></View>
            </View>
            <View style={{width: 80, height: 25, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{width: 55, height: 55, borderRadius: 35}}></View>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 15,
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 8,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{height: 8, width: width / 5, borderRadius: 5}}></View>
            </View>
            <View style={{width: 80, height: 25, borderRadius: 10}}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{width: 55, height: 55, borderRadius: 35}}></View>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: 15,
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <View
                style={{
                  height: 13,
                  width: width / 2.3,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{
                  height: 8,
                  width: width / 4,
                  marginBottom: 5,
                  borderRadius: 5,
                }}></View>
              <View
                style={{height: 8, width: width / 5, borderRadius: 5}}></View>
            </View>
            <View style={{width: 80, height: 25, borderRadius: 10}}></View>
          </View>
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const WhishlistShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          width: scrnWidth / 2,
          height: 25,
          borderRadius: 15,
          marginVertical: 20,
          marginHorizontal: 'auto',
        }}
      />
      <ScrollView>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            padding: 10,
            marginBottom: 15,
          }}>
          <View
            style={{
              height: 80,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 40,
              borderRadius: 10,
            }}
          />
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const ManageAddressShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView>
        <View
          style={{
            width: '100%',
            borderRadius: 10,
            marginBottom: 10,
            marginTop: 20,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            borderStyle: 'solid',
            padding: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 30,
            }}>
            <View style={{width: 60, height: 30, borderRadius: 30}} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 60,
                  height: 30,
                  borderRadius: 30,
                  marginRight: 20,
                }}
              />
              <View style={{width: 30, height: 30, borderRadius: 50}} />
            </View>
          </View>
          <View
            style={{
              width: scrnWidth / 3.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 3,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            borderStyle: 'solid',
            padding: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 30,
            }}>
            <View style={{width: 60, height: 30, borderRadius: 30}} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 60,
                  height: 30,
                  borderRadius: 30,
                  marginRight: 20,
                }}
              />
              <View style={{width: 30, height: 30, borderRadius: 50}} />
            </View>
          </View>
          <View
            style={{
              width: scrnWidth / 3.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 3,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            borderRadius: 10,
            marginBottom: 15,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            borderStyle: 'solid',
            padding: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 30,
            }}>
            <View style={{width: 60, height: 30, borderRadius: 30}} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 60,
                  height: 30,
                  borderRadius: 30,
                  marginRight: 20,
                }}
              />
              <View style={{width: 30, height: 30, borderRadius: 50}} />
            </View>
          </View>
          <View
            style={{
              width: scrnWidth / 3.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 3,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            borderRadius: 10,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: appColor.borderColor,
            borderStyle: 'solid',
            padding: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 30,
            }}>
            <View style={{width: 60, height: 30, borderRadius: 30}} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 60,
                  height: 30,
                  borderRadius: 30,
                  marginRight: 20,
                }}
              />
              <View style={{width: 30, height: 30, borderRadius: 50}} />
            </View>
          </View>
          <View
            style={{
              width: scrnWidth / 3.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 2.5,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: scrnWidth / 3,
              height: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const GeneralCourseShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            paddingHorizontal: widthResponse ? 15 : 20,
          }}>
          {Array(10)
            .fill()
            .map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: '48%',
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: appColor.borderColor,
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      height: widthResponse ? 100 : 130,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View
                    style={{
                      width: '60%',
                      height: 10,
                      borderRadius: 5,
                    }}
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const CourseDetailShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            paddingHorizontal: widthResponse ? 15 : 20,
          }}>
          {Array(10)
            .fill()
            .map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: '48%',
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: appColor.borderColor,
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      height: widthResponse ? 100 : 130,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View
                    style={{
                      width: '80%',
                      height: 14,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  />
                  <View
                    style={{
                      width: '95%',
                      height: 8,
                      borderRadius: 5,
                      marginBottom: 5,
                    }}
                  />
                  <View
                    style={{
                      width: '95%',
                      height: 8,
                      borderRadius: 5,
                      marginBottom: 5,
                    }}
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const BlogShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            // paddingHorizontal:widthResponse ? 15 : 20
          }}>
          {Array(10)
            .fill()
            .map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: '48%',
                    padding: 10,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: appColor.borderColor,
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      height: widthResponse ? 130 : 160,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <View
                    style={{
                      width: '50%',
                      height: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  />
                  <View
                    style={{
                      width: '90%',
                      height: 13,
                      borderRadius: 5,
                      marginBottom: 15,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: widthResponse ? 40 : 50,
                        height: widthResponse ? 40 : 50,
                        borderRadius: 60,
                        marginRight: 10,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <View
                        style={{
                          width: '95%',
                          height: 11,
                          borderRadius: 5,
                          marginBottom: 5,
                        }}
                      />
                      <View
                        style={{
                          width: '65%',
                          height: 8,
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const SubscriptionShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            // paddingHorizontal:widthResponse ? 15 : 20
          }}>
          {Array(10)
            .fill()
            .map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    padding: 15,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: appColor.borderColor,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <View
                        style={{
                          width: '40%',
                          height: 15,
                          borderRadius: 5,
                          marginBottom: 10,
                        }}
                      />
                      <View
                        style={{
                          width: '65%',
                          height: 11,
                          borderRadius: 5,
                          marginBottom: 10,
                        }}
                      />
                      <View
                        style={{
                          width: '85%',
                          height: 11,
                          borderRadius: 5,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: widthResponse ? 100 : 130,
                        height: widthResponse ? 30 : 35,
                        borderRadius: 15,
                        marginLeft: 10,
                      }}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

export const SubscriptionOverviewShimmer = () => {
  const appColor = appColors();
  const {styles} = useStyle();
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingTop: 10,
          paddingHorizontal: 15,
          borderRadius: 8,
          paddingBottom: widthResponse ? 90 : 140,
        }}>
        <View
          style={{
            height: fontScalling(3),
            width: '60%',
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            height: fontScalling(2),
            width: '95%',
            marginTop: 10,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            width: '100%',
            borderRadius: 15,
            borderWidth: 2,
            borderColor: appColor.greyBg,
            marginTop: 20,
          }}>
          <View style={[styles.hFlex, styles.pad]}>
            <View
              style={{
                height: fontScalling(2.5),
                width: '30%',
                marginRight: 5,
              }}
            />
            <View
              style={{
                height: fontScalling(2.5),
                width: '20%',
                marginRight: 5,
              }}
            />
            <View style={{height: fontScalling(2.5), width: '20%'}} />
          </View>
          <View style={[styles.pad]}>
            <View
              style={{
                height: fontScalling(2.5),
                width: '60%',
                marginBottom: 5,
              }}
            />
            <View style={[styles.hFlex, {justifyContent: 'space-between'}]}>
              <View style={{height: fontScalling(2.5), width: '45%'}} />
              <View style={{height: fontScalling(2.5), width: '45%'}} />
            </View>
          </View>
          <View style={[styles.pad]}>
            <View style={[styles.hFlex, {justifyContent: 'space-between'}]}>
              {[0, 1, 2].map((_, i) => (
                <View key={i} style={{height: fontScalling(3), width: '32%'}} />
              ))}
            </View>
          </View>
          <View style={[styles.pad, {borderWidth: 0}]}>
            <View
              style={{
                height: fontScalling(3.5),
                width: '100%',
                alignSelf: 'center',
              }}
            />
          </View>
        </View>
        <View
          style={{
            marginVertical: 15,
            height: fontScalling(4),
            width: '100%',
            borderRadius: 100,
          }}
        />
        <View
          style={{
            marginBottom: 13,
            height: fontScalling(3.5),
            width: '60%',
            borderRadius: 100,
          }}
        />
        <View
          style={{
            borderRadius: 8,
            borderWidth: 2,
            borderColor: appColor.greyBg,
          }}>
          {[0, 1, 2, 3, 4, 5].map((_, ind) => (
            <View key={ind}>
              <View
                style={[
                  styles.pad,
                  {flexDirection: 'row', justifyContent: 'space-between'},
                ]}>
                <View style={{width: '60%', height: fontScalling(2.5)}}></View>
                <View style={{width: '30%', height: fontScalling(2.5)}}></View>
              </View>
              <View style={{padding: 12}}>
                {[0, 1, 2].map((_, i) => (
                  <View key={i} style={[styles.hFlex, {marginBottom: 8}]}>
                    <View
                      style={{
                        width: '40%',
                        height: fontScalling(2.5),
                        marginRight: 10,
                      }}></View>
                    <View
                      style={{
                        width: '40%',
                        height: fontScalling(2.5),
                      }}></View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SkeletonPlaceholder>
  );
};

const useStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    sqr: {
      width: '30%',
      height: 100,
      borderRadius: 10,
    },
    prd: {
      width: '48%',
      height: 180,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: appColor.borderColor,
      padding: 7,
    },
    prdOvr: {
      width: '48%',
      height: 220,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: appColor.borderColor,
      padding: 7,
      justifyContent: 'space-around',
    },
    prdTtl: {
      paddingVertical: 3,
      width: '60%',
      height: 10,
      borderRadius: 10,
      marginBottom: 5,
    },
    prdPrc: {
      paddingVertical: 3,
      width: '30%',
      height: 10,
      borderRadius: 10,
      marginBottom: 15,
    },
    cartsq: {
      width: '60%',
      height: 25,
      borderRadius: 5,
    },
    crc: {
      width: 70,
      height: 70,
      borderRadius: 70,
      marginHorizontal: 'auto',
      backgroundColor: appColor.white,
      marginVertical: 10,
    },
    shop: {
      width: '48%',
      height: 150,
      borderRadius: 10,
    },
    hFlex: {flexDirection: 'row', alignItems: 'center'},
    pad: {padding: 10, borderBottomWidth: 1, borderColor: appColor.greyBg},
  });
  return {styles};
};
