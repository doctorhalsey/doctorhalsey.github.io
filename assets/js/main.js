// ---------------------------------------------------------------------
// Global JavaScript
// Authors: Andrew Ross & a little help from my friends
// ---------------------------------------------------------------------

var andrewrossco = andrewrossco || {};

(function($, APP) {

    $(function() {
        APP.Global.init();
        APP.Viewport.init();
        APP.Modal.init();
        APP.Tabs.init();
        APP.Accordion.init();
        APP.Countdown.init();
        APP.filter.init();
        APP.ScrollTo.init();
    });

// ---------------------------------------------------------------------
// Browser and Feature Detection
// ---------------------------------------------------------------------

APP.Global = {
    init: function() {

        function pageHeight() {
            var w = window,
                e = document.documentElement,
                y = w.innerHeight||e.clientHeight||g.clientHeight,
                mh = y - 96;
            document.getElementById('content').style.minHeight = mh + "px";
        }

        $(function(){
            document.body.classList.add("page-ready");
            document.body.classList.remove("page-loading");

            if(window.location.hostname == 'localhost'){
                document.body.classList.add('localhost');
            }
            pageHeight();
        });

        window.onresize = function(event) {
           pageHeight();
        };


    	if ( ! ('ontouchstart' in window) ) {
            document.documentElement.classList.add('no-touch');
        }

    	if ( 'ontouchstart' in window ) {
            document.documentElement.classList.add('is-touch');
        }

    	if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            if(navigator.appVersion.indexOf('Trident') === -1) {
                document.documentElement.classList.add('isEDGE');
            } else {
                $('html').addClass('isIE isIE11');
            }
        }
        if(window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1'){
            document.body.classList.add('localhost');
        }

        var el = document.querySelectorAll('.nav-trigger');
        for (var i=0; i < el.length; i++) {
            el.item(i).onclick = function(){
                bd = document.body;
                if( bd.classList.contains('menu-is-active') ) {
                    bd.classList.remove('menu-is-active');
                } else {
                    bd.classList.add('menu-is-active');
                }
            };
        }
    }
}



// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

APP.Viewport = {

    init: function() {
		$.fn.isOnScreen = function(){
			var elementTop = $(this).offset().top,
				elementBottom = elementTop + $(this).outerHeight(),
				viewportTop = $(window).scrollTop(),
				viewportBottom = viewportTop + $(window).height();
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};

		var items = document.querySelectorAll('*[data-animate-in], *[data-detect-viewport]');

		function detection(el) {
			if( el.isOnScreen() ){
				if(!el.hasClass('in-view')){
					el.addClass('in-view');
				}
			}
		}

		$(window).on("resize scroll", function(){
			for(var i = 0; i < items.length; i++) {
				var el = $( items[i] );
				detection(el);
			}
		});

		$(document).ready(function(){
			for(var i = 0; i < items.length; i++) {
				var d = 0,
					el = $( items[i] );
				if( items[i].getAttribute('data-animate-in-delay') ) {
					d = items[i].getAttribute('data-animate-in-delay') / 1000 + 's';
				} else {
					d = 0;
				}
				el.css('transition-delay', d);

				 detection(el);
			}
		});
    }
};



// ---------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------

APP.Modal = {

    init: function() {

        var modal = $('#speaker-modal'),
            speakerModalContent = $('#speaker-modal .modal__bd'),
            b = $('body');

        $('.js-show-speaker').click(function(e){
            e.preventDefault();
            var speaker = $(this);

            getSpeakerModal(speaker);
        });


        function getSpeakerModal(el) {
            speakerModalContent.empty();
            history.replaceState(null, '', ' ');

            // Copy speaker profile
            var sc = el.find('.speaker-profile');
            var scc = sc.clone();
            var id = el.attr('id');

            // Add copy to modal
            speakerModalContent.append(scc);

            // Open Modal
            modal.addClass('is-active').attr('data-speaker', id);
            modal.find('.modal-controls__prev').filter(':visible').focus();
            b.addClass('modal-is-active');

            history.replaceState(null, '', '#' + id);

            setTimeout(function(){
                $('#speaker-modal .speaker-image').addClass('in-view');
            }, 400);
        }


        // Check for open modal on load
        $(document).ready(function(){
            var hash = window.location.hash.replace('#', ''),
                aLink = $('.js-show-speaker');

            $('.speaker').each(function() {
                var el = $(this),
                    modalId = el.attr('ID');

                if( modalId === hash && modalId != '' ) {
                    getSpeakerModal(el);
                    modal.addClass('is-active');
                    b.addClass('modal-is-active');
                }
            });
        });

        $('.js-modal-close').click(function(){
            speakerModalContent.empty();
            modal.removeClass('is-active').attr('data-speaker', '');

            $('#talk-modal .modal__bd').empty();
            $('#talk-modal').removeClass('is-active').attr('data-talk', '');
            b.removeClass('modal-is-active');
            history.replaceState(null, '', ' ');
        });

        function prevSpeaker(el) {
            var cur = $('.speaker-list').find('#' + el);
            var target = cur.prev('.speaker');
            if( target.length ) {
                target.click();
            } else {
                $('.js-modal-close').click();
            }

        }
        function nextSpeaker(el) {
            var cur = $('.speaker-list').find('#' + el);
            var target = cur.next('.speaker');
            if( target.length ) {
                target.click();
            } else {
                $('.js-modal-close').click();
            }
        }

        $('.js-next-speaker').click(function(){
            var speakerId = $(this).parents('#speaker-modal').attr('data-speaker');
            nextSpeaker(speakerId);
        });
        $('.js-prev-speaker').click(function(){
            var speakerId = $(this).parents('#speaker-modal').attr('data-speaker');
            prevSpeaker(speakerId);
        });


        var talkModal = $('#talk-modal'),
            talkModalContent = $('#talk-modal .modal__bd'),
            b = $('body');

        $('.js-show-talk').click(function(e){
            e.preventDefault();
            var talk = $(this);
            getTalkModal(talk);
        });

        function getTalkModal(el) {
            talkModalContent.empty();
            history.replaceState(null, '', ' ');

            // Copy speaker profile
            var tc = el.find('.talk-profile');
            var tcc = tc.clone();
            var id = el.attr('id');

            // Add copy to modal
            talkModalContent.append(tcc);

            // Open Modal
            talkModal.addClass('is-active').attr('data-talk', id);
            talkModal.find('.modal-controls__prev').filter(':visible').focus();
            b.addClass('modal-is-active');

            history.replaceState(null, '', '#' + id);
        }

        // Check for open modal on load
        $(document).ready(function(){
            var hash = window.location.hash.replace('#', ''),
                aLink = $('.js-show-talk');

            $('.talk').each(function() {
                var el = $(this),
                    modalId = el.attr('ID');

                if( modalId === hash && modalId != '' ) {
                    getTalkModal(el);
                    talkModal.addClass('is-active');
                    b.addClass('modal-is-active');
                }
            });
        });


        function prevTalk(el) {
            var cur = $('.schedule-list').find('#' + el);
            var target = cur.prev('.talk:not(.talk--break)');

            if( target.length ) {
                target.click();
            } else {
                target = cur.prevAll('.talk:not(.talk--break)');
                if( target.length ) {
                    target.click();
                } else {
                    $('.js-modal-close').click();
                }
            }
        }

        function nextTalk(el) {
            var cur = $('.schedule-list').find('#' + el);
            var target = cur.next('.talk:not(.talk--break)');

            if( target.length ) {
                target.click();
            } else {
                target = cur.nextAll('.talk:not(.talk--break)');
                //console.log( "Next all = " + target.attr('id') );

                if( target.length ) {
                    target.click();
                } else {
                    $('.js-modal-close').click();
                }
            }
        }

        $('.js-next-talk').click(function(){
            var talkId = $(this).parents('#talk-modal').attr('data-talk');
            nextTalk(talkId);
        });
        $('.js-prev-talk').click(function(){
            var talkId = $(this).parents('#talk-modal').attr('data-talk');
            prevTalk(talkId);
        });


        document.addEventListener('keydown', function(event) {

            if(talkModal.length && talkModal.hasClass('is-active')){
                if(event.keyCode == 37) {
                    prevTalk($('#talk-modal').attr('data-talk'));
                }
                else if(event.keyCode == 39) {
                    nextTalk($('#talk-modal').attr('data-talk'));
                }
                if(event.keyCode == 27 || event.keyCode == 88) {
                    $('.js-modal-close').click();
                }
            }

            if( modal.length && modal.hasClass('is-active') ){
                if(event.keyCode == 37) {
                    prevSpeaker($('#speaker-modal').attr('data-speaker'));
                }
                if(event.keyCode == 39) {
                    nextSpeaker($('#speaker-modal').attr('data-speaker'));
                }
                if(event.keyCode == 27 || event.keyCode == 88) {
                    $('.js-modal-close').click();
                }
            }
        });

    }

};


// ---------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------

APP.Tabs = {

    init: function() {
        var tab = $('.tabs__tab'),
			tabBody = $('.tabs__content');

        tabBody.hide();
        $('.tabs__content.is-active').show();

		tab.click(function(){
			var group = $(this).parents('.tabs'),
				tabs = group.find('.tabs__tab'),
				tabsBody = group.find('.tabs__content');
			tabs.removeClass('is-active');
            $('.tabs__content').hide().removeClass('is-active');
            var tabId = $(this).attr('data-tab'),
				target = $('#' + tabId);

            history.replaceState(null, '', '#' + tabId);

			$(this).addClass('is-active');
			target.fadeIn(300).addClass('is-active');
            $(window).trigger('resize');
		});

        $(document).ready(function(){
            var hash = window.location.hash.replace('#', '');
            $('.tabs__tab').each(function() {
                var el = $(this),
                    tabId = el.attr('data-tab');
                if( tabId === hash && tabId != '' ) {
                    el.click();
                }
            });

            if(hash == 'ask-github') {
                $('.tabs__tab[data-tab="inside-universe"]').click();
                $('html, body').animate({
                    scrollTop: $('#ask-github').offset().top - 60
                }, 100);
                history.replaceState(null, '', '#ask-github');
            }
        });


        var tabSm = $('.tabs-sm__tab'),
			tabBodySm = $('.tabs-sm__content');

        tabBodySm.hide();
        $('.tabs-sm__content.is-active').show();

		tabSm.click(function(){
			var group = $(this).parents('.tabs-sm'),
				tabs = group.find('.tabs-sm__tab'),
				tabsBody = group.find('.tabs-sm__content');
			tabs.removeClass('is-active');
            $('.tabs-sm__content').hide().removeClass('is-active');
            var tabId = $(this).attr('data-tab'),
				target = $('#' + tabId);
			$(this).addClass('is-active');
			target.fadeIn(300).addClass('is-active');
            $(window).trigger('resize');
		});
    }
};




// ---------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------

APP.Accordion = {

    init: function() {
        if( $('.accordion').length ) {
            this.bind();
        } else {
            return;
        }
    },

    bind: function() {

        $(document).on('click','.accordion__hd',function(e){
            this.parentNode.classList.toggle("is-open");
            var panel = this.nextElementSibling;

            if (panel.style.maxHeight){
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });

    }
};


// ---------------------------------------------------------------------
// Countdown Timer
// ---------------------------------------------------------------------

APP.Countdown = {

    init: function() {
        if( $('#countdown').length ) {
            this.bind();
        } else {
            return;
        }
    },

    bind: function() {

        var countDownDate = new Date("November 13, 2019 09:00:00").getTime(),
            countdownWrap = document.getElementById('countdown-wrap');
            //liveStream = document.getElementById('livestream');

        countdownWrap.classList.remove('d-none');

        var x = setInterval(function() {
            d = new Date();
            localOffset = d.getTimezoneOffset() * 60000;
            utc = d.getTime() + localOffset;

            sf = utc - (3600000*7);
            now = new Date(sf).getTime();
            distance = countDownDate - now;
            days = Math.floor(distance / (1000 * 60 * 60 * 24));
            hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("countdown").innerHTML = days + "<span>days</span> " + hours + "<span>hours</span> " + minutes + "<span>minutes</span> " + seconds + "<span>seconds</span> ";
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("countdown").innerHTML = "";
                //countdownWrap.classList.add('d-none');
                //liveStream.classList.remove('d-none');
            }
        }, 1000);
    }
};



// ---------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------

APP.filter = {

    init: function() {

        if( !document.getElementById('filters') ) {
			return;
		}

        function toggleFilter() {
            if( filterPanel.classList.contains('is-active') ){
                filterPanel.classList.remove('is-active');
                bd.classList.remove('filter-is-active');
            } else {
                filterPanel.classList.add('is-active');
                bd.classList.add('filter-is-active');
            }
        }

        // Filter Toggle
        var filterPanel = document.getElementById('filters'),
            filterToggles = document.querySelectorAll('.js-filter-toggle'),
            bd = document.body;

        for(var ft = 0; ft < filterToggles.length; ft++) {
    		filterToggles[ft].onclick = function() {
                toggleFilter();
    		}
        }
        document.getElementById('filter-screen').onclick = function() {
            toggleFilter();
        }
        // Filter Toggle End



        function findOne(arr2, arr) {
            return arr.some(function (v) {
                return arr2.indexOf(v) >= 0;
            });
        }

        function matchAll(superset, subset) {
            return subset.every(function (value) {
                return (superset.indexOf(value) >= 0);
            });
        }

        function updateCount() {
            al = document.querySelectorAll('.talk--filterable.is-active').length;
            document.getElementById('js-active-filter-count').innerHTML = al;

            if(al < 1) {
                clearFilters();
            }
        }

        updateCount();

        var filters = document.querySelectorAll('.filter'),
            talk = document.querySelectorAll('.talk--filterable'),
            activeTags = [],
            index;

        for(var i = 0; i < filters.length; i++) {
            filters[i].onclick = function() {
                var el = this,
                    filter = el.getAttribute('data-filter');

                if( el.classList.contains('is-active') ) {
                    //console.log('Remove ' + filter);
                    index = activeTags.indexOf(filter);
                    activeTags.splice(index, 1);
                    el.classList.remove('is-active');
                } else {
                    //console.log('Add ' + filter);
                    activeTags.push(filter);
                    el.classList.add('is-active');
                }


                for(var t = 0; t < talk.length; t++) {
                    var el = talk[t],
                        tags = el.getAttribute('data-tags');

                    if( !tags ) {
                        el.classList.add('un-active');
                        el.classList.remove('is-active');
                    } else {
                        var tArr = tags.split(', '),
                            length = tArr.length;

                        if( findOne(tArr, activeTags) ){
                            //console.log('still has all');
                            el.classList.add('is-active');
                            el.classList.remove('un-active');
                            //console.log('Match');
                            //availableTags.push(tArr);
                            //Array.prototype.push.apply(availableTags, tArr);
                        } else {
                            //console.log('missing one or more');
                            el.classList.add('un-active');
                            el.classList.remove('is-active');
                        }
                    }
                }
                updateCount();
            }
        }

        function clearFilters() {
            for(var t = 0; t < talk.length; t++) {
                var el = talk[t];
                el.classList.remove('un-active');
                el.classList.add('is-active');
            }
            for(var f = 0; f < filters.length; f++) {
                var el = filters[f];
                el.classList.remove('is-active');
            }
            activeTags = [];
            updateCount();
        }

        document.getElementById('js-filter-reset').onclick = function() {
            clearFilters();
        }


        var simulateClick = function (elem) {
        	// Create our event (with options)
        	var evt = new MouseEvent('click', {
        		bubbles: true,
        		cancelable: true,
        		view: window
        	});
        	// If cancelled, don't dispatch our event
        	var canceled = !elem.dispatchEvent(evt);
        };

        $(document).ready(function(){
            var hash = window.location.hash.replace('#', '');

            var urlParams = new URLSearchParams(window.location.search);

            if(urlParams.get('filter')) {
                var f = urlParams.get('filter');
                for(var i = 0; i < filters.length; i++) {
                    if( f.includes(filters[i].getAttribute('data-filter')) ) {
                        simulateClick(filters[i]);
                    }
                }
            }

            if(hash) {
                for(var i = 0; i < filters.length; i++) {
                    if( filters[i].getAttribute('data-filter') ==  hash) {
                        simulateClick(filters[i]);
                    }
                }
            }
        });
    }
};



// ---------------------------------------------------------------------
// Scroll to
// Used for smooth scrolling to elements
// ---------------------------------------------------------------------

APP.ScrollTo = {

    init: function() {
        if( $('*[data-scroll-to]').length ) {
            this.bind();
        } else {
            return;
        }
    },

    bind: function() {

        $('*[data-scroll-to]').on('click touchstart:not(touchmove)', function(e) {
            e.preventDefault();

            var trigger = $(this).attr('data-scroll-to'),
                target = $("#" + trigger),
                ss = 1000, //scroll speed
                o = 0; // offset

            if( $(this).attr('data-scroll-speed') ) {
                ss = $(this).attr('data-scroll-speed');
            }

            if( $(this).attr('data-scroll-offset') ) {
                o = $(this).attr('data-scroll-offset');
            }

            $('html, body').animate({
                scrollTop: target.offset().top - o
            }, ss);
        });


    }
};



}(jQuery, andrewrossco));