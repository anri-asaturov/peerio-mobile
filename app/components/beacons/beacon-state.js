import { action, observable, computed } from 'mobx';
import _ from 'lodash';
import { User } from '../../lib/icebear';

const notSeen = (id) => !User.current.beacons.get(id);

class BeaconState {
    @observable beacons = [];

    @computed get activeBeacon() {
        return _.chain(this.beacons)
            .filter(b => notSeen(b.id))
            .filter(b => b.condition() === true)
            .sortBy(b => b.priority)
            .first()
            .value();
    }

    requestBeacon(beacon) {
        if (!beacon) return;
        this.beacons.unshift(beacon);
    }

    @action.bound
    removeBeacon(idToRemove) {
        if (!idToRemove) return;
        this.beacons = this.beacons.filter(b => b.id !== idToRemove);
    }
}

const beaconState = new BeaconState();

// TODO: remove before merging
global.beaconState = beaconState;

export default beaconState;
