import HeaderIconBase from './header-icon-base';

export default class PlusBorderIcon extends HeaderIconBase {
    iconSource = require('../../assets/plus-icon.png');
    action = this.props.action;
    beacon = this.props.beacon;
}
