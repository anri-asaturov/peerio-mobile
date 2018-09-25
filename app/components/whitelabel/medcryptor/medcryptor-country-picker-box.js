import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';
import PickerBox from '../../controls/picker-box';
import { MedcryptorCountryPicker } from './medcryptor-pickers';
import medcryptorUiState from './medcryptor-ui-state';
import { pickerBox } from '../../../styles/styles';
import { tx } from '../../utils/translator';

@observer
export default class MedcryptorCountryPickerBox extends SafeComponent {
    renderThrow() {
        return (
            <PickerBox
                name="countrySelected"
                picker={<MedcryptorCountryPicker />}
                state={medcryptorUiState}
                data={medcryptorUiState.countries}
                value={medcryptorUiState.countrySelected}
                label={tx('title_countryOfPractice')}
                hint={tx('title_countryOfPractice')}
                style={pickerBox}
            />
        );
    }
}
