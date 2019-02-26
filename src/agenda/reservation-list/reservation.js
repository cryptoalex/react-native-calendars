import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {xdateToData} from '../../interface';
import XDate from 'xdate';
import dateutils from '../../dateutils';
import styleConstructor from './style';

class ReservationListItem extends Component {
  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;

    const r1ExtraData = this.props.extraData;
    const r2ExtraData = nextProps.extraData;

    let changed = true;
    if (!r1 && !r2) {
      changed = this.compareExtras(r1ExtraData, r2ExtraData);
    } else if (r1 && r2) {
      if (r1.day.getTime() !== r2.day.getTime()) {
        changed = true;
      } else if (!r1.reservation && !r2.reservation) {
        changed = this.compareExtras(r1ExtraData, r2ExtraData);
      } else if (r1.reservation && r2.reservation) {
        if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
          changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
        }
      }
    }
    return changed;
  }

  compareExtras(r1ExtraData, r2ExtraData) {
    if (!r1ExtraData && !r2ExtraData) {
      return false;
    }
    if(r1ExtraData && r2ExtraData) {
      return JSON.stringify(r1ExtraData) !== JSON.stringify(r2ExtraData);
    }
    return true;
  }

  renderDate(date, item) {
    if (this.props.renderDay) {
      return this.props.renderDay(date ? xdateToData(date) : undefined, item);
    }
    const today = dateutils.sameDate(date, XDate()) ? this.styles.today : undefined;
    if (date) {
      return (
        <View style={this.styles.day}>
          <Text allowFontScaling={false} style={[this.styles.dayNum, today]}>{date.getDate()}</Text>
          <Text allowFontScaling={false} style={[this.styles.dayText, today]}>{XDate.locales[XDate.defaultLocale].dayNamesShort[date.getDay()]}</Text>
        </View>
      );
    } else {
      return (
        <View style={this.styles.day}/>
      );
    }
  }

  render() {
    const {reservation, date} = this.props.item;
    let content;
    const firstItem = date ? true : false;

    if (reservation) {
      content = this.props.renderItem(reservation, firstItem, date);
    } else {
      content = this.props.renderEmptyDate(date);
    }
    if (firstItem && this.props.shouldRenderItemHeader && this.props.renderItemHeader &&
      this.props.shouldRenderItemHeader(reservation, firstItem, date)) {
      return (
        <View style={{flexDirection: 'column'}}>
          {this.props.renderItemHeader(reservation, date)}
          <View style={this.styles.container}>
            {this.renderDate(date, reservation)}
            <View style={{flex:1}}>
              {content}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={this.styles.container}>
        {this.renderDate(date, reservation)}
        <View style={{flex:1}}>
          {content}
        </View>
      </View>
    );
  }
}

export default ReservationListItem;
