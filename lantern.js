/*	Lantern
	================================================

	Mark Simon

	This script is a stripped-down light box clone.
	To use:

	1.	Copy the lantern.js and the  lantern.css files somewhere

	2.	Around your thumbnail images:

		<a href="..."><img ... alt="…" title="…"></a>

		Your href should be the location of the enlarged image.
		Your img src is probably your thumbnail.

		Your thumbnail images are expected to have an alt attribute.
		They will also need a title attribute, since this is what
		will appear as the tile of the image.

	3.	Head Section:

		<link rel="stylesheet" type="text/css" href="…/lantern.css"/>
		<script type="text/javascript" src="…/lantern.js"></script>
		<script type="text/javascript">
			function init() {
				var options = { … };
				lantern('div#slides a',options);
			}
		</script>

	4.	Options

		are, well, optional. Set them as an abject as follows:

		var options = {
			background:	'background',	//	id of background
			div:		'lantern',		//	id of container
			title:		'title',		//	id of title
			showing:	'showing',		//	attribute when showing
			escape:		false,			//	whether responds to escape key
			delay:		0,				//	delay (ms) before hiding
		};

	Disclaimer:

	This script probably works and it does what it does.
	What it doesn’t do it doesn’t do. E & OE

	To do:

	1.	Incorporate slide show.
	2.	Incorporate div for additional descriptive text:
		<a href="..." class="light"><img ... /><div>Description</div></a>
	3.	Implement callback functions

	================================================ */

	function lantern(selector,options) {
		options=options||{};

		/*	Option Defaults
			================================ */

			options.div=options.div||'lantern';
			options.background=options.background||'background';
			options.title=options.title||'title';
			options.showing=options.showing||'showing';

			options.escape=!!options.escape;
			options.delay=parseInt(options.delay,10);

		/*
			================================ */

		var i,images;
		var background,div,img,title;

		background=document.createElement('div');
		background.setAttribute('id',options.background);
		background.onclick=hide;

			div=document.createElement('div');
			div.setAttribute('id',options.div);

			background.appendChild(div);

				img=document.createElement('img');
				div.appendChild(img);

				title=document.createElement('div');
				title.setAttribute('id',options.title);
				div.appendChild(title);

		document.body.appendChild(background);

		images=document.querySelectorAll(selector);

		if(!images.length) return false;
		for(i=0;i<images.length;i++) {
			images[i].onclick=function(e) {
				show(this);
				return false;
			};
		}

		function show(a) {
	//		var event=event||window.event;
	//		var target=event.target||event.srcElement;
			background.style.display='block';
			img.src=a.href;
			title.textContent='';
			div.style.width=div.clientWidth+'px';
			title.textContent=a.querySelector('img').title||a.querySelector('img').alt;
			div.style.left = (window.innerWidth - div.offsetWidth)/2 + 'px';
			div.style.top = (window.innerHeight - div.offsetHeight)/2 + 'px';
			background.setAttribute(options.showing,true);
			div.setAttribute(options.showing,true);
			img.setAttribute(options.showing,true);

			if(options.escape) window.addEventListener('keypress',doEscape,false);

		}
		function doEscape(event) {
			event = event || window.event;
			if (event.keyCode == 27) doHide();
		}
		function hide(event) {
			event=event||window.event;
			var target=event.target||event.srcElement;
			if(target!=background) return;
			doHide();
		}
		function doHide() {
			background.removeAttribute(options.showing);
			div.removeAttribute(options.showing);
			img.removeAttribute(options.showing);
			if(options.delay) window.setTimeout(hideBackground,options.delay);
			else hideBackground();

			function hideBackground() {
				background.style.display='none';
			}
		}

	}
