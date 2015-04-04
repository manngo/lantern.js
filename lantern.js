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
		will appear as the caption of the image.

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
			info:			'info',			//	id of info
			caption:		'caption',		//	id of image caption
			box:			false,			//	whether to use a fixed (existing container)
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
	2.	Incorporate span for additional descriptive text:
		<a href="..." class="light"><img ... /><span>Description</span></a>
	3.	Re-consider whether the selector above needs to include the a.
	4.	Consider proprietary filters for Legacy Browsers.

	New:

	Added Navigation Buttons
	Added info container, which contains:

		[previous]Caption[next]

	================================================ */

	function lantern(selector,options) {

		options=options||{};

		/*	Option Defaults
			================================ */

			options.box=!!options.box;
			options.multiple=!!options.multiple;
			options.div=options.div||'lantern';
			options.background=options.background||'background';
			options.info=options.caption||'info';
			options.caption=options.caption||'caption';
			options.showing=options.showing||'showing';

			options.escape=!!options.escape;
			options.delay=parseInt(options.delay,10);

			options.dblclick=!!options.dblclick;
			options.draggable=!!options.draggable;

			options.callback=options.callback||undefined;
			options.callbackOn=options.callbackOn||undefined;
			options.callbackOff=options.callbackOff||undefined;

			options.navigation=!!options.navigation;

		/*	Create Lantern Elements
			================================ */

			var background,div,img,info,caption,previous=null,next=null;
			var head, style, css;

				if(options.box) div=document.getElementById(options.div);
				else {
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
					document.body.appendChild(background);
				}

					img=document.createElement('img');
					div.appendChild(img);

					info=document.createElement('div');
					info.setAttribute('id',options.info);
					caption=document.createElement('div');
					caption.setAttribute('id',options.caption);

					if(options.navigation) {
						previous=document.createElement('button');
						previous.innerHTML='&lsaquo;';
						previous.onclick=doPrevious;
						previous.setAttribute('id',options.div+'-previous');
						info.appendChild(previous);

						info.appendChild(caption);

						next=document.createElement('button');
						next.innerHTML='&rsaquo;';
						next.onclick=doNext;
						next.setAttribute('id',options.div+'-next');
						info.appendChild(next);
					}
					else info.appendChild(caption);
					div.appendChild(info);

		/*	Essential CSS
			================================ */

			head = document.getElementsByTagName('head')[0];
			style = document.createElement('style');
			style.type = 'text/css';

			css=[];
//			css.push('div#%s, div#%s, div#%s { -moz-box-sizing: border-box; box-sizing: border-box; }'
//				.sprintf(options.background,options.div,options.caption));

			if(!options.box) css.push('div#%s { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0); display: none; }'.sprintf(options.background));

			if(!('opacity' in document.body.style)) css.push('div#%s { background-color: rgb(0,0,0); zoom: 1; filter: alpha(opacity=60); }'.sprintf(options.background));
			css.push('div#%s[%s] { background-color: rgba(0,0,0,.6); }'.sprintf(options.background,options.showing));
			if(!options.box) css.push('div#%s { position: fixed; }'.sprintf(options.div));
			css=css.join('\n');

			if (style.styleSheet) style.styleSheet.cssText = css;
			else style.appendChild(document.createTextNode(css));

			head.insertBefore(style,head.firstChild);

		/*	Acivate Images
			================================ */

			var i,images,x=null,group;
//			if(typeof selector=='string') images=document.querySelectorAll(selector);
//			else images=selector;

			selector=document.querySelectorAll(selector);
			images=[];
			for(var i=0;i<selector.length;i++) images[i]=selector[i].querySelectorAll('a');
//images=images[0];

			if(!images.length) return false;

			for(group=0;group<images.length;group++) {
				for(i=0;i<images[group].length;i++) {
					var a=images[group][i];
					var p;
					a.onmousedown=doMousedown;
					a.onmouseup=doMouseup;
					a.no=i;
					a.group=group;

					p=a.querySelector('p');
					if(p) p.style.display='none';

					if(options.dblclick) {
						a.onclick=function(e) { return false; };
						a.ondblclick=function(e) {
							show(this);
							return false;
						};
					}
					else {
						a.onclick=function(e) {
							show(this);
							return false;
						};
					}
				}
			}

			if(options.box) show(images[0][0]);

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
				var p;
				//	Adjust size & position
					if(!options.box) div.style.width=img.width+'px';

//				if(previous) caption.appendChild(previous);
				p=a.querySelector('p');
				p=p?p.innerHTML:null;
				caption.innerHTML= p || a.querySelector('img').title||a.querySelector('img').alt;
//				if(next) caption.appendChild(next);

				if(!options.box) {
					if(!div.dragged) doCentre();
					background.setAttribute(options.showing,true);
				}

				div.setAttribute(options.showing,true);
				img.setAttribute(options.showing,true);
			}
			function show(a) {
				if(options.callbackOn) options.callbackOn();
				if(!options.box) background.style.display='block';

				img.onload=function() {
					doShow(a);
				};
				img.src=a.href;
				img.no=a.no;
				img.group=a.group;

				if(options.escape) window.addEventListener('keypress',doEscape,false);
				deSelect();
				if(options.callback) options.callback();
			}

			function doEscape(event) {
				event = event || window.event;
				if (event.keyCode == 27) {
					doHide();
					window.removeEventListener('keypress',doEscape,false);
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
			function doNext() {
//				alert(img.no);
//				alert(images.length)
				var n=img.no, g=img.group;
				if(n<images[g].length-1) show(images[g][n+1]);
				else show(images[g][0]);
			}
			function doPrevious() {
				var n=img.no, g=img.group;
				if(n) show(images[g][n-1]);
				else show(images[g][images.length-1]);
			}

/*	Function draggable
	================================================

	Allows an element to be dragged around

	================================================ */

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
		return true;
	}

/*	Function say
	================================================

	Display message on screen

	================================================ */

	function say(message) {
		var div=document.createElement('div');
		//	div.style.cssText='';
		div.setAttribute('id','message');

		div.style.cssText='width: 200px; height: 100px;\
			overflow: auto; position: fixed;\
			right: 20px; bottom: 20px; white-space: pre-wrap;\
			border: thin solid #666; background-color: rgba(255,255,255,.8);\
			box-shadow: 4px 4px 4px #666;\
			padding: 1em; font-family: monospace;';

		document.body.appendChild(div);
		say=function(message) {
			if(message===undefined) div.textContent='';
			else div.textContent+=message+'\n';
		};
		say(message);
	}

/*	String.sprintf
	================================================ */

	String.prototype.sprintf=function() {
		var string=this;
		for(var i=0;i<arguments.length;i++) string=string.replace(/%s/,arguments[i]);
		return string;
	};
