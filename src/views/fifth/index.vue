<!--
    @author: duanfc
    @time: 2024-08-16 10:00:00
    @description: 描述
    @path: /demo
    @lastChange: duanfc
-->

<template>
	<div class="fifth">
		<c-form
			ref="formRef"
			label-width="90px"
			:model="formInfo"
			label-position="right"
			:rules="rules"
		>
			<template #formItem>
				<c-form-item
					label="姓名"
					:is-expand="btnStatus"
					:item-index="1"
					prop="name"
				>
					<el-input v-model="formInfo.name" placeholder="请输入" />
				</c-form-item>
				<c-form-item
					:span="2"
					label="日期"
					:is-expand="btnStatus"
					:item-index="3"
					prop="time"
				>
					<el-date-picker
						v-model="formInfo.time"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
					/>
				</c-form-item>
				<c-form-item
					label="地址"
					:is-expand="btnStatus"
					:item-index="4"
				>
					<el-input v-model="formInfo.address" placeholder="请输入" />
				</c-form-item>
				<!-- <c-form-item
					label="编号"
					:is-expand="btnStatus"
					:item-index="5"
				>
					<el-input v-model="formInfo.code" placeholder="请输入" />
				</c-form-item>
				<c-form-item
					label="车牌号"
					:is-expand="btnStatus"
					:item-index="6"
				>
					<el-input v-model="formInfo.car" placeholder="请输入" />
				</c-form-item>
				<c-form-item
					label="手机号"
					:is-expand="btnStatus"
					:item-index="7"
				>
					<el-input v-model="formInfo.phone" placeholder="请输入" />
				</c-form-item>
                <c-form-item
					label="手机号1"
					:is-expand="btnStatus"
					:item-index="8"
				>
					<el-input v-model="formInfo.phone" placeholder="请输入" />
				</c-form-item>
                <c-form-item
					label="手机号2"
					:is-expand="btnStatus"
					:item-index="9"
				>
					<el-input v-model="formInfo.phone" placeholder="请输入" />
				</c-form-item> -->
				<c-form-item
					:is-btn="true"
					:col-total="4"
					:item-index="10"
					:is-expand="btnStatus"
				>
					<el-button type="primary" @click="onSubmit">查询</el-button>
					<el-button>取消</el-button>
					<div
						class="open-retract-btn"
						@click.prevent="btnStatus = !btnStatus"
						v-if="formBtnStatus"
					>
						<span class="text">{{
							btnStatus ? "收起" : "展开"
						}}</span>
						<el-icon>
							<ArrowUp v-if="btnStatus" />
							<ArrowDown v-else />
						</el-icon>
					</div>
				</c-form-item>
			</template>
		</c-form>
	</div>
</template>

<script lang="ts">
import { ref, reactive, onMounted } from "vue";
import cForm from "./components/cForm/index.vue";
import cFormItem from "./components/cFormItem/index.vue";
import { useFormBtnStatus } from "@/layout/hooks/useFormBtnStatus";

export default {
	name: "fifth",
	props: {},
	components: {
		cForm,
		cFormItem,
	},
	setup(props, context) {
		const formInfo = reactive({
			name: "",
			time: [],
			address: "",
			code: "",
			car: "",
			phone: "",
			idNum: "",
		});
		const formRef = ref(null);
		const onSubmit = async () => {
			if (!formRef.value.elFormRef) return;
			await formRef.value.elFormRef.validate(
				(valid: boolean, fields: Record<string, any>) => {
					if (valid) {
						console.log("submit!");
					} else {
						console.log("error submit!", fields);
					}
				}
			);
		};
		const btnStatus = ref(false); // true: 展开(收起状态)；false: 收起(收起状态)
		// 控制“展开”和“收起”按钮的显示与隐藏
		const formBtnStatus = useFormBtnStatus(4);
		const rules = reactive({
			name: [
				{
					required: true,
					message: "Please input Activity name",
					trigger: "blur",
				},
				{
					min: 3,
					max: 5,
					message: "Length should be 3 to 5",
					trigger: "blur",
				},
			],
			time: [
				{
					type: "array",
					required: true,
					message: "Please pick a date",
					trigger: ["change", "blur"],
				},
			],
		});

		onMounted(() => {});

		return {
			formInfo,
			onSubmit,
			btnStatus,
			formBtnStatus,
			formRef,
			rules,
		};
	},
};
</script>

<style lang="scss" scoped>
.fifth {
	height: 100%;
	width: 100%;
	.open-retract-btn {
		height: 32px;
		display: flex;
		align-items: center;
		padding: 0 8px;
		color: #296dff;
		cursor: pointer;
		.text {
			margin-right: 4px;
		}
	}
}
</style>