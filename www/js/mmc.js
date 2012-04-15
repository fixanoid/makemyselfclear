var mmc = {
	facebookAppID: '378127265561580',
	dictionary: {},
	hits: {},
	endR: '[\\.,]?( )?',
	
	runDataMatch: function(data) {
		$(data).each(function(index, value) {
			for (var cat in mmc.dictionary) {
				if (!mmc.hits[cat]) {
					mmc.hits[cat] = [];
				}

				if (mmc.dictionary[cat].regex.test(value.content)) {
					// console.log('Matched: ' + value.content + ' in category ' + cat );

					for (var entry in mmc.dictionary[cat]) {
						if (!mmc.dictionary[cat][entry]['word']) continue;

						var reg = new RegExp(' ' + mmc.dictionary[cat][entry]['word'] + mmc.endR, 'ig');

						if (reg.test(value.content)) {
							value.threat = mmc.dictionary[cat][entry]['threat'];
							mmc.hits[cat].push(value);
							// console.log('Matched: ' + value.content + ' in category ' + cat + ' on ' + mmc.dictionary[cat][entry]['word']);

							break;
						}
					}
				}
			}

			mmc.openPage(3);
		});

		// console.log(mmc.hits);
		
		var overallThreat = 0, total = 0, superOffensive = 0, embarassing = 0, uncivil = 0,
		 resultsAccordion = $("#results-accordion"), expandedIndex = -2, index = -1;
		for (var cat in mmc.hits) {
			index++;
			var content = $("<div><ul></ul></div>"), length = mmc.hits[cat].length;
			for (var i = 0; i < mmc.hits[cat].length; i++ ) {
				overallThreat += parseInt(mmc.hits[cat][i]['threat']);
				total++;
				
				if ( parseInt(mmc.hits[cat][i]['threat']) == 3 ) {
					superOffensive++;
				} else if ( parseInt(mmc.hits[cat][i]['threat']) == 2 ) {
					embarassing++;
				} else if ( parseInt(mmc.hits[cat][i]['threat']) == 1 ) {
					uncivil++;
				}

				content.append("<li>" + mmc.hits[cat][i]['content'] + "</li>");
			}

			if (!length) {
                resultsAccordion.append("<div style='background-color:#00CD00'>We couldn't find any " + cat + ". In the clear!</div>");
                content.html("<li>All clear here!</li>");
            } else {
				if (expandedIndex == -2) {
                    expandedIndex = index;
                }

                resultsAccordion.append("<div style='background-color:#FF0000'>We found [" + length + "] references to " + cat.toUpperCase() + " ></div>");
            }

            resultsAccordion.append(content);
		}

		resultsAccordion.jqxNavigationBar({ width:400, height:320, sizeMode:'fitAvailableHeight', expandedIndex:expandedIndex});
		var resultLevel = overallThreat/total || 0;

		if (resultLevel >= 2.5) {
			// level 3
			$('#results-intro').prepend('<span class="res_title">Virtual mouth, meet virtual soap.</span><br/>We found ' + total + ' things that could cause you trouble.<br/>' + superOffensive + ' are outright offensive, ' + embarassing + ' are likely embarrassing, and ' + uncivil + ' are simply uncivil.');
			$('#results-next').html('<span class="res_title">So What Now?</span><br/>You should check out our <a href="resources.html">privacy resources page</a>, which will suggest some best practices, give you info on how to remove offensive content, and suggest some other tools that can help you control your privacy online. Don\'t wait for somebody else to ask you about the' + total + 'things we found - take action today to make yourself clear.');
			$('#results-start').addClass("ragethree");
			$('#results-start').css({
				'background': 'url("./img/ragethree.png") no-repeat scroll 100% -100px transparent',
				'float': 'right',
				'height': '457px',
				'padding-left': '20px',
				'position': 'relative',
				'top': '-1px',
				'width': '50%'
			});
		} else if ( (resultLevel >= 1.5) && (resultLevel < 2.5) ) {
			// level 2
			$('#results-intro').prepend('<span class="res_title">Things look pretty murky...</span><br/>We found ' + total + ' things that could cause you trouble.<br/>' + superOffensive + ' are outright offensive, ' + embarassing + ' are likely embarrassing, and ' + uncivil + ' are simply uncivil.');
			$('#results-next').html('<span class="res_title">So What Now?</span><br/>You should check out our <a href="resources.html">privacy resources page</a>, which will suggest some best practices, give you info on how to remove offensive content, and suggest some other tools that can help you control your privacy online. Don\'t wait for somebody else to ask you about the' + total + 'things we found - take action today to make yourself clear.');
			$('#results-start').addClass("ragetwo");
			$('#results-start').css({
				'background': 'url("./img/ragetwo.png") no-repeat scroll 100% -100px transparent',
				'float': 'right',
				'height': '457px',
				'padding-left': '20px',
				'position': 'relative',
				'top': '-1px',
				'width': '50%'
			});
		} else if ( (resultLevel > 0) && (resultLevel < 1.5) ) {
			// level 1
			$('#results-intro').prepend('<span class="res_title">Your virtual tongue is under control.</span><br/>We found ' + total + ' things that could cause you trouble.<br/>' + superOffensive + ' are outright offensive, ' + embarassing + ' are likely embarrassing, and ' + uncivil + ' are simply uncivil.');
			$('#results-next').html('<span class="res_title">So What Now?</span><br/>You should check out our <a href="resources.html">privacy resources page</a>, which will suggest some best practices, give you info on how to remove offensive content, and suggest some other tools that can help you control your privacy online. Don\'t wait for somebody else to ask you about the' + total + 'things we found - take action today to make yourself clear.');
			$('#results-start').addClass("rageone");
			$('#results-start').css({
				'background': 'url("./img/rageone.png") no-repeat scroll 100% -100px transparent',
				'float': 'right',
				'height': '457px',
				'padding-left': '20px',
				'position': 'relative',
				'top': '-1px',
				'width': '50%'
			});	
		} else {
			// level 0
			$('#results-intro').prepend('<span class="res_title">You\'re in the clear!</span><br>Wow, we didn\'t find a single thing that could get you into trouble.<br/><br/>You\'re cautious and civil with what you say, which makes us wonder if you realize you\'re on the internet.');

			$('#results-accordion').html('Not that you need them, but you might want to check out our <a href="resources.html">additional privacy resources</a> for best practices, info about social network privacy policies, and other tools you might find interesting.');
			$('#results-start').addClass("ragezero");
			$('#results-start').css({
				'background': 'url("./img/ragezero.png") no-repeat scroll 100% -100px transparent',
				'float': 'right',
				'height': '457px',
				'padding-left': '20px',
				'position': 'relative',
				'top': '-1px',
				'width': '50%'
			});
		}
		// console.log([total, overallThreat, overallThreat/total || 0]);
	},

	addObservers: function() {
		$('#go').click(function() {
			mmc.openPage(2);
		});

		$('#facebook-auth').click(function(e) {
			e.preventDefault();

			var path = 'https://www.facebook.com/dialog/oauth?';
			var queryParams = ['client_id=' + mmc.facebookAppID,
				'redirect_uri=' + window.location,
				'response_type=token',
				"scope=read_stream,read_insights"
			];
			var query = queryParams.join('&');
			var url = path + query;
			window.location.href = url;
		});

		$('#policy').click(function(e) {
			e.preventDefault();
			mmc.openPage('extra');
			$('#page-extra').load('privacy.html');
		});

		$('#credits').click(function(e) {
			e.preventDefault();
			mmc.openPage('extra');
			$('#page-extra').load('credits.html');
		});

		$('#twitter-go').click(function() {
			mmc.initTwitter();
		});
	},

	nada: function(e) {
	
	},

	initTwitter: function() {
		if (!$('#twitter-handle').val()) {
			alert('Enter twitter handle please');
			return;
		}

		mmc.openPage('extra');
		$('#page-extra').css({'text-align':'center'});
		$('#page-extra').html('<br><br>Loading your Twitter twits.<br><br><img src="img/257.png">');
		var data = [], pages = 0;

		function loadTwits(page) {
			$.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + $('#twitter-handle').val() + '&count=200&page=' + page + '&callback=?',
			function(twits) {
				$(twits).each(function() {
					var entry = $(this)[0];

					entry.content = entry.text;
					data.push(entry);
				});

				// console.log("Users twits retrieved, running matching. " + data.length + ' from page ' + page);

				pages++;
				
				if (pages == 5) {
					mmc.runDataMatch(data);
				}
			});
		}
		
		for (var i = 1; i <= 5; i++) {
			loadTwits(i);
		}
	},

	initFacebook: function() {
		if (window.location.hash.length == 0) { return; }

		mmc.openPage('extra');
		$('#page-extra').css({'text-align':'center'});
		$('#page-extra').html('<br><br>Loading your Facebook posts.<br><br><img src="img/257.png">');

		var accessToken = window.location.hash.substring(1);
		var path = "https://graph.facebook.com/me?";
		var queryParams = [accessToken, 'callback=mmc.nada'];
		var query = queryParams.join('&');
		var url = path + query;

		(function (d) {
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement('script');
			js.id = id;
			js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
		}(document));

		window.fbAsyncInit = function () {
			FB.init({
				appId: mmc.facebookAppID,
				channelUrl:'channel.html',
				status:true,
				cookie:true,
				xfbml:true,
				oauth:true
			});
		}

        // use jsonp to call the graph
        var script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);

		script.onload = function() {
			setTimeout(function() {
				FB.api({
					method:'fql.query',
					query: "SELECT post_id, actor_id, target_id, message FROM stream WHERE filter_key in (SELECT filter_key FROM stream_filter WHERE uid = me()) AND created_time > 1"
				}, function (response) {
					var data = [];
					$(response).each(function() {
						var entry = $(this)[0];
						if (entry.message) {
							
							entry.content = entry.message;
							data.push(entry);
						}
					});

					// console.log("Users posts retrieved, running matching. " + data.length);
					mmc.runDataMatch(data);
				});
			}, 2000);
		}
	},
	
	initTwitterAuth: function() {
		twttr.anywhere(function (T) {
			var screenName;

			if (T.isConnected()) {
			  screenName = T.currentUser.data('screen_name');
				$('#twitter-handle').val(screenName).attr("disabled", "disabled");
				$('#twitter-logout').click(function() {twttr.anywhere.signOut(); window.location.reload();} );
			} else {
				$('#twitter-logo').hide();
				$('#twitter-go').hide();
				$('#twitter-handle').hide();
				$('#twitter-logout').hide();

				T('#twitter-login').connectButton({
					authComplete: function(user) {
						$('#twitter-login').hide();
						$('#twitter-logo').show();
						$('#twitter-go').show();
						$('#twitter-handle').show();
						$('#twitter-logout').show();
						
						$('#twitter-handle').val(user.data('screen_name')).attr("disabled", "disabled");
						$('#twitter-logout').click(function() {twttr.anywhere.signOut(); window.location.reload();} );
					}
				});
			};
		});
	},

	init: function() {
		// load initial page
		mmc.openPage(1);
		mmc.addObservers();
		mmc.initFacebook();
		mmc.initTwitterAuth();

		// load dictionary.
		$.ajax({
			url: 'dictionary/big-dictionary.xml',
			type: 'GET',
			dataType: 'xml', 
			success: function(xml) {
				$(xml).find('entry').each(function() {
					var cat = $(this).find('category').text().toLowerCase();
					
					if (!mmc.dictionary[cat]) {
						mmc.dictionary[cat] = [];
						mmc.dictionary[cat].regex = '';
					}
					
					mmc.dictionary[cat].push({"word": $(this).find('word').text(), "threat": $(this).find('threatlevel').text()});

					mmc.dictionary[cat].regex += ' ' + $(this).find('word').text() + mmc.endR + '|';
				});

				for (var cat in mmc.dictionary) {
					mmc.dictionary[cat].regex = mmc.dictionary[cat].regex.slice(0, -1);
					mmc.dictionary[cat].regex = new RegExp(mmc.dictionary[cat].regex, 'ig');
				}
				//console.log(mmc.dictionary);
				
/*
				// rigging for testing.
				var d = [];
				d.push({'content': 'I love towlehead fagots', 'id': 123213});
				d.push({'content': 'I love cigarettes!', 'id': 3212});
				d.push({'content': 'This spliff was fantastic!', 'id': 32312});
				
				// runnign test
				mmc.runDataMatch(d);
*/
			}
		});
	},
	
	openPage: function(page) {
		$('.page').each(function() { $(this).hide(); } );
		$('#page-' + page).show();
	}
};

$(document).ready(function(){
	mmc.init();
});
