/* This builds a PAC actor. */

define(function() {
	function linkPAC(overallActor, Presentation, Abstraction, Control) {
		overallActor.abstraction = new Abstraction();
		overallActor.presentation = new Presentation(overallActor.abstraction);
		overallActor.control = new Control(overallActor.abstraction, overallActor.presentation);
	}
	return linkPAC
});