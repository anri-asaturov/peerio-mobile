import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';
import PickerBox from '../../controls/picker-box';
import { MedcryptorSpecialtyPicker } from './medcryptor-pickers';
import medcryptorUiState from './medcryptor-ui-state';
import { pickerBox } from '../../../styles/styles';
import { tx } from '../../utils/translator';

@observer
export default class MedcryptorSpecialtyPickerBox extends SafeComponent {
    renderThrow() {
        return (
            <PickerBox
                name="specialtySelected"
                picker={<MedcryptorSpecialtyPicker />}
                data={medcryptorUiState.specialties}
                value={medcryptorUiState.specialtySelected}
                state={medcryptorUiState}
                label={tx('title_specialty')}
                errorMessage={tx('title_selectYourSpecialty')}
                style={pickerBox}
            />
        );
    }
}
