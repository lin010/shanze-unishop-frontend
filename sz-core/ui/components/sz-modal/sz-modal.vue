<template>
	<view>
		<view
			class="sz-modal"
			:class="[align, tpl, name == target ? 'show' : 'hide', { 'bg-mask-80': mask||mask=='80'}, { 'bg-mask-20': mask == '20' }, { 'bg-mask-40': mask == '40'}]"
			@tap="_cancel"
			:style="{ top: (noNav ? 0 : sz_navBar + top) + 'px' }"
		>
			<view :style="dialog" class="sz-dialog" :class="[transparent? 'bg-none' : '',ui]" @tap.stop>
				<view class="sz-modal-title border-bottom" v-if="title != ''"><sz-title :title="title" align="center" text="text-xl"></sz-title></view>
				
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'SzModal',
	props: {
		noNav: {
			type: Boolean,
			default: false
		},
		ui: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			default: ''
		},
		iconCancel: {
			type: [Boolean, String],
			default: false
		},
		showCancel: {
			type: [Boolean, String],
			default: true
		},
		option: {
			type: [Boolean, String],
			default: true
		},	
		cancelText: {
			type: String,
			default: '取消'
		},
		confirmText: {
			type: String,
			default: '确定'
		},
		name: {
			type: String,
			default: ''
		},
		align: {
			type: String,
			default: ''
		},
		dialog: {
			type: String,
			default: ''
		},
		tpl: {
			type: String,
			default: 'default'
		},
		transparent: {
			type: [Boolean, String],
			default: false
		},	
		mask: {
			type: [Boolean, String],
			default: true
		},
		duration: {
			type: Number,
			default: 0
		},
		top: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			touch: false
		};
	},
	computed: {
		...mapState({
			target: state => state.modal.target
		})
	},
	watch: {
		target: {
			handler(target) {
				if (target == this.name) {
					if (this.duration != 0) {
						setTimeout(() => {
							this.hide();
						}, this.duration);
					}
					setTimeout(() => {
						this.touch = true;
					}, 500);
				}
			},
			immediate: true
		}
	},
	methods: {
		hide() {
			if (this.touch) {
				this.$store.commit('setTarget', '');
				this.touch = false;
			}
		},
		_cancel() {
			this.hide();
			this.$emit('success', { cancel: true });
		},
		_confirm() {
			this.hide();
			this.$emit('success', { confirm: true });
		}
	}
}
</script>

<style>
</style>