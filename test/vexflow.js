const assert = require('assert');
const MidiWriter = require('..');

function mockNote(noteType='n', duration='8', keys=['c/4'], isDotted=false) {
	const result = {
		noteType,
		duration,
		keys,
		isDotted() {
			return isDotted;
		}
	};
	return result;
}

describe('MidiWriterJS', function() {
	describe('#VexFlow()', function() {
		describe('#trackFromVoice', function() {
			it('converts a VexFlow voice into a track', function() {
				const mockVoice = {
					tickables: [
						mockNote('n', '8', ['g#/3']),
						mockNote('n', '8', ['b/3']),
						mockNote('n', '8', ['c#/3']),
						mockNote('r'),
						mockNote('n', '8', ['b/3']),
						mockNote('r'),
						mockNote('n', '8', ['c#/3']),
						mockNote('n', '8', ['b/3']),
						mockNote('n', '8', ['a#/3']),
						mockNote('r'),
						mockNote('n', '8', ['b/3']),
						mockNote('r')
					]
				};

				const vexFlow = new MidiWriter.VexFlow();
				const track = vexFlow.trackFromVoice(mockVoice);
				const write = new MidiWriter.Writer(track);
				assert.strictEqual('TVRoZAAAAAYAAAABAIBNVHJrAAAATACQOEBAgDhAAJA7QECAO0AAkDFAQIAxQECQO0BAgDtAQJAxQECAMUAAkDtAQIA7QACQOkBAgDpAQJA7QECAO0BAkAAAAIAAAAD/LwA=', write.base64());
			});

			it('preserves multiple rests', function() {
				const mockVoice = {
					tickables: [
						mockNote(),
						mockNote('r'),
						mockNote('r'),
						mockNote('')
					]
				};

				const vexFlow = new MidiWriter.VexFlow();
				const track = vexFlow.trackFromVoice(mockVoice);
				const write = new MidiWriter.Writer(track);
				assert.strictEqual('TVRoZAAAAAYAAAABAIBNVHJrAAAAFQCQPEBAgDxAgQCQAAAAgAAAAP8vAA==', write.base64());
			});

			it('appends trailing rests with a silent note', function() {
				const mockVoice = {
					tickables: [
						mockNote(),
						mockNote(),
						mockNote('r'),
						mockNote('r')
					]
				};

				const vexFlow = new MidiWriter.VexFlow();
				const track = vexFlow.trackFromVoice(mockVoice);
				const write = new MidiWriter.Writer(track);
				assert.strictEqual('TVRoZAAAAAYAAAABAIBNVHJrAAAAHQCQPEBAgDxAAJA8QECAPECBAJAAAACAAAAA/y8A', write.base64());
			});
		});

		describe('#convertPitch()', function() {
			it('converts notes from VexFlow format', function () {
				const vexNote = 'c/4';
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('c4', vexFlow.convertPitch(vexNote));
			});
		});

		describe('#convertDuration()', function() {
			it('converts whole notes', function () {
				const tickable = mockNote('n', 'w');
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('1', vexFlow.convertDuration(tickable));
			});
			it('converts half notes', function () {
				const tickable = mockNote('n', 'h');
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('2', vexFlow.convertDuration(tickable));
			});
			it('converts quarter notes', function () {
				const tickable = mockNote('n', 'q');
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('4', vexFlow.convertDuration(tickable));
			});
			it('converts eighth notes', function () {
				const tickable = mockNote('n', '8');
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('8', vexFlow.convertDuration(tickable));
			});
			it('dotted half notes', function () {
				const tickable = mockNote('n', 'h', ['c4'], true);
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('d2', vexFlow.convertDuration(tickable));
			});
			it('converts dotted quarter notes', function () {
				const tickable = mockNote('n', 'q', ['c4'], true);
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('d4', vexFlow.convertDuration(tickable));
			});
			it('converts dotted eighth notes', function () {
				const tickable = mockNote('n', '8', ['c4'], true);
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('d8', vexFlow.convertDuration(tickable));
			});
			it('returns other durations', function () {
				const tickable = mockNote('n', '64', ['c4'], true);
				const vexFlow = new MidiWriter.VexFlow();
				assert.strictEqual('64', vexFlow.convertDuration(tickable));
			});
		});
	});
});
