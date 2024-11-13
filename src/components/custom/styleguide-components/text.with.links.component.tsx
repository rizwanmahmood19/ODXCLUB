import React, { useContext } from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { View } from 'react-native-ui-lib';
import Hyperlink from 'react-native-hyperlink';

import { openLink } from '../../../services/linking';
import { appColors } from '../../../style/appColors';
import { LocalizationContext } from '../../../services/LocalizationContext';
import InfoText from './info.text.component';

interface CustomLinkProps {
  links: Link[];
  descriptionText: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle> | Array<StyleProp<TextStyle>>;
}

interface Link {
  url: string;
  text: string;
}

const TextWithLinks = (props: CustomLinkProps) => {
  const { style, textStyle, links, descriptionText } = props;
  const { l10n } = useContext(LocalizationContext);

  const urls = links.map((link) => link.url);

  const getLinkText = (url: string) =>
    links.find((link) => link.url === url)?.text || '';

  return (
    <View style={style}>
      <Hyperlink
        onPress={(url) => openLink(url)}
        linkStyle={[styles.link, textStyle]}
        linkText={getLinkText}>
        <InfoText style={textStyle}>
          {l10n.formatString(descriptionText, ...urls)}
        </InfoText>
      </Hyperlink>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    color: appColors.primary,
    textDecorationLine: 'underline',
  },
});

export default TextWithLinks;
