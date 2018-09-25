import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../../shared/safe-component';
import PickerBox from '../../controls/picker-box';
import { MedcryptorRolePicker } from './medcryptor-pickers';
import medcryptorUiState from './medcryptor-ui-state';
import { pickerBox } from '../../../styles/styles';
import { tx } from '../../utils/translator';

@observer
export default class MedcryptorRolePickerBox extends SafeComponent {
    renderThrow() {
        return (
            <PickerBox
                name="roleSelected"
                picker={<MedcryptorRolePicker />}
                data={medcryptorUiState.roles}
                value={medcryptorUiState.roleSelected}
                state={medcryptorUiState}
                label={tx('title_yourRole')}
                errorMessage={tx('title_selectYourRole')}
                style={pickerBox}
            />
        );
    }
}
