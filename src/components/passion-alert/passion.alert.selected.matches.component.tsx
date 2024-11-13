import React, { useContext } from 'react';
import { PassionAlertCandidate } from '@match-app/shared';
import { Assets, TouchableOpacity, View } from 'react-native-ui-lib';
import { MatchListItem } from '../match-list/match.list.item.component';
import { imageHeader } from '../../util/imageHeader';
import { TokenContext } from '../../states/token.state';
import { StyleSheet } from 'react-native';
import DeleteIcon from '../../../assets/icons/matchapp_remove.svg';
import ProfileCircleDefault from '../custom/profile.circle.default.component';
import { appColors } from '../../style/appColors';

const NUMBER_OF_ROWS = 3;
const NUMBER_OF_COLUMNS = 4;

interface PassionAlertSelectedMatchesProps {
  matches: PassionAlertCandidate[];
  removeMatch: (item: PassionAlertCandidate) => void;
}

const PassionAlertSelectedMatches = (
  props: PassionAlertSelectedMatchesProps,
) => {
  const { matches, removeMatch } = props;
  const {
    state: { token },
  } = useContext(TokenContext);

  return (
    <View>
      {matches && matches.length > 0 ? (
        [...Array(NUMBER_OF_ROWS)].map((_, rowIndex) => {
          return (
            <View key={rowIndex} style={styles.rowContainer}>
              {[...Array(NUMBER_OF_COLUMNS)].map((__, colIndex) => {
                const currentMatch =
                  matches[rowIndex * NUMBER_OF_COLUMNS + colIndex];
                const itemImageSource =
                  currentMatch && currentMatch.thumbnailUrl
                    ? {
                        uri: currentMatch.thumbnailUrl,
                        headers: imageHeader(token),
                      }
                    : Assets.images.defaultProfile;
                return (
                  <View
                    key={
                      currentMatch
                        ? currentMatch.matchId
                        : `${rowIndex}-${colIndex}`
                    }
                    style={styles.matchContainer}>
                    {currentMatch && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          removeMatch(currentMatch);
                        }}>
                        <MatchListItem
                          photo={itemImageSource}
                          focused={false}
                          size={70}
                        />
                        <DeleteIcon
                          style={styles.deleteIcon}
                          height={18}
                          width={18}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })
      ) : (
        <ProfileCircleDefault color={appColors.secondaryLight} size={75} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  deleteIcon: {
    borderRadius: 10,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  matchContainer: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
  },
});

export default PassionAlertSelectedMatches;
