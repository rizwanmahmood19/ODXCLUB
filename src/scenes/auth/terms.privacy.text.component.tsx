import React, { useContext } from 'react';

import { LocalizationContext } from '../../services/LocalizationContext';
import links from '../../services/links';
import TextWithLinks from '../../components/custom/styleguide-components/text.with.links.component';

interface TermsAndPrivacyTextProps {
  style: Record<string, unknown>;
  linkText?: string;
  termsString?: string;
  privacyString?: string;
  textStyle?: Record<string, unknown>;
}

export const TermsAndPrivacyText = (props: TermsAndPrivacyTextProps) => {
  const { style, textStyle, linkText, termsString, privacyString } = props;
  const { l10n } = useContext(LocalizationContext);
  const descriptionText =
    linkText || l10n.screens.SIGN_UP_CHOICE_SUB_DESCRIPTION;

  const linksArray = [
    { url: links.termsURL, text: termsString || l10n.screens.TERMS },
    {
      url: links.privacyURL,
      text: privacyString || l10n.screens.PRIVACY_POLICY,
    },
  ];

  return (
    <TextWithLinks
      descriptionText={descriptionText}
      links={linksArray}
      style={style}
      textStyle={textStyle}
    />
  );
};
