import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import { AppRoute } from '../../navigation/app.routes';

import logEvent from '../../analytics/analytics';
import {
  ScreenEvent,
  UserInteractionEvent,
} from '../../analytics/analytics.event';
import { MaybeListContext } from '../../states/maybeList.state';
import { MatchListContext } from '../../states/matchList.state';
import {
  LogoIcon,
  MaybeIcon,
  MessageIcon,
  PersonIcon,
} from './home.tab-bar.icons';
import { ChatContext } from '../../states/chat.state';

require('../../style/appStyle');

const HomeTabBarInner = (props: any) => {
  const { state, descriptors, navigation } = props;
  const { hasMaybeWithSecretMessage } = useContext(MaybeListContext);
  const { matchList } = useContext(MatchListContext);
  const { hasUnreadChannels } = useContext(ChatContext);
  const showMessageNotification =
    matchList.filter((matchItem) => !matchItem.isClickedOn).length > 0 ||
    hasUnreadChannels;

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const TabBarIcon = () => {
          switch (route.name) {
            case AppRoute.CONVERSATION:
              return (
                <MessageIcon
                  isFocused={isFocused}
                  hasNotification={showMessageNotification}
                />
              );
            case AppRoute.DISCOVER:
              return <LogoIcon isFocused={isFocused} />;
            case AppRoute.MAYBE:
              return (
                <MaybeIcon
                  isFocused={isFocused}
                  hasMaybeWithSecretMessage={hasMaybeWithSecretMessage}
                />
              );
            case AppRoute.PROFILE: {
              return <PersonIcon isFocused={isFocused} />;
            }
            default: {
              return <></>;
            }
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            logEventHomeBarItemClicked(route.name);
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabElement}>
            <TabBarIcon />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export const HomeTabBar = (props: any) => {
  return (
    <View useSafeArea={true} style={styles.screen}>
      <HomeTabBarInner {...props} />
    </View>
  );
};

const logEventHomeBarItemClicked = async (name: keyof typeof RouteEventMap) => {
  const event = RouteEventMap[name];
  if (!event) {
    return;
  }
  await logEvent(UserInteractionEvent.click + '_' + event);
};

const RouteEventMap = {
  [AppRoute.DISCOVER]: ScreenEvent.recommendationStream,
  [AppRoute.CONVERSATION]: ScreenEvent.newMatchesMessagesList,
  [AppRoute.MAYBE]: ScreenEvent.maybeList,
  [AppRoute.PROFILE]: ScreenEvent.myAccount,
};

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
  },
  tabBar: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 65,
    justifyContent: 'center',
  },
  tabElement: {
    alignItems: 'center',
    flex: 1,
  },
});
