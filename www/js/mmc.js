var mmc = {
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

	init: function() {
		// load initial page
		mmc.openPage(1);
		
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
				
				
				// rigging for testing.
				var d = [];
				d.push({'content': 'I love towlehead fagots', 'id': 123213});
				d.push({'content': 'I love cigarettes!', 'id': 3212});
				d.push({'content': 'This spliff was fantastic!', 'id': 32312});
				
				// runnign test
				mmc.runDataMatch(d);
			}
		});
	},
	
	openPage: function(page) {
		$('.page').each(function() { $(this).hide(); } );
		$('#page-' + page).show();
	}
};

mmc.init();