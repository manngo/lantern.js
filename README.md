Lantern
=======

Mark Simon

Sample
------

Click [Here](https://manngo.github.io/lantern.js/sample/lantern.html) for the sample …

Introduction
------------

This script is a light-weight light box clone.

To use:

1.	Copy the lantern.js and the  lantern.css files somewhere

2.	Around your thumbnail images:

		<a href="..."><img ... alt="…" title="…"></a>

	Your href should be the location of the enlarged image.
	Your img src is probably your thumbnail.

	Your thumbnail images are expected to have an alt attribute.
	They will also need a title attribute, since this is what will appear as the tile of the image.

3.	Head Section:

		<link rel="stylesheet" type="text/css" href="…/lantern.css"/>
		<script type="text/javascript" src="…/lantern.js"></script>
		<script type="text/javascript">
			function init() {
				var options = { … };
				lantern('div#slides a',options);
			}
		</script>

4.	The selector ```div#slides a``` includes tha actual anchor elements which are to be hijacked.

5.	Options are, well, optional. Set them as an abject as follows:

		var options = {
			background:	'background',	//	id of background
			div:		'lantern',		//	id of container
			title:		'title',		//	id of title
			showing:	'showing',		//	attribute when showing
			escape:		false,			//	whether responds to escape key
			delay:		0,				//	delay (ms) before hiding

			//	new
			dblclick:	false,			//	whether to use double-click
			draggable:	false,			//	whether to allow dragging
			callback:		undefined,		//	callback on showing
			callbackOn:		undefined,		//	callback on both
			callbackOff:	undefined,		//	callback on hiding
		};

6.	The (sample) CSS file comes in three parts. Feel free to tweak as much as you like, but note the following:

	1.	The essential CSS required for the effect to work at all.
	2. Some more basic CSS to make it look complete.
	3. Some CSS3 to make the whole thing look spectacular.

		Obviously, the CSS won’t work in Legacy™ Browsers.

Disclaimer
----------

This script probably works and it does what it does.  
What it doesn’t do it doesn’t do. E & OE

To do
-----

1.	Incorporate slide show.
2.	Incorporate span for additional descriptive text:

		<a href="..." class="light"><img ... /><span>Description</span></a>

3.	Re-consider whether the selector above needs to include the a.
