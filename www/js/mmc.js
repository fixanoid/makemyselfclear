var mmc = {
	facebookAppID: '378127265561580',
	dictionary: {},
	
	runDataMatch: function(data) {
		$(data).each(function(index, value) {
			for (var cat in mmc.dictionary) {
				if (mmc.dictionary[cat].regex.test(value.content)) {
					console.log('Matched: ' + value.content + ' in category ' + cat );
				}
			}
		});
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
	},

	nada: function(e) {
	
	},

	initFacebook: function() {
		if (window.location.hash.length == 0) { return; }

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
					query:"SELECT post_id, actor_id, target_id, message FROM stream WHERE filter_key in (SELECT filter_key FROM stream_filter WHERE uid=me() AND type='newsfeed') AND is_hidden = 0"
				}, function (response) {
					var data = [];
					$(response).each(function() {
						var entry = $(this)[0];
						if (entry.message) {
							
							entry.content = entry.message;
							data.push(entry);
						}
					});

					console.log(["Users posts", data]);
					mmc.runDataMatch(data);
				});
			}, 2000);
		}

		mmc.openPage(3);
	},

	init: function() {
		// load initial page
		mmc.openPage(1);
		mmc.addObservers();
		mmc.initFacebook();
		
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

					mmc.dictionary[cat].regex += $(this).find('word').text() + '|';
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
