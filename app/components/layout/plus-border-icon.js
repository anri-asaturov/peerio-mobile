import HeaderIconBase from './header-icon-base';
import { vars } from '../../styles/styles';

export default class PlusBorderIcon extends HeaderIconBase {
    icon = 'add';
    // to compensate for borderwidth
    style = { marginRight: -4 };
    innerStyle = { borderWidth: 2, borderColor: vars.white, borderRadius: 4 };
    action = this.props.action;
    beacon = this.props.beacon;
}
