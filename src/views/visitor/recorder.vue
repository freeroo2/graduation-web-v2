<template>
    <div>
        <page-header title="访客填报" content="visitor" />
        <el-row :gutter="20" style="margin: -10px 10px;">
            <el-col :md="4" />
            <el-col :md="16">
                <page-main style="margin: 10px 0; text-align: center; font-weight: bold;">
                    访客填报表
                </page-main>
                <page-main style="margin: 10px 0;">
                    <el-form
                        ref="ruleFormRef"
                        :model="visitorStore.form"
                        :rules="Rules"
                        label-width="120px"
                        class="demo-ruleForm"
                        :size="formSize"
                    >
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="visitorStore.form.name" style="width: 20%;" placeholder="请输入姓名" />
                        </el-form-item>
                        <el-form-item label="身份证号码" prop="idcard">
                            <el-input v-model="visitorStore.form.idcard" style="width: 40%;" placeholder="请输入身份证号码" />
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="visitorStore.form.phone" style="width: 40%;" placeholder="请输入电话号码" />
                        </el-form-item>
                        <el-form-item label="受访住户" prop="visitedUid">
                            <el-select v-model="visitorStore.form.visitedUid" placeholder="" style="width: 40%;">
                                <el-option
                                    v-for="item in userStore.residents"
                                    :key="item.id"
                                    :label="item.address + '----' + item.nickName"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="访问时间" prop="arriveTime" required>
                            <div class="block">
                                <el-date-picker
                                    v-model="visitorStore.form.arriveTime"
                                    type="datetime"
                                    placeholder="请选择时间"
                                    :shortcuts="shortcuts"
                                    format="YYYY-MM-DD hh:mm:ss"
                                    value-format="YYYY-MM-DD hh:mm:ss"
                                />
                            </div>
                        </el-form-item>
                        <el-form-item label="是否通行" prop="passFlag">
                            <el-switch
                                v-model="visitorStore.form.passFlag"
                                class="ml-2"
                                inline-prompt
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="Y"
                                inactive-text="N"
                            />
                        </el-form-item>
                        <el-form-item v-show="!visitorStore.form.passFlag" label="拒绝理由" prop="banDesc">
                            <el-input v-model="visitorStore.form.banDesc" type="textarea" style="width: 85%;" />
                        </el-form-item>
                        <el-form-item v-show="visitorStore.form.passFlag" label="备注" prop="passDesc">
                            <el-input v-model="visitorStore.form.passDesc" type="textarea" style="width: 85%;" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="margin-left: 192px;" @click="submitForm(ruleFormRef)">
                                提交
                            </el-button>
                            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                        </el-form-item>
                    </el-form>
                </page-main>
            </el-col>
            <el-col :md="4" />
        </el-row>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useVisitorStore } from '@/store/modules/visitor'
import { formatDates } from '@/util/formatDate'
import { onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const visitorStore = useVisitorStore()
const formSize = ref('default')
const ruleFormRef = ref(null)
const ruleForm = reactive({
    name: '',
    phone: '',
    idcard: '',
    visitedUid: '',
    passFlag: false,
    banDesc: '',
    passDesc: '',
    arriveTime: '',
    pubTime: null
})
const Rules = reactive({
    name: [
        {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
        },
        {
            min: 2,
            max: 5,
            message: '名字长度在 2 到 5 个字符',
            trigger: 'blur'
        }
    ],
    idcard: [
        {
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
        },
        {
            min: 18,
            max: 18,
            message: '身份证号码长度为18位',
            trigger: 'blur'
        }
    ],
    phone: [
        {
            required: true,
            message: '请输入电话号码',
            trigger: 'blur'
        },
        {
            min: 11,
            max: 11,
            message: '电话号码长度为11位',
            trigger: 'blur'
        }
    ],
    arriveTime: [
        {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
        }
    ],
    visitedUid: [
        {
            required: true,
            message: '请选择受访人',
            trigger: 'blur'
        }
    ]
})
const shortcuts = [
    {
        text: '今天',
        value: new Date()
    },
    {
        text: '昨天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        }
    },
    {
        text: '一周前',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
        }
    }
]
function submitForm(formRef) {
    if (!formRef) return
    formRef.validate(valid => {
        console.log(valid)
        if (valid) {
            // console.log(ruleForm)
            console.log(visitorStore.form)
            visitorStore.form.pubTime = formatDates(new Date(), 'yyyy-MM-dd hh:mm:ss')
            visitorStore.createVisitor(visitorStore.form).then(() => {
                console.log('提交成功')
                formRef.resetFields()
                router.push({ path: '/success' })
            }).catch(err => {
                console.log(err)
            })
        } else {
            console.log('error submit!!')
            return false
        }
    })
}
function resetForm(formRef) {
    if (!formRef) return
    formRef.resetFields()
}

onBeforeRouteLeave((to, from, next) => {
    // Object.assign(visitorStore.form, {})
    visitorStore.form.id = null,
    visitorStore.form.name = '',
    visitorStore.form.phone = '',
    visitorStore.form.idcard = '',
    visitorStore.form.visitedUid = null,
    visitorStore.form.passFlag = false,
    visitorStore.form.banDesc = '',
    visitorStore.form.passDesc = '',
    visitorStore.form.arriveTime = null,
    visitorStore.form.pubTime = null,
    next()
})

userStore.userSearchByCidToArray(localStorage.account_cid)
</script>
