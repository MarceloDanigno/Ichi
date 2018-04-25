import { Component , ViewChild , AfterViewInit } from '@angular/core';
import { NavController , Platform } from 'ionic-angular';

@Component({
  selector: 'game',
  templateUrl: 'game.html'
})
export class  game 
{
	@ViewChild('currentcolor') currentcolor ;
	@ViewChild('content') ioncontent ;
	@ViewChild('select') selectfield ;
	@ViewChild('cards') cardfield ;
	screenwidth: number = 0;
	numcards: number = 0;
  numcardsselect: number = 0;
	hand: any[] = [];
	selectcards: any[] = [];
	constructor(public navCtrl: NavController, platform:Platform) 
	{
		/*variable declarations and start-up*/ 
		//setInterval(()=>{this.displaytext();},2000);
		platform.ready().then((readySource)=> 
		{
				this.screenwidth = 0;
				this.numcards = 0;
				console.log(this.ioncontent); 
				console.log('Width: ' + platform.width());
			 	console.log('Height: ' + platform.height());
		});
	}
	selectshow(event)
	{
		var posX = event.clientX;
		this.screenwidth = (this.cardfield.nativeElement.offsetWidth);
		this.selectfield.nativeElement.innerHTML = ""; //clears selectfield
		var locationsum = ((this.screenwidth - 100)/(this.numcards + 1));
		var currentsum = locationsum + 50;
		let i: number = 0;
		this.selectcards = [];
		var locationcard;
		this.numcardsselect = 0;
		while (i < (this.numcards))
		{
			locationcard = currentsum - 50 + 15; //15 margin/padding?
			if ((posX >= (locationcard - 5)) && (posX <= (locationcard + 100 + 5)))
			{
				this.selectcards.push(i);
				this.numcardsselect = this.numcardsselect + 1;
			}
			currentsum = currentsum + locationsum;
			i= i+1;
  	}
		var locationsum = ((this.screenwidth - 100)/(this.numcardsselect + 1));
		var currentsum = locationsum + 50;
		i = 0;
		while (i < this.numcardsselect)
		{
  		var string =  String(this.cardfield.nativeElement.children[this.selectcards[i]].outerHTML);
  		this.selectfield.nativeElement.insertAdjacentHTML('beforeend', string);
  		this.selectfield.nativeElement.children[i].addEventListener("click",(event: Event) =>{this.removecard(event);});
  		// swipe up gesture
  		this.selectfield.nativeElement.children[i].style.left = ((currentsum - 50).toString(10)) + "px";
  		this.selectfield.nativeElement.children[i].style.zIndex = i;
  		currentsum = currentsum + locationsum;
  		i = i + 1;
  	}
  }
	drawcard()
	{

		/*do verificaton if its turn*/
    // var boolreturn = server.getdata()
    //if boolreturn == "True": 
		/*start code*/

		this.screenwidth = (this.cardfield.nativeElement.offsetWidth);
		var currentzindex = 0;
		this.numcards = this.numcards + 1;
		var locationsum = ((this.screenwidth - 100)/(this.numcards + 1)); 
		var currentsum = locationsum + 50; //curentsum minumum value = 100
		
		/*do verificatonif its turn*/
		//get json of card from server
    // var serverdata = server.getdata()
    // var cartaadd = JSON.parse(serverdata);
    var cartaadd = {number:1, color:"blue"} //save json data in this variable
		/*start code*/

		this.hand.push(cartaadd);
		var htmlstring = ((cartaadd.number).toString(10)) + cartaadd.color;
		var string = '<ion-img class="card img-loaded" src="../assets/imgs/'+ htmlstring +'.png ng-reflect-src="../assets/imgs/'+ htmlstring +'.png"><img src="../assets/imgs/'+ htmlstring +'.png" alt=""></ion-img>';
		this.cardfield.nativeElement.insertAdjacentHTML('beforeend', string);
		//creates an html element in the end of children list
		this.cardfield.nativeElement.children[this.numcards - 1].addEventListener("click",(event: Event) =>{this.selectshow(event);});
		//add a valid click event that calls a function
		let i: number = 0;
		while(i < (this.numcards))
		{ // also works -> var cards = this.cardfield.nativeElement.querySelectorAll('.card')
			this.cardfield.nativeElement.children[i].style.left = ((currentsum - 50).toString(10)) + "px";
			this.cardfield.nativeElement.children[i].style.zIndex = i;
			currentsum = currentsum + locationsum;
			i = i + 1;
	  }
	}
	removecard(event)
	{
    //branch to different code when used cardfield or change this.numcardsselect 
		var posX = event.clientX;
		this.screenwidth = (this.cardfield.nativeElement.offsetWidth);
		var locationsum = ((this.screenwidth - 100)/((this.selectcards).length + 1));
		var currentsum = locationsum + 50;
		let i: number = 0;
		var locationcard;
		var numcardsselect = 0;
		var cardtoremove;
		while (i < (this.numcardsselect))
		{
			locationcard = currentsum - 50;
			if ((posX >= (locationcard - 5)) && (posX <= (locationcard + 100 + 5))) //get card to remove
			{
				cardtoremove = this.selectcards[i];
				break;
			}
			currentsum = currentsum + locationsum;
			i= i+1;
		}
    var text = this.cardfield.nativeElement.children[cardtoremove].innerHTML.replace('<img src="../assets/imgs/',"");
    text = text.replace('.png" alt="">',"");
    var lenght = text.lenght;
    var numbercard = text[0];
    var colorcard = text.slice(1,lenght);
    var serverdata = '{ "number" : ' + numbercard + ' , "color": ' +'"'+ colorcard +'"'+ ' }';

		/*send card to server*/
		/*do verification*/
    // var boolreturn = server.getdata()
    //if boolreturn == "True": 
		/*start code*/

    this.selectfield.nativeElement.innerHTML = ""; //clears selectfield
    this.selectcards = []; // both of these lines also in the boolreturn == "False" code
		var currentzindex = 0;
		this.numcards = this.numcards -1;
		var locationsum = ((this.screenwidth - 100)/(this.numcards + 1)); 
		var currentsum = locationsum + 50; //curentsum minumum value = 50
		this.cardfield.nativeElement.children[cardtoremove].remove();
		this.hand.splice(cardtoremove, 1);
		i = 0;
		while(i < (this.numcards))
		{ 
			this.cardfield.nativeElement.children[i].style.left = ((currentsum - 50).toString(10)) + "px";
			this.cardfield.nativeElement.children[i].style.zIndex = i;
			currentsum = currentsum + locationsum;
			i = i + 1;
	  }
	}
	displaytext()
	{
		/*console.log(this.currentcolor.nativeElement.firstChild.data) ;
		console.log(this.ioncontent._elementRef.nativeElement.className) ;*/
		/*this.ioncontent._elementRef.nativeElement.className = 'newcolor'; change to another class*/
		/*this.ioncontent._elementRef.nativeElement.style.backgroundColor = "red"; change css data */
		//console.log(this.ioncontent._elementRef.nativeElement.style.backgroundColor) ;
	}
	ionViewDidLoad() 
	{
  	/* setup code and boolean variables */
		  this.ioncontent._elementRef.nativeElement.style.backgroundColor = "white";
	}
	colorchange () 
	{
  	var backgroundcolor = this.ioncontent._elementRef.nativeElement.style.backgroundColor;
    if (backgroundcolor == "white")
    {
    	this.ioncontent._elementRef.nativeElement.style.backgroundColor = "lightblue"
    }
    else
    {
    	if (backgroundcolor == "lightblue")
    	{
    			this.ioncontent._elementRef.nativeElement.style.backgroundColor = "grey"
    	}
    	else
    	{
    			this.ioncontent._elementRef.nativeElement.style.backgroundColor = "white"
    	}
    }
 	}
}