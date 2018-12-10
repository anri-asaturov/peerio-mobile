import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';
import PickerPopup from '../../controls/picker-popup';
import medcryptorUiState from './medcryptor-ui-state';
import { transitionAnimation } from '../../helpers/animations';

@observer
class GenericPicker extends SafeComponent {
    constructor(props, data, name) {
        super(props);
        this.data = data;
        this.name = name;
    }

    componentWillUpdate() {
        transitionAnimation();
    }

    renderThrow() {
        return <PickerPopup name={this.name} data={this.data} state={medcryptorUiState} />;
    }
}

@observer
class MedcryptorRolePicker extends GenericPicker {
    constructor(props) {
        super(props, medcryptorUiState.roles, 'roleSelected');
    }
}

@observer
class MedcryptorCountryPicker extends GenericPicker {
    constructor(props) {
        super(props, medcryptorUiState.countries, 'countrySelected');
    }
}

@observer
class MedcryptorSpecialtyPicker extends GenericPicker {
    constructor(props) {
        super(props, medcryptorUiState.specialties, 'specialtySelected');
    }
}

module.exports = { MedcryptorRolePicker, MedcryptorCountryPicker, MedcryptorSpecialtyPicker };
