<template>
	<view class="sz-fixed">
		<view
			class="sz-fixed-box"
			:id="'fixed-' + _uid"
			:class="[{ fixed: fixed }]"
			:style="[
				{
					left: sticky ? 'auto' : '0px',
					top: fixed && !bottom ? (noNav ? val : val + sz_navBar) + 'px' : 'auto',
					bottom: fixed && bottom ? val + 'px' : 'auto',
					zIndex: index + sz_layer
				}
			]"
		>
			<view class="sz-fixed-content" @tap="_toTop" :style="[{ zIndex: index + sz_layer }]"><slot /></view>
			<view class="sz-fixed-bottom" :class="[bg]" v-if="bottom && !noSafe"></view>
			<view
				class="sz-fixed-bg"
				:class="[ui,bg]"
				:style="[{ zIndex: index + sz_layer - 1 }, bg == 'bg-img' ? { backgroundImage: 'url(' + img + ')' } : {}, opacity ? { opacity: opacityVal } : '']"
			></view>
		</view>
		<view
			class="skeleton"
			:id="'skeleton-' + _uid"
			:style="[{ height: content.height + 'px', width: width + 'px' }]"
			v-if="sticky ? fixed : placeholder && fixed"
		></view>
	</view>
</template>

<script>
	export default {
		name: 'SzFixed',
		data() {
			return {
				content: {},
				fixed: true
			};
		},
		props: {
			noNav: {
				type: Boolean,
				default: false
			},
			noSafe: {
				type: Boolean,
				default: false
			},
			bottom: {
				type: Boolean,
				default: false
			},
			bg: {
				type: String,
				default: 'bg-none'
			},
			val: {
				type: Number,
				default: 0
			},
			width: {
				type: [String, Number],
				default: 0
			},
			opacity: {
				type: Boolean,
				default: false
			},
			opacityVal: {
				type: Number,
				default: 0
			},
			index: {
				type: [Number, String],
				default: 0
			},
			placeholder: {
				type: [Boolean],
				default: false
			},
			sticky: {
				type: [Boolean],
				default: false
			},
			noFixed: {
				type: Boolean,
				default: false
			},
			ui: {
				type: String,
				default: ''
			},
			clickTo: {
				type: Boolean,
				default: false
			}
		},
		created() {
			if (this.sticky) {
				this.fixed = false;
			}
			uni.$on('_scrollTop_' + this.$root._uid, e => {
				this.sz_scrollTop = e;
			});
		},
		watch: {
			sz_scrollTop(newValue, oldValue) {
				if (this.sticky) {
					this._setFixed(newValue);
				}
			},
			noFixed: {
				handler(val) {
					if (val) {
						this.fixed = false;
					}
				},
				immediate: true
			}
		},
		mounted() {
			this.$nextTick(function() {
				this._computedQuery();
			});
		},
		destroyed() {
			uni.$off('_scrollTop_' + this.$root._uid);
		},
		methods: {
			_computedQuery() {
				uni.createSelectorQuery()
					.in(this)
					.select('#fixed-' + this._uid)
					.boundingClientRect(data => {
						if (data != null) {			
							this.content = data;
							this.$emit('getHeight', data.height);
							this.$emit('update:height', data.height);
							if (this.sticky) {
								this._setFixed(this.sz_scrollTop);
							}
						} else {
							console.log('fixed-' + this._uid + ' data error');
						}
					})
					.exec();
			},
			_setFixed(value) {
				if (this.bottom) {
					this.fixed = value >= this.content.bottom - uni.getSystemInfoSync().windowHeight + this.content.height + this.val;
				} else {
					this.fixed = value >= this.content.top - (this.noNav ? this.val : this.val + this.sz_navBar);
				}
			},
			_toTop() {
				if (this.clickTo) {
					uni.pageScrollTo({
						scrollTop: this.content.top,
						duration: 100
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.sz-fixed {
		.sz-fixed-box {
			position: relative;
			width: 100%;
			&.fixed {
				position: fixed;
			}
			.sz-fixed-content {
				position: relative;
			}
			.sz-fixed-bg {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				z-index: 1;
				pointer-events: none;
			}
			.sz-fixed-bottom{
				height: calc(constant(safe-area-inset-bottom) / 5 * 3);
				height: calc(env(safe-area-inset-bottom) / 5 * 3);
			}
		}
	}
</style>