// This script is copied from page http://codylindley.com/blogstuff/js/tooltip/tooltip.htm
	
//Edit the informaiton between the quotes below with the path to your image.
var imagePath = "./scripts/tooltiparrow.gif";

function addwarning(){
	var thealinks = document.getElementsByTagName("a");
	if (!thealinks) { return; }

	for(var x=0; x!=thealinks.length; x++){

		//if(thealinks[x].className == "addToolTip"){
		if(thealinks[x].title != ""){
			thealinks[x].setAttribute("tooltiptext",thealinks[x].title);
			thealinks[x].setAttribute("class","ToolTipLink");
			thealinks[x].removeAttribute("title");
			thealinks[x].onmouseover=function gomouseover(){ ddrivetip(this.getAttribute("tooltiptext")) };
			thealinks[x].onmouseout=function gomouseout(){ hideddrivetip(); };
		}
	}
}

// Placement of Tooltip
var offsetfromcursorX=-7; //Customize x offset of tooltip
var offsetfromcursorY=23; //Customize y offset of tooltip

var offsetdivfrompointerX=13; //Customize x offset of tooltip DIV relative to pointer image
var offsetdivfrompointerY=13; //Customize y offset of tooltip DIV relative to pointer image. Tip: Set it to (height_of_pointer_image-1).

document.write('<div id="theToolTip"></div>'); //write out tooltip DIV
document.write('<img id="ToolTipPointer" src="'+imagePath+'">'); //write out pointer image

var ie=document.all;
var ns6=document.getElementById && !document.all;
var enabletip=false;
if (ie||ns6) {
	var tipobj=document.all? document.all["theToolTip"] : document.getElementById? document.getElementById("theToolTip") : "";
}

var pointerobj=document.all? document.all["ToolTipPointer"] : document.getElementById? document.getElementById("ToolTipPointer") : "";

function ietruebody(){
	return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body;
}

// Show Tooltip
function ddrivetip(thetext, thewidth, thecolor){
	if (ns6||ie){
		if (typeof thewidth!=="undefined") {tipobj.style.width=thewidth+"px";}
		if (typeof thecolor!=="undefined" && thecolor!=="") {tipobj.style.backgroundColor=thecolor;}
		tipobj.innerHTML=thetext;
		enabletip=true;
		return false;
	}
}

function positiontip(e){
	if (enabletip){
		var nondefaultpos=false;
		var curX=(ns6)?e.pageX : event.clientX+ietruebody().scrollLeft;
		var curY=(ns6)?e.pageY : event.clientY+ietruebody().scrollTop;
		//Find out how close the mouse is to the corner of the window
		var winwidth=ie&&!window.opera? ietruebody().clientWidth : window.innerWidth-20;
		var winheight=ie&&!window.opera? ietruebody().clientHeight : window.innerHeight-20;

		var rightedge=ie&&!window.opera? winwidth-event.clientX-offsetfromcursorX : winwidth-e.clientX-offsetfromcursorX;
		var bottomedge=ie&&!window.opera? winheight-event.clientY-offsetfromcursorY : winheight-e.clientY-offsetfromcursorY;

		var leftedge=(offsetfromcursorX<0)? offsetfromcursorX*(-1) : -1000;

		//if the horizontal distance isn't enough to accomodate the width of the context menu
		if (rightedge<tipobj.offsetWidth){
			//move the horizontal position of the menu to the left by it's width
			tipobj.style.left=curX-tipobj.offsetWidth+"px";
			nondefaultpos=true;
		}
		else if (curX<leftedge)
			{tipobj.style.left="5px";}
		else{
			//position the horizontal position of the menu where the mouse is positioned
			tipobj.style.left=curX+offsetfromcursorX-offsetdivfrompointerX+"px";
			pointerobj.style.left=curX+offsetfromcursorX+"px";
		}

		//same concept with the vertical position
		if (bottomedge<tipobj.offsetHeight){
			tipobj.style.top=curY-tipobj.offsetHeight-offsetfromcursorY+"px";
			nondefaultpos=true;
		}
		else{
			tipobj.style.top=curY+offsetfromcursorY+offsetdivfrompointerY+"px";
			pointerobj.style.top=curY+offsetfromcursorY+"px";
		}
		tipobj.style.visibility="visible";
		if (!nondefaultpos) {pointerobj.style.visibility="visible";}
		else{
			pointerobj.style.visibility="hidden";
		}
	}
}

// Hide Tooltip
function hideddrivetip(){
	if (ns6||ie){
		enabletip=false;
		tipobj.style.visibility="hidden";
		pointerobj.style.visibility="hidden";
		tipobj.style.left="-1000px";
		tipobj.style.backgroundColor='';
		tipobj.style.width='';
	}
}

document.onmousemove=positiontip;
addwarning();