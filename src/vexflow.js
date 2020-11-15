import {NoteEvent} from './note-events/note-event';
import {Track} from './track';

class VexFlow {

	constructor() {
		// code...
	}

	/**
	 * Support for converting VexFlow voice into MidiWriterJS track
	 * @return MidiWriter.Track object
	 */
	trackFromVoice(voice) {
		var track = new Track();
		var wait = [];
		var pitches = [];

		voice.tickables.forEach(tickable => {
			pitches = [];

			if (tickable.noteType === 'n') {
				tickable.keys.forEach(key => {
					// build array of pitches
					pitches.push(this.convertPitch(key));
				});
				track.addEvent(new NoteEvent({pitch: pitches, duration: this.convertDuration(tickable), wait: wait}));

				// reset wait
				wait = [];

			} else if (tickable.noteType === 'r') {
				// move on to the next tickable and add this to the stack
				// of the `wait` property for the next note event
				wait.push(this.convertDuration(tickable));
				return;
			}

		});

		// There may be outstanding rests at the end of the track,
		// pad with a ghost note (zero duration and velocity), just to capture the wait.
		if(wait.length > 0) {
		track.addEvent(new NoteEvent({pitch: '[c4]', duration: '0', wait, velocity: '0'}));
		}

		return track;
	}


	/**
	 * Converts VexFlow pitch syntax to MidiWriterJS syntax
	 * @param pitch string
	 */
	convertPitch(pitch) {
		return pitch.replace('/', '');
	}


	/**
	 * Converts VexFlow duration syntax to MidiWriterJS syntax
	 * @param note struct from VexFlow
	 */
	convertDuration(note) {
		switch (note.duration) {
			case 'w':
				return '1';
			case 'h':
				return note.isDotted() ? 'd2' : '2';
			case 'q':
				return note.isDotted() ? 'd4' : '4';
			case '8':
				return note.isDotted() ? 'd8' : '8';
		}

		return note.duration;
	}
}

export {VexFlow};
