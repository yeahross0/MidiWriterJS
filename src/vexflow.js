import {NoteEvent} from './note-events/note-event';
import {Track} from './track';

class VexFlow {

	/**
	 * Support for converting VexFlow voice into MidiWriterJS track
	 * @return MidiWriter.Track object
	 */
	trackFromVoice(voice) {
		const track = new Track();
		let wait = [];

		voice.tickables.forEach(tickable => {
			if (tickable.noteType === 'n') {
				track.addEvent(new NoteEvent({
					pitch: tickable.keys.map(this.convertPitch),
					duration: this.convertDuration(tickable),
					wait
				}));
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
		return 'd'.repeat(note.dots) + this.convertBaseDuration(note.duration) + (note.tuplet ? 't' + note.tuplet.num_notes : '');
	}

	/**
	 * Converts VexFlow base duration syntax to MidiWriterJS syntax
	 * @param duration Vexflow duration
	 * @returns MidiWriterJS duration
	 */
	convertBaseDuration(duration) {
		switch (duration) {
			case 'w':
				return '1';
			case 'h':
				return '2';
			case 'q':
				return '4';
			default:
				return duration;
		}
	}
}

export {VexFlow};
