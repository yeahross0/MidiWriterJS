import {Constants} from '../constants';
import {Utils} from '../utils.js';

/**
 * Holds all data for a "controller change" MIDI event
 * @param {object} fields {controllerNumber: integer, controllerValue: integer, delta: integer}
 * @return {ControllerChangeEvent}
 */
class ControllerChangeEvent {
	constructor(fields) {
		// Set default fields
		fields = Object.assign({
			delta: 0x00,
			channel: 0x01,
		}, fields);

		this.type = 'controller';
		// delta time defaults to 0.
		this.data = Utils.numberToVariableLength(fields.delta).concat(Constants.CONTROLLER_CHANGE_STATUS + fields.channel - 1, fields.controllerNumber, fields.controllerValue);
	}
}

export {ControllerChangeEvent};
