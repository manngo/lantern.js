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
			background:		'background',	//	id of background
			div:			'lantern',		//	id of container
			title:			'title',		//	id of title
			showing:		'showing',		//	attribute when showing
			escape:			false,			//	whether responds to escape key
			dblclick:		false,			//	whether double-click required
			draggable:		false,			//	whether to allow dragging
			delay:			0,				//	delay (ms) before hiding
			callback:		undefined,		//	callback on showing
			callbackOn:		undefined,		//	callback on both
			callbackOff:	undefined,		//	callback on hiding
		};

	Disclaimer:

	This script probably works and it does what it does.
	What it doesn’t do it doesn’t do. E & OE

	To do:

	1.	Incorporate slide show.
	2.	Incorporate div for additional descriptive text:
		<a href="..." class="light"><img ... /><div>Description</div></a>
	3.	Re-consider whether the selector above needs to include the a.

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

			options.dblclick=!!options.dblclick;
			options.draggable=!!options.draggable;

			options.callback=options.callback||undefined;
			options.callbackOn=options.callbackOn||undefined;
			options.callbackOff=options.callbackOff||undefined;

		/*	Create Lantern Elements
			================================ */

			var background,div,img,title;

			background=document.createElement('div');
			background.setAttribute('id',options.background);

				div=document.createElement('div');
				div.setAttribute('id',options.div);
				if(options.draggable) {
					draggable();
					div.ondblclick=doCentre;
				}

				if(options.dblclick)  background.ondblclick=hide;
				else background.onclick=hide;

				background.appendChild(div);

					img=document.createElement('img');
					div.appendChild(img);

					title=document.createElement('div');
					title.setAttribute('id',options.title);
					div.appendChild(title);

			document.body.appendChild(background);

		/*	Acivate Images
			================================ */

			var i,images,x=null;
			images=document.querySelectorAll(selector);

			if(!images.length) return false;

			for(i=0;i<images.length;i++) {
				images[i].onmousedown=doMousedown;
				images[i].onmouseup=doMouseup;
//				images[i].onclick=doClick;


				if(options.dblclick) {
					images[i].onclick=function(e) { return false; };
					images[i].ondblclick=function(e) {
						show(this);
						return false;
					};
				}
				else {
					images[i].onclick=function(e) {
						show(this);
						return false;
					};
				}
			}

		/*	Event Functions
			================================ */
			function doMousedown(event) {	//	Position of mouse down
				event=event||window.event;
				x=event.clientX;
			}
			function doMouseup(event) {	//	If not moved
				event=event||window.event;
//				if(event.clientX==x) show(this);
				return false;
			}
			function doClick(event) {		//	Ignore actual click
				return false;
			}

		/*	Display Functions
			================================ */

			function deSelect () {
				//	Deselect everything
				if (window.getSelection) window.getSelection().removeAllRanges();
				else if (document.selection.createRange) document.selection.empty ();
			}

			function doShow(a) {
				//	Adjust size & position
				div.style.width=div.clientWidth+'px';
				title.textContent=a.querySelector('img').title||a.querySelector('img').alt;
				if(!div.dragged) doCentre();
				background.setAttribute(options.showing,true);
				div.setAttribute(options.showing,true);
				img.setAttribute(options.showing,true);
			}
			function show(a) {
				if(options.callbackOn) options.callbackOn();
				background.style.display='block';
				title.textContent='';
//				title.textContent=a.querySelector('img').title||a.querySelector('img').alt;
				img.onload=function() {
					doShow(a);
				}
				img.src=a.href;

				if(options.escape) window.addEventListener('keypress',doEscape,false);
				deSelect();
				if(options.callback) options.callback();
			}

			function doEscape(event) {
				event = event || window.event;
				if (event.keyCode == 27) {
					doHide();
					window.removeEventListener('keypress',doEscape,false)
				}
			}
			function hide(event) {
				event=event||window.event;
				var target=event.target||event.srcElement;
				if(target!=background) return;
				if(options.callback) options.callback();
				doHide();
				if(options.callbackOff) options.callbackOff();
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
			function doCentre() {
				div.style.left = (window.innerWidth - div.offsetWidth)/2 + 'px';
				div.style.top = (window.innerHeight - div.offsetHeight)/2 + 'px';
			}

		function draggable() {
//			element.style.position='absolute';
			div.activateDrag=function() {
				div.onmousedown=startDrag;
			};

			function startDrag(event) {
				div.dragged=true;
				//	Element Position
					div.left=div.offsetLeft;
					div.top =div.offsetTop;
				//	Mouse Position
					div.startX=event.clientX;
					div.startY=event.clientY;

				//	Enable Drag & Drop Events
					document.onmousemove=drag;
					document.onmouseup=release;

				//	Change Appearance
					div.style.cursor='move';
					div.style.opacity='.60';
					div.style.filter='alpha(opacity=60)';

				return false;
			}

			function drag(e) {
				var event=e||window.event;
				div.style.left=div.left + event.clientX - div.startX + 'px';
				div.style.top =div.top  + event.clientY - div.startY + 'px';
				return false;
			}

			function release(e) {
				document.onmousemove=null;
				document.onmouseup=null;
				div.style.opacity=div.style.filter=null;
				div.style.cursor=null;
			}

			div.activateDrag();

		}

	}

/*	Function say
	================================================

	Display message on screen

	================================================ */


		function say(message) {
			var div=document.createElement('div');
			//	div.style.cssText='';
			div.setAttribute('id','message');

			div.style.cssText='width: 200px; height: 200px;\
				overflow: auto; position: fixed;\
				right: 20px; top: 20px; white-space: pre-wrap;\
				border: thin solid #666;\
				box-shadow: 4px 4px 4px #666;\
				padding: 1em; font-family: monospace;';

			document.body.appendChild(div);
			say=function(message) {
				div.textContent+=message+'\n';
			};
			say(message);
		}
