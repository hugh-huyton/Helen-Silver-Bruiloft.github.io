/**
 * File wgalore.js.
 */
 ( function( $ ) {
 	$(function(){

 		$('#rsvp-yes').on('click', function(){
 			var container = $(this).parent('#rsvp-choices');
 			$(this).addClass('selected');
 			$(container).addClass('selected');
 			$('#rsvp-no').removeClass('selected');
 			$('#rsvp-form-no').hide();
 			$('#rsvp-form-yes').show();
 		});
 		$('#rsvp-no').on('click', function(){
 			var container = $(this).parent('#rsvp-choices');
 			$(this).addClass('selected');
 			$(container).addClass('selected');
 			$('#rsvp-yes').removeClass('selected');
 			$('#rsvp-form-yes').hide();
 			$('#rsvp-form-no').show();
 		});

 		$('#rsvp-form-yes').on('submit', function (e) {
 			// $('#submit-rsvp-yes').on('click', function (e) {
 				e.preventDefault();
 				var errors = 0;

 				var form = $(this);
 				
 				$(this).find('.warning').removeClass('warning incorrect');
 				$(this).find('input.req, select.req').each(function(){
 					if(! $(this).val()){
 						errors++;
 						$(this).addClass('warning');
 					}
 				});
 				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
 				var email = $(form).find('input.email').val();
 				if(!email.match(re)) {
 					errors++;
 					$('form input.email').addClass('warning');
 				}
 				$(this).find('.checkbox-group.req').each(function(){
 					var group = $(this);
 					if(! $(group).find('input:checked').val()){
 						errors++;
 						$(group).addClass('warning');
 					}
 				});
 				$(this).find('.radio-group.req').each(function(){
 					var group = $(this);
 					if(! $(group).find('input:checked').val()){
 						errors++;
 						$(group).addClass('warning');
 					}
 				});
 				var data = new Object();
 				if(errors == 0){


 					data['attending'] = true;
 					data['count'] = $('input[name=rsvp-count]').val();
 					data['email'] = email;
 					data['name'] = $(form).find('input.name').val();
 					data['phone'] = $(form).find('input[name=phone]').val();
 					var address = new Object();
 					address['street'] = $(form).find('input[name=street]').val();
 					address['pc'] = $(form).find('input[name=pc]').val();
 					address['city'] = $(form).find('input[name=city]').val();
 					if(address['street'] || address['pc'] || address['city']){
 						data['address'] = address;
 					}

 					if($(form).find('#rsvp-events').length){
 						var events = [];
 						$('#rsvp-events').find('input:checked').each(function(){
 							events.push($(this).attr('name'));
 						});
 						data['events'] = events; 					
 					}

 					var rsvpExtraFields = new Object();
 					$(form).find('.extra-field').each(function(){
 						var type = $(this).attr('data-type');
 						var name = $(this).attr('data-name');
 						if(type == 'type-text' || type == 'type-select'){
 							rsvpExtraFields[name] = $(this).find(':input').val();
 						}else if( type == 'type-radio'){
 							rsvpExtraFields[name] = $(this).find('input:checked').val();
 						}else if( type == 'type-checkbox'){
 							var val = '';
 							$(this).find('input:checked').each(function(){
 								val = val + $(this).val() + ', ';
 							});
 							val = val.trim();
 							val = val.replace(/^\,+|\,+$/g, '');
 							if(val !== ''){
 								rsvpExtraFields[name] = val;
 							}
 						}
 						data['extrafields'] = rsvpExtraFields;
 					});

 					data['comment'] = $(form).find('textarea.comments').val();
 					data['captcha'] = $(form).find('#recaptchaResponse').val();
 					console.log(data);
 					$.ajax({
 						type: 'post',
 						url : my_ajax_object.ajax_url, 	
 						dataType : "json", 						
 						data : {
 							action : 'log_rsvp',
 							data: data,
 						},
 						success: function (response) {
 							if(response.status == 'success'){
 								$('section.rsvp .container').html('<div class="rsvp-notice">'+response.message+'</div>');
 							}else{
 								$(form).append('<div class="rsvp-notice">'+response.message+'</div>');
 							}
 						},
 					// error: alert(data),
 				});
 				};
 			});

 		$('#rsvp-form-no').on('submit', function (e) {
 			e.preventDefault();
 			var errors = 0;

 			var form = $(this);
 			
 			$(this).find('.warning').removeClass('warning incorrect');
 			$(this).find('input.req, select.req').each(function(){
 				if(! $(this).val()){
 					errors++;
 					$(this).addClass('warning');
 				}
 			});
 			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
 			var email = $(form).find('input.email').val();
 			if(!email.match(re)) {
 				errors++;
 				$('form input.email').addClass('warning');
 			}
 			$(form).find('.checkbox-group.req').each(function(){
 				var group = $(this);
 				if(! $(group).find('input:checked').val()){
 					errors++;
 					$(group).addClass('warning');
 				}
 			});
 			var data = new Object();
 			if(errors == 0){

 				data['attending'] = false;
 				data['email'] = email;
 				data['name'] = $(form).find('input.name').val();
 				data['comment'] = $(form).find('textarea.comments').val();
 				data['captcha'] = $('#rsvp-form-yes').find('#recaptchaResponse').val();
 				console.log(data);
 				$.ajax({
 					type: 'post',
 					url : my_ajax_object.ajax_url,
 					dataType: "json",
 					data : {
 						action : 'log_rsvp',
 						data: data,
 					},
 					success: function (response) {
 						if(response.status == 'success'){
 							$('section.rsvp .container').html('<div class="rsvp-notice">'+response.message+'</div>');
 						}else{
 							$(form).append('<div class="rsvp-notice">'+response.message+'</div>');
 						}
 					},
 				});
 			};
 		});
 		$('.show-privacy-terms').on('click', function(e){
 			e.preventDefault();
 			$('#rsvp-privacy-statement').fadeIn(200);
 		});
 		$('#rsvp-privacy-statement .close-modal').on('click', function(e){
 			e.preventDefault();
 			$('#rsvp-privacy-statement').fadeOut(200);
 		});
 		$('#rsvp-privacy-statement').on('click', function(){
 			$('#rsvp-privacy-statement .close-modal').click();
 		});
 		$('#rsvp-privacy-statement .container').on('click', function(e){
 			e.stopPropagation();
 		})

 		$('a.reserve-gift').on('click', function(e){
 			e.preventDefault();
 			var gift = $(this).closest('.gift');
 			var title = $(gift).attr('data-title');
 			var titleLocale = $(gift).attr('data-locale-title');
 			var index = $(gift).attr('data-index');
 			var available = parseInt($(gift).find('.available').text());
 			var amounts = $(gift).find('.gift-amounts').text();
 			$('#reserve-gift-form').attr({
 				'data-title': title,
 				'data-index': index,
 			});
 			$('#reserve-gift h2').text(titleLocale);
 			$('#reserve-gift-form input.gift-amount').val(available).attr({
 				"min" : 1,
 				"max" : available,
 			});
 			$('#reserve-gift-form p.gift-amounts').text(amounts);
 			$('#reserve-gift').show();
 		});

 		$('#reserve-gift a.cancel').on('click', function(e){
 			e.preventDefault();
 			if(	$('#gift-message').hasClass('active')){
 				location.reload();
 			}else{
 				var modal = $(this).closest('#reserve-gift');
 				$(modal).fadeOut(200);
 			}
 		});
 		$('#reserve-gift').on('click', function(){
 			$(this).find('a.cancel').click();
 		});
 		$('#reserve-gift .container').on('click', function(e){
 			e.stopPropagation();
 		});
 		$('#reserve-gift-form').on('submit', function (e) {
 			e.preventDefault();

 			var form = $(this);
 			$(this).find('.warning').removeClass('warning incorrect');
 			var errors = 0;
 			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
 			var email = $(form).find('.gift-email').val();
 			if(!email.match(re)) {
 				errors++;
 				$('form input.gift-email').addClass('incorrect');
 			}

 			$(form).find('.checkbox-group.req').each(function(){
 				var group = $(this);
 				if(! $(group).find('input:checked').val()){
 					errors++;
 					$(group).addClass('warning');
 				}
 			});

 			var data = new Object();
 			data['title'] = $(form).attr('data-title');
 			data['index'] = $(form).attr('data-index');
 			data['email'] = $(form).find('.gift-email').val();
 			data['amount'] = $(form).find('input.gift-amount').val();

 			if(errors == 0){

 				$('#gift-message .message-content').html('<i class="fas fa-circle-notch"></i>')
 				$('#gift-message').addClass('active');
 				$.ajax({
 					type : "post",
 					url : my_ajax_object.ajax_url,
 					dataType : "json",
 					data : {
 						action : 'reserve_gift',
 						data: data,
 					},
 					success: function(response) { 	
 						setTimeout(function(){					
 							if(response.status == 'success'){

 								$('.circle-loader').addClass('load-complete');
 								$('.checkmark').show();
 								$('#gift-message .message-content').text(response.message); 								
 							}else{
 								$('.circle-loader').hide();
 								$('#gift-message .message-content').html("<small>"+response.message+"</small>");
 							}
 						}, 1400);
 					},

 				});
 			}

 		});
 		$('span.delete-reservation').on('click', function(){
 			var giftId = $(this).attr('data-gift');
 			var email = $(this).attr('data-email');
 			var row = $(this).closest('.reservation');
 			var confirmDelete = confirm(localStrings.giftCancelReservationConf);
 			if(confirmDelete){
 				$(row).html("<span>"+localStrings.oneMoment+"</span>");
 				$.ajax({
 					type : "post",
 					url : my_ajax_object.ajax_url,
 					dataType : "json",
 					data : {
 						action : 'unreserve_gift',
 						gift: giftId,
 						email: email,
 					},
 					success: function(response) { 	
 						setTimeout(function(){					
 							location.reload();
 						}, 1400);
 					},

 				});
 			}
 		});
 		$('div#edit-reservation .close-edit-reservations').on('click', function(){
 			window.location = window.location.href.split("?")[0]; 			
 		});
 		$('div#edit-reservation').on('click', function(){
 			$('div#edit-reservation .close-edit-reservations').click();
 		});
 		$('div#edit-reservation .container').on('click', function(e){
 			e.stopPropagation();
 		});
 		
 		var date = $('#countdown').attr('data-date');
 		if(date){
 			var countDownDate = Date.parse(date);

 			var x = setInterval(function() {

	  // Get todays date and time
	  var now = new Date().getTime();

	  // Find the distance between now an the count down date
	  var distance = countDownDate - now;

	  // Time calculations for days, hours, minutes and seconds
	  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	  // Display the result in the element with id="countdown"
	  $('#countdown #cd-days').html(days);
	  $('#countdown #cd-hours').html(hours);
	  $('#countdown #cd-minutes').html(minutes);
	  $('#countdown #cd-seconds').html(seconds);

	  // If the count down is finished, write some text 
	  if (distance < 0) {
	  	clearInterval(x);
	  	$('#countdown').remove();
	  }
	}, 1000);
 		};

 		$('#toggle-menu').on('click', function(){
 			$(this).toggleClass('menu-open');
 		});
 		$('.input-minus').on('click', function(){
 			var target = $(this).nextAll('input');
 			var display = $(this).nextAll('.input-val');
 			var val = parseInt($(target).val());
 			val--;
 			if(val >= 1){
 				$(target).val(val);
 				$(display).text(val);
 			}
 		});
 		$('.input-plus').on('click', function(){
 			var target = $(this).prevAll('input');
 			var display = $(this).prevAll('.input-val');
 			var val = parseInt($(target).val());
 			val++;
 			if(val <= 10){
 				$(target).val(val);
 				$(display).text(val);
 			}
 		});


 		window.onscroll = function() {doSticky()};
 		var header = document.getElementById("site-navigation");
 		var sticky = header.offsetTop;
 		sticky = sticky + 260;
 		function doSticky() {
 			if (window.pageYOffset > sticky) {
 				header.classList.add("sticky");
 			} else {
 				header.classList.remove("sticky");
 			}
 		}


 		function nl2br (str, is_xhtml) {   
 			var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
 			return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
 		}


 		$('.lang-switcher').on('click', function(e){
 			e.preventDefault();
 			var lang = $(this).attr('data-lang');
 			console.log({lang});
 			$.ajax({
 				type : "post",
 				url : my_ajax_object.ajax_url,
 				data : {
 					action : 'switch_language',
 					lang: lang,
 				},
 				success: function(response) {  				
 					location.reload();
 				},

 			});
 		});

 		$('a#submit-message').on('click', function(e){
 			e.preventDefault();
 			
 			var errors = 0;
 			var form = $(this).closest('#guestbook-form');
 			$(form).find('.req').each(function(){
 				if(! $(this).val()){
 					errors++;
 					$(this).addClass('warning');
 				}
 			});
 			if(errors == 0){
 				var msg = new Object();
 				msg['name'] = $(form).find('#message-name').val();
 				msg['body'] = $(form).find('#message-body').val();
 				msg['gif'] = $(form).find('#giphy-input').val();
 				$.ajax({
 					type : "post",
 					url : my_ajax_object.ajax_url,
 					data : {
 						action : 'submit_guestbook_post',
 						msg: msg,
 					},
 					success: function(response) { 
 						// alert(response);	
 						location.reload();
 					},

 				}); 				
 			}

 		});
 		$('#guestbook-posts').on('click', '.likes', function(){
 			var target = $(this);
 			if(! $(this).hasClass('liked')){
 				var post = $(this).closest('.guestbook-post').attr('data-id');
 				$.ajax({
 					type : "post",
 					url : my_ajax_object.ajax_url,
 					data : {
 						action : 'like_post',
 						post: post,
 					},
 					success: function(response) { 	
 						$(target).addClass('liked ');
 						var likes = parseInt($(target).text());
 						if(likes > 0){
 							likes++;
 						}else{
 							likes = 1;
 						}
 						$(target).text(likes);
 						console.log({response});
 					},

 				});
 			}
 		})

 	});
} )(jQuery);
