import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ViewPropTypes,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
});

const MARGIN_SIZE = 10;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get("window").width - CARD_NUMBER_INPUT_WIDTH_OFFSET;
const CVC_INPUT_WIDTH = (CARD_NUMBER_INPUT_WIDTH / 2) - (MARGIN_SIZE / 2);
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE",
    },
    placeholders: {
      name: "Full Name",
      number: "XXXX XXXX XXXX XXXX",
      expiry: "MM/YY",
      cvc: "XXX",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    validationMessages: {
      number: null,
      expiry: null,
      cvc: null,
    },
    validationMessageStyle: {
      color: 'red',
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  _inputProps = field => {
    const {
      inputStyle, labelStyle, validColor, invalidColor, placeholderColor,
      placeholders, labels, values, status, validationMessages, validationMessageStyle,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      label: labels[field],
      placeholder: placeholders[field],
      validationMessage: validationMessages[field],
      validationMessageStyle: validationMessageStyle,
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      labelStyle, cardImageFront, cardImageBack, inputContainerStyle,
      values: { number, expiry, cvc, name, type }, focused,
      allowScroll, requiresName, requiresCVC, requiresPostalCode,
      cardScale, cardFontFamily, cardBrandIcons, inputStyle
    } = this.props;

    return (
      <View style={s.container}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc}
        />
        <CCInput
          {...this._inputProps("number")}
          labelStyle={labelStyle}
          inputStyle={inputStyle}
          keyboardType="numeric"
          containerStyle={[s.inputContainer, inputContainerStyle, { paddingRight: 15 }, { width: CARD_NUMBER_INPUT_WIDTH }]}
        />
        <View style={{ flexDirection: 'row' }}>
          <CCInput {...this._inputProps("expiry")}
            keyboardType="numeric"
            inputStyle={inputStyle}
            labelStyle={labelStyle}
            containerStyle={[s.inputContainer, inputContainerStyle, { paddingRight: 0 }, { marginRight: 5, width: EXPIRY_INPUT_WIDTH }]} />
          {requiresCVC &&
            <CCInput {...this._inputProps("cvc")}
              labelStyle={labelStyle}
              keyboardType="numeric"
              inputStyle={inputStyle}
              containerStyle={[s.inputContainer, inputContainerStyle, { width: CVC_INPUT_WIDTH }]} />}
        </View>
        {requiresName &&
          <CCInput {...this._inputProps("name")}
            labelStyle={labelStyle}
            inputStyle={inputStyle}
            containerStyle={[s.inputContainer, inputContainerStyle, { paddingRight: 15 }, { width: CARD_NUMBER_INPUT_WIDTH }]} />}
        {requiresPostalCode &&
          <CCInput {...this._inputProps("postalCode")}
            labelStyle={{ labelStyle }}
            keyboardType="numeric"
            inputStyle={inputStyle}
            containerStyle={[s.inputContainer, inputContainerStyle, { width: POSTAL_CODE_INPUT_WIDTH }]} />}
      </View>
    );
  }
}
