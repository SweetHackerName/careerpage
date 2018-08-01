console.log("test");
jQuery(document).ready(function($) {

	var jazzApi = 'https://api.resumatorapi.com/v1/jobs?',
			content = $('div#content'),
			jazzWrapper = $('<div class="jazz-wrapper"/>').appendTo(content),
			jazzSidebar = $('<div class="jazz-sidebar"/>').appendTo(jazzWrapper),
			jazzListings = $('<div class="jazz-Listings"/>').appendTo(jazzWrapper),
			tabs = $('<div class="tabs"/>').appendTo(jazzSidebar),
			tabOptions = ['Job Type', 'Employment Type', 'Minimum Experience', 'Location'],
			jobTypes = $('<div class="job-type filter-list"/>'),
			employTypes = $('<div class="employ-type filter-list"/>'),
			experiences = $('<div class="experience filter-list"/>'),
			taverns = $('<div class="locations filter-list"/>'),
			ul = $('<ul class="open-jobs"/>').appendTo(jazzListings),
			$clear = $('<button class="clear-filters">Clear all filters</button>').appendTo(jazzSidebar),
			pageLinks = $('<div class="pagination"><button class="page-link page-link-prev">Prev Page</button><button class="page-link page-link-next">Next Page</button></div>').appendTo(jazzSidebar),
			message = $('<div class="jobs-message"/>'),
			jobs = [],
			flags = [],
			hasJobs = [];


	$.getJSON(jazzApi, {
		apikey: 'swpyc03Q0A0xGNqSlzVIQXP7sfhYhvQN'
	}).done(function(allJobs){
		jobs = $.grep(allJobs, function(a) {
			return a.status === 'Open';
		});

		if (jobs.length == 0) {
			message.text('Sorry, we are always hiring...there may be a problem with the connection.').appendTo(jazzListings);
		} else {
			$.each(tabOptions, function(index, value) {
				var tab = $('<div class="tab-option tavern-tab" id="' + value.replace(/[\+':-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase() + '"><h6>' + value + '</h6></div>').appendTo(tabs);
				//append all filter groups to respective tab
				taverns.appendTo($('#location'));
				jobTypes.appendTo($('#job-type'));
				employTypes.appendTo($('#employment-type'));
				experiences.appendTo($('#minimum-experience'));
			});
			for (i = 0; i<jobs.length; i++) {
				if (flags[jobs[i].department]) continue;
				flags[jobs[i].department] = true;
				//ahhh the below string concatenation is so long and I will fix..
				//adding each individual tavern/location to the filter list
				var tavern = $('<div><input type= "checkbox" class="job-filter tavern-filter" id="job-'+ jobs[i].department.replace(/[\+':-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase() +'" name="job-'+ jobs[i].department.replace(/[\+':-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase() +'"></input><label class="tavern-label filter-label" for="job-'+ jobs[i].department.replace(/[\+':-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase() +'">' + jobs[i].department + '</label></div>').appendTo(taverns);
				console.log(jobs[i].department.replace(/[\+':-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase())
				console.log(jobs[i].department);
				// hasJobs.push();
			};

			//hard code append all the tab options to the tabs, but this will come from API eventually
			var jobType = $('<div><input type="checkbox" class="job-filter" name="jobType1"></input><label for="jobType1" class="filter-label">Corporate</label></div>').appendTo(jobTypes);
			var employType = $('<div><input type="checkbox" class="job-filter" name="employType1"></input><label for="employType1" class="filter-label">Part-Time</label></div>').appendTo(employTypes);
			var experience = $('<div><input type="checkbox" class="job-filter" name="jobType1"></input><label for="jobType1" class="filter-label">5 years</label></div>').appendTo(experiences);
		};



		message.text('TESTING - Please choose a location above to see open positions.').appendTo(jazzListings);

		$.each(jobs, function(j) {
			var li = $('<li class="job-' + jobs[j].department.replace(/[\+':-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase() + '"/>').appendTo(ul),
					apply = $('<a class="job-apply" href="http://fourcornerstaverngroup.applytojob.com/apply/' + jobs[j].board_code + '" target="_blank" />').appendTo(li),
					name = $('<div class="open-job"/>').appendTo(li),
					title = $('<div class="open-job-name">' + jobs[j].title + '</div>').appendTo(name),
					type = $('<div class="open-job-type">' + jobs[j].type + '</div>').appendTo(name)

					// just hiding for now because this info is not in comps and you said that job listings should link out to jazz page
					// location = $('<div class="open-job-location">' + jobs[j].city + ', ' + jobs[j].state + '</div>').appendTo(name),
					// jobInfo = $('<div class="open-job-info"/>').hide().appendTo(li),
					// description = $('<div class="open-job-description">' + jobs[j].description + '</div>').appendTo(jobInfo),

		});

		//BEGIN FITLERING AND PAGINATION

		var $filteredJobs = [];
		var $allJobs = $('ul.open-jobs > li');
		$('.clear-filters').prop("disabled", true);
		$filteredJobs.push.apply($filteredJobs, $allJobs);

		//change listings per page here
		var currentPage = 1,
			resultsNum =15;

		function paginate (array, page_size, page_number) {
  		--page_number;
			$(array).removeClass('paginated');
  		return $(array.slice(page_number * page_size, (page_number + 1) * page_size)).addClass('paginated');
		}

		function paginateButtons(){
			var $jobs = $filteredJobs.length;
			var lastPage = ($jobs / 15);
			$('.page-link-prev').prop("disabled", false);
			if ($jobs <= 15){
				$('.page-link').prop("disabled", true);
			}
			else if (currentPage == 1){
				$('.page-link-prev').prop("disabled", true);
				$('.page-link-next').prop("disabled", false);
			}
			else if (currentPage < lastPage){
				$('.page-link-next').prop("disabled", false);
			}
			else if (currentPage >= lastPage){
				$('.page-link-next').prop("disabled", true);
			}
		};

		paginate($filteredJobs, resultsNum, currentPage);
		paginateButtons();

		$('.page-link-next').click(function(){
			currentPage++;
			paginate($filteredJobs, resultsNum, currentPage);
			paginateButtons();
		});
		$('.page-link-prev').click(function(){
			currentPage--;
			paginate($filteredJobs, resultsNum, currentPage);
			paginateButtons();
		});

//showing location list on load...can be another list or show none on load


		var $filterLists = $('.filter-list');
		$filterLists.last().addClass('list-active');

		var tabSelected = $('.tab-option').click(function() {
			var $thisTab = $(this).parent().find('.tab-option');
			var $thisList = $(this).find('.filter-list');
			$('.tab-option').removeClass('tab-selected');
			$(this).addClass('tab-selected');
			$filterLists.removeClass('list-active');
			$thisList.addClass('list-active');

		});

		var filters = $('.tavern-filter').click(function() {
			applyFilter(this.id);

			/* Commenting out logic to test using applyFilter
			console.log(this);
			$('ul.open-jobs > li').removeClass('paginated');

			var el = $('.' + this.id);
			if (this.id.match(/(manage)/)) {
				el = $('.job-four-corners-tavern-group');
			}
			if (this.id.match(/(office|corpor)/)) {
				el = $('.job-four-corners-tavern-group-corporate-office');
			}

			// original line: if (!el[0] && !$('.tab-option').first().hasClass('tab-selected')){
			if (!el[0]){
				message.text('Sorry, we are not currently hiring for these positions.').appendTo(jazzListings);
				$('.jobs-message').show();
			} else {
				$('.jobs-message').hide();
			}

			if ($(this).prop('checked')){
				el.addClass('show-job');
				$filteredJobs = $('.show-job');
				//setting page back to 1 every time they refilter
				currentPage = 1;
				paginate($filteredJobs, resultsNum, currentPage);
				paginateButtons();
				$('.clear-filters').prop("disabled", false);
			}else {
				el.removeClass('show-job');
				$filteredJobs = $('.show-job');
				currentPage = 1;
				paginate($filteredJobs, resultsNum, currentPage);
				paginateButtons();
			}
			// $('.tavern-filter').removeClass('tavern-selected');
			// $(this).addClass('tavern-selected');
			// $('html, body').animate({
			// 	scrollTop: $(document).height()
			// }, 300);
			$(".shell").scrollTop(1000);
			*/
		});

		$clear.click(function(e){
			e.preventDefault();
			$('ul.open-jobs > li').removeClass('show-job paginated');
			// $('ul.open-jobs > li').fadeOut(450);
			$('.tavern-filter').prop("checked", false);
			$('.clear-filters').prop("disabled", true);
			message.text('Select some filters to see job listing results, otherwise SEE ALL JOBS by refreshing the page.').appendTo(jazzListings);
			$('.jobs-message').show();
		})

		var openJob = $('.open-job').click(function() {
			var $thisJob = $(this).parent().find('.open-job-info');
			$(".open-job-info").not($thisJob).hide();
			$('.open-job-selected').not(this).removeClass('open-job-selected');
			$(this).toggleClass('open-job-selected');
			$(this).next('.open-job-info').toggle();
		})

		//Add function to do the logic of clicking a given filter so that we can also call it with the query string.
		function applyFilter(locationID, directCall = false){
			if(locationID){
				var baseEl = $('#' + locationID)[0];
				if(baseEl)
				{
					$('ul.open-jobs > li').removeClass('paginated');

					console.log(baseEl)
					console.log(baseEl.id)

					var el = $('.' + baseEl.id);
					console.log(el)
					if (baseEl.id.match(/(manage)/)) {
						el = $('.job-four-corners-tavern-group');
					}
					if (baseEl.id.match(/(office|corpor)/)) {
						el = $('.job-four-corners-tavern-group-corporate-office');
					}

					// original line: if (!el[0] && !$('.tab-option').first().hasClass('tab-selected')){
					if (!el[0]){
						message.text('Sorry, we are not currently hiring for these positions.').appendTo(jazzListings);
						$('.jobs-message').show();
					} else {
						$('.jobs-message').hide();
					}
					if(directCall){
						console.log($(baseEl).prop('checked'))
						if($(baseEl).prop('checked'))
						{
							$(baseEl).prop({'checked' : false});
						}
						else{
							$(baseEl).prop({'checked' : true});
						}
						console.log($(baseEl).prop('checked'))

					}
					if ($(baseEl).prop('checked')){
						el.addClass('show-job');
						$filteredJobs = $('.show-job');
						//setting page back to 1 every time they refilter
						currentPage = 1;
						paginate($filteredJobs, resultsNum, currentPage);
						paginateButtons();
						$('.clear-filters').prop("disabled", false);
					}else {
						el.removeClass('show-job');
						$filteredJobs = $('.show-job');
						currentPage = 1;
						paginate($filteredJobs, resultsNum, currentPage);
						paginateButtons();
					}
					// $('.tavern-filter').removeClass('tavern-selected');
					// $(this).addClass('tavern-selected');
					// $('html, body').animate({
					// 	scrollTop: $(document).height()
					// }, 300);
					$(".shell").scrollTop(1000);
				}
				else{

					console.log("no location match for" + locationID);
				}
			}
			else
			{
				console.log("no location id");
			}

		}

		let params = new URLSearchParams(window.location.search.slice(1));
		console.log("this is happening");
		for (let p of params) {
  		console.log(p);
		}
		//location ids are formatted as id="job-'+ jobs[i].department.replace(/[\+':-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase() +'"
		if(params.has('locationID'))
		{
			var baseID = params.get("locationID");
			console.log(baseID);
			formattedLocation = 'job-'+ baseID.replace(/[\+'":-]+/g, "").replace(/[\ ]+/g, "-").toLowerCase();
			applyFilter(formattedLocation, directCall=true);
		}


	}).fail(function(){
		console.log('error');
	});
});
