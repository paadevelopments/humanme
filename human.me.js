/*
 * HumanMe ~ beta v1.0.1
 *
 * Author : Paa
 * Dependencies : { jQuery }
 * Extension of { https://github.com/honguangli/jquery-captcha }
 *
 */
(function (global,factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.HumanMe = factory());
}(this, (function () { 'use strict';
const data_set_a = ['A','B','C','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z'];
const data_set_b = ['a','b','c','e','f','g','h','j','k','l','m','n','p','q','r','s','t','w','x','y','z'];
const data_set_c = ['0','1','2','3','4','5','6','7','8','9'];
var HumanMe = function(element, options) {
	const self = this;
	const defaults = {
		length : 6,
		font : 'bold 35px Arial',
		resourceType : 'aA0',
		caseSensitive : true,
		autoRefresh : true,
		progressColor : '#6671F0',
		manualRefresh : true,
		refreshButtonColor : '#6671F0'
	};
	self.element = element;
	self.progress = false;
	self.options = $.extend(true, defaults, options );
	let resource = [];
	if (self.options.resourceType.length > 0) {
		if (self.options.resourceType.indexOf('A') !== -1) { resource = resource.concat(data_set_a);
		}
		if (self.options.resourceType.indexOf('a') !== -1) { resource = resource.concat(data_set_b);
		}
		if (self.options.resourceType.indexOf('0') !== -1) { resource = resource.concat(data_set_c);
		}
	}
	if (resource.length === 0) { resource = data_set_a.concat(data_set_b).concat(data_set_c)
	}
	self.resource = resource;
	self.refresh();
}

HumanMe.prototype.refresh = function() {
	const self = this;
	const canvas = document.createElement('canvas');
	if (self.options.autoRefresh && self.options.manualRefresh) { canvas.width = $(self.element).width() - 100;
	} else if (!self.options.autoRefresh && self.options.manualRefresh) { canvas.width = $(self.element).width() - 50;
	} else if (self.options.autoRefresh && !self.options.manualRefresh) { canvas.width = $(self.element).width() - 50;
	} else { canvas.width = $(self.element).width();
	}
	canvas.height = $(self.element).height();
	const context = canvas.getContext("2d");
	context.font = self.options.font;
	const codes = self.randomCode();
	const spaceWidth = canvas.width - context.measureText(codes.join('')).width - 40;
	const wordSpace = Math.floor(spaceWidth / codes.length);
	let left = wordSpace;
	for (let i = 0; i < codes.length; i++) {
		const deg = Math.random() * 30 * Math.PI / 180;
		const x = left;
		const y = canvas.height / 2 + Math.random() * 10;
		context.translate(x, y);
		context.rotate(deg);
		context.fillStyle = self.randomColor();
		context.fillText(codes[i], 0, 0);
		context.rotate(-deg);
		context.translate(-x, -y);
		left += context.measureText(codes[i]).width + wordSpace  + Math.floor(Math.random() * 5);
	}
	self.code = codes;
	const strokeLength = codes.length * Math.round(Math.random() + 1) + 3;
	for (let i = 0; i < strokeLength; i++) {
		context.strokeStyle = self.randomColor(true);
		context.beginPath();
		context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
		context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		context.moveTo(x, y);
		context.lineTo(x + 1, y + 1);
		context.stroke();
	}
	$(self.element).html('');
	$(self.element).attr('style','display:flex !important;');
	$(self.element).append(canvas);
	if (self.options.autoRefresh) {
		self.progress = 'human_me_pro_'+ Date.now() + '_' + self.randomString(5)
		const progress = '<div id="'+ self.progress +'" class="human_me_pro"><div class="human_me_pro_inn">'+
			'<div class="human_me_pro_pie"><div class="human_me_pro_pie-inner">'+
			'<div id="human_me_pro_pie_a"><div></div></div><div id="human_me_pro_pie_b"><div></div></div></div>'+
			'</div><div class="human_me_pro_pie_b"><div class="human_me_pro_pie_b-inner">15</div></div>'+
		'</div></div>'
		$(self.element).append(progress);
		$('#'+ self.progress).find('#human_me_pro_pie_a div,#human_me_pro_pie_b div')
		.css({ 'background-color' : self.options.progressColor })
		let countDown = 15, countUp = 0, anchor = 0;
		if (self.interval) { clearInterval(self.interval); }
		self.interval = setInterval(function(){
			countUp += 0.065; ++ anchor;
			if (anchor >= 100) {
				anchor = 0; -- countDown;
				$('#'+ self.progress).find('.human_me_pro_pie_b-inner').html(countDown);
			}
			let c_1 = countUp / 100 * 360, c_2 = 0, c_3 = 0;
			if (c_1 > 180) { c_3 = 180; c_2 = c_1 - 180; }
			else { c_3 = c_1; c_2 = 0; }
			$('#'+ self.progress).find('#human_me_pro_pie_a div').css({ 'transform' : 'rotate('+ c_2 +'deg)' });
			$('#'+ self.progress).find('#human_me_pro_pie_b div').css({ 'transform' : 'rotate('+ c_3 +'deg)' });
			if (countUp >= 100) { clearInterval(self.interval); self.refresh() }
		},10)
	}
	if (self.options.manualRefresh) {
		self.button = 'human_me_ref_'+ Date.now() + '_' + self.randomString(5)
		const button = '<div id="'+ self.button +'" class="human_me_ref"><button>↻</button></div>'
		$(self.element).append(button);
		$('#'+ self.button).find('button').css({ 'background' : self.options.refreshButtonColor })
		$('#'+ self.button).find('button').on('click',function(){ self.refresh() })
	}
};
HumanMe.prototype.getCode = function() { return this.code.join('');
};
HumanMe.prototype.stop = function(){ const self = this; return clearInterval( self.interval )
};
HumanMe.prototype.validate = function(code) {
	const self = this;
	let ans = false;
	if (!self.options.caseSensitive) { ans = code.toLowerCase() === self.getCode().toLowerCase(); }
	else { ans = code === self.getCode(); }
	self.refresh();
	return ans;
};
HumanMe.prototype.randomCode = function() {
	const self = this;
	const codes = [];
	const resourceLength = self.resource.length;
	for (let i = 0; i < self.options.length; i++) {
		const txt = self.resource[ Math.floor(Math.random() * resourceLength) ];
		codes.push(txt);
	}
	return codes;
};
HumanMe.prototype.randomColor = function(alpha) {
	const r = Math.round(Math.random() * 255);
	const g = Math.round(Math.random() * 255);
	const b = Math.round(Math.random() * 255);
	if (!alpha) return 'rgb(' + r + ',' + g + ',' + b + ')';
	const a = Math.random();
	return 'rgb(' + r + ',' + g + ',' + b + ',' + a + ')';
};
HumanMe.prototype.randomString = function(length) {
	let b = '';
	const c = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const d = c.length;
	for (let e = 0;e < length;e++) { b += c.charAt(Math.floor(Math.random() * d)); }
	return b;
};
$(document).ready(function(){
	$('head:eq(0)').append(
		'<style type="text/css">'+
			'.human_me_pro{width:50px;height:50px;flex:none;display:flex;justify-content:center;align-items:center;}'+
			'.human_me_pro_inn{width:calc(100% - 10px);height:0;padding-bottom:calc(100% - 10px);'+
			'position:relative;margin:5px;}'+
			'.human_me_pro_pie{width:100%;height:100%;position:absolute;top:0;left:0;}'+
			'.human_me_pro_pie-inner{width:100%;height:100%;position:relative;}'+
			'#human_me_pro_pie_a,#human_me_pro_pie_b{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%;'+
			'clip:rect(0px,40px,40px,20px); background:rgba(0,0,0,0.02);}'+
			'#human_me_pro_pie_a{transform:rotate(180deg);}'+
			'#human_me_pro_pie_a div,#human_me_pro_pie_b div{position:absolute;width:100%;height:100%;border-radius:50%;'+
			'transform:rotate(0deg);clip:rect(0px,20px,40px,0px); background-color:#6671F0;}'+
			'.human_me_pro_pie_b{position:absolute;top:0;left:0;width:calc(100% - 18px);'+
			'height:calc(100% - 18px);background:#FFFFFF;border-radius:50%;padding:5px;margin:3.5px 0 0 3.5px;}'+
			'.human_me_pro_pie_b-inner{width:100%;height:100%;display:flex;justify-content:center;align-items:center;'+
			'flex-direction:column;border-radius:50%;background:rgb(255,255,255);font-family:sans-serif;cursor:default;}'+
			'.human_me_ref{width:50px;height:40px;display:flex;justify-content:center;align-items:center;padding:5px;}'+
			'.human_me_ref button{width:40px;height:40px;border-radius:5px;background:#6671F0;color:#FFFFFF;font-weight:bold;'+
			'font-size:20px;border:none;outline:none;cursor:pointer;}'+
		'</style>'
	);
});
return HumanMe;
})));