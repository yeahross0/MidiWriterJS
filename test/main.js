const assert = require('assert');
const MidiWriter = require('..');

describe('MidiWriterJS', function() {
	describe('#NoteEvent()', function () {
		describe('#getTickDuration()', function () {
			it('should create a dotted half note if passed three quarter notes.', function () {
				const track = new MidiWriter.Track(); // Need to instantiate to build note object
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: ['4', '4', '4']});
				track.addEvent(note);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADQCQPECDAIA8QAD/LwA=', write.base64());
			});

			it('should create a note with duration of 50 ticks if passed T50', function () {
				const track = new MidiWriter.Track(); // Need to instantiate to build note object
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: 'T50'});
				track.addEvent(note);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADACQPEAygDxAAP8vAA==', write.base64());
			});
		});
	});

	describe('#Track()', function() {
		describe('#Time Signature', function() {
			it('should return specific base64 string when time signature is 4/4', function() {
				const track = new MidiWriter.Track();
				track.setTimeSignature(4, 4);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADAD/WAQEAhgIAP8vAA==', write.base64());
			});

			it('should return specific base64 string when time signature is 2/2', function() {
				const track = new MidiWriter.Track();
				track.setTimeSignature(2, 2);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADAD/WAQCARgIAP8vAA==', write.base64());
			});

			it('should return specific base64 string when time signature is 2/8', function() {
				const track = new MidiWriter.Track();
				track.setTimeSignature(2, 8);
				const write = new MidiWriter.Writer(track);
				assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAADAD/WAQCAxgIAP8vAA==', write.base64());
			});
		});

		it('should return specific base64 string when setting C major key signature', function() {
			const track = new MidiWriter.Track();
			track.setKeySignature('C');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAACgD/WQIAAAD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding copyright', function() {
			const track = new MidiWriter.Track();
			track.addCopyright('2018 Garrett Grimm');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAGgD/AhIyMDE4IEdhcnJldHQgR3JpbW0A/y8A', write.base64());
		});

		it('should return specific base64 string when adding text', function() {
			const track = new MidiWriter.Track();
			track.addText('MidiWriterJS is the bomb!');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAIQD/ARlNaWRpV3JpdGVySlMgaXMgdGhlIGJvbWIhAP8vAA==', write.base64());
		});

		it('should return specific base64 string when adding a track name', function() {
			const track = new MidiWriter.Track();
			track.addTrackName('Name of a cool track');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAHAD/AxROYW1lIG9mIGEgY29vbCB0cmFjawD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding an instrument name', function() {
			const track = new MidiWriter.Track();
			track.addInstrumentName('Alto Saxophone');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAFgD/BA5BbHRvIFNheG9waG9uZQD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding a marker', function() {
			const track = new MidiWriter.Track();
			track.addMarker('This is my favorite part of the song.');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAALQD/BiVUaGlzIGlzIG15IGZhdm9yaXRlIHBhcnQgb2YgdGhlIHNvbmcuAP8vAA==', write.base64());
		});

		it('should return specific base64 string when adding a cue point', function() {
			const track = new MidiWriter.Track();
			track.addCuePoint('Here is a cue point.');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAHAD/BxRIZXJlIGlzIGEgY3VlIHBvaW50LgD/LwA=', write.base64());
		});

		it('should return specific base64 string when adding a lyric', function() {
			const track = new MidiWriter.Track();
			track.addLyric('Oh say can you see.');
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAAGwD/BRNPaCBzYXkgY2FuIHlvdSBzZWUuAP8vAA==', write.base64());
		});

		it('should return specific base64 string when adding a controller change event', function() {
			const track = new MidiWriter.Track();
			track.controllerChange(1, 127);
			const write = new MidiWriter.Writer(track);
			assert.equal('TVRoZAAAAAYAAAABAIBNVHJrAAAACACwAX8A/y8A', write.base64());
		});
	});

	describe('#Utils()', function() {
		describe('#stringToBytes()', function () {
			it('should return [116, 101, 115, 116] when "test" is passed.', function () {
				assert.equal([116, 101, 115, 116].toString(), MidiWriter.Utils.stringToBytes('test').toString());
			});
		});

		describe('#isNumeric()', function () {
			it('should return false when "t" is passed.', function () {
				assert.equal(false, MidiWriter.Utils.isNumeric('t'));
			});
		});

		describe('#getPitch()', function () {
			it('should return 101 when "F7" is passed.', function () {
				assert.equal(101, MidiWriter.Utils.getPitch('F7'));
			});
		});

		describe('#getPitch()', function () {
			it('should return 72 (C5) when "B#4" is passed.', function () {
				assert.equal(72, MidiWriter.Utils.getPitch('B#4'));
			});
		});

		describe('#stringByteCount()', function () {
			it('should return 7 when "Garrett" is passed.', function () {
				assert.equal(7, MidiWriter.Utils.stringByteCount('Garrett'));
			});
		});

		describe('#numberFromBytes()', function () {
			it('should return 8463 when [0x21, 0x0f] is passed.', function () {
				assert.equal(8463, MidiWriter.Utils.numberFromBytes([0x21, 0x0f]));
			});
		});

		describe('#numberToBytes()', function () {
			it('should return [0, 5] when converting the number 5 into two bytes.', function() {
				assert.equal([0, 5].toString(), MidiWriter.Utils.numberToBytes(5,2));
			});
		});

		describe('#getDurationMultiplier()', function () {
			it('should return 1 for a quarter note.', function () {
				const note = new MidiWriter.NoteEvent({pitch: 'C4', duration: '4'});
				assert.equal(MidiWriter.Utils.getDurationMultiplier(note.duration), 1);
			});
		});

	});
});
