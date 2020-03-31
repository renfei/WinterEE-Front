<template>
    <v-app id="signin">
        <v-content>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="4">
                        <v-card outlined :loading="loading">
                            <v-card-text style="padding: 48px 40px 36px;">
                                <v-img
                                        :src="require('../assets/RF.png')"
                                        class="my-3"
                                        contain
                                        height="25"
                                />
                                <div class="account" v-show="showAccount">
                                    <h1 class="signin_title">登录</h1>
                                    <p class="signin_text">使用您的账户登录</p>
                                    <v-text-field
                                            label="您的用户名或电子邮件或电话号码"
                                            name="account"
                                            type="text"
                                            :messages="accountmsg"
                                            :error="accounterror"
                                            outlined
                                            v-model="account"
                                    />
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed text="true" color="primary" style="padding: 0;">
                                                忘记了电子邮件地址？
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed text="true" color="primary" style="padding: 0;">创建账户
                                            </v-btn>
                                            <v-btn depressed color="primary" @click="accountnext">下一步</v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                                <div class="password" align="center" v-show="showPassword">
                                    <h1 class="signin_title">欢迎</h1>
                                    <v-btn rounded small class="ma-2" @click="toAccountPage">
                                        <v-icon left>mdi-account-circle</v-icon>
                                        {{ account }}
                                        <v-icon right>mdi-menu-down</v-icon>
                                    </v-btn>
                                    <v-text-field
                                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                            label="输入您的密码或验证码"
                                            name="password"
                                            :type="show ? 'text' : 'password'"
                                            @click:append="show = !show"
                                            :messages="passwordmsg"
                                            :error="passworderror"
                                            outlined
                                    />
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed>发送验证码</v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed text="true" color="primary" style="padding: 0;">忘记了密码？
                                            </v-btn>
                                            <v-btn depressed color="primary" @click="accountnext">下一步</v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    export default {
        name: 'signin',
        props: {
            source: String,
        },
        data: () => ({
            showAccount: true,
            showPassword: false,
            show: false,
            loading: false,
            account: "",
            accountmsg: "",
            passwordmsg: "",
            accounterror: false,
            passworderror: false
        }),
        methods: {
            accountnext(){
                this.loading = true;
                this.accountmsg = "找不到您的账户";
                this.accounterror = true;
                this.showAccount = false;
                this.showPassword = true;
                this.loading = false;
            },
            toAccountPage(){
                this.account = "";
                this.accountmsg = "";
                this.accounterror = false;
                this.showPassword = false;
                this.showAccount = true;
            }
        }
    }
</script>
<style>
    .signin_title {
        text-align: center;
        font-weight: 400;
        font-size: 24px;
        color: #202124;
        line-height: 1.3333;
    }

    .signin_text {
        text-align: center;
        font-weight: 400;
        font-size: 16px;
        color: #202124;
        line-height: 1.5;
    }
</style>
