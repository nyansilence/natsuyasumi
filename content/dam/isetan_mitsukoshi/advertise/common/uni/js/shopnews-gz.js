new Vue({
	el: '#shop-news-app',
	data: function () {
		return {
			page: 0,
			dispItemSize: 6,
			loading: true,
			errored: false,
			items: null,
			result: null,
			moreBtn: false,
			show: false
		}
	},
	filters: {
		trancate: function(str, length, omission) {
			var length = length ? parseInt(length, 10) : 20;
			var ommision = omission ? omission.toString() : '...';

			if(str.length <= length) {
				return str;
			}
			else {
				return str.substring(0, length) + ommision;
			}
  		},
		dateFormat: function(str) {
			var date = new Date(str.replace(/-/g,"/"));
			date.setTime(date.getTime());

			var dayOfWeek = date.getDay() ;
			var dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek] ;
			return date.getFullYear() + '年' + (date.getMonth() + 1)+ '月' + date.getDate() + '日' + '（' + dayOfWeekStr  +'）';
		}
	},
	mounted:function () {
		var vm = this;

		axios
			.get('https://www.mitsukoshi.mistore.jp/ginza/rss/hanabana.json')
		.then(function(response) {
			vm.result = response.data;
			if (vm.result && vm.result.length) {
				vm.items = vm.dipsItems();
				vm.page++;
			}
		})
		.catch(function(error) {
			console.log(error)
			vm.errored = true
			vm.show = false;
		})
		.finally(function() {vm.loading = false})
	},
	methods:{
		moreItems: function() {
			this.items = this.dipsItems();
			this.page++;
		},
		dipsItems: function() {
			var startPage = this.page * this.dispItemSize;

			this.show = true;
			if ((this.page + 1) * this.dispItemSize >= this.result.length) {
				this.moreBtn = false;
			} else {
				this.moreBtn = true;
			}

			return this.result.slice(0, startPage + this.dispItemSize);
		}
	}
})
