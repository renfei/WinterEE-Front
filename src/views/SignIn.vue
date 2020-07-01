<template>
    <v-app id="signin">
        <v-content align="center">
            <v-container align="center" class="fill-height" fluid>
                <v-row align="center" justify="center" style="margin: auto;">
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
                                    <h1 class="signin_title">{{ $t("lang.signin") }}</h1>
                                    <p class="signin_text">{{ $t("lang.signinwithyouraccount")}}</p>
                                    <v-text-field
                                            :label="this.$t('lang.yourusernameoremailorphonenumber')"
                                            name="account"
                                            type="text"
                                            :messages="accountmsg"
                                            :error="accounterror"
                                            outlined
                                            v-model="account"
                                    />
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed :text="true" color="primary" style="padding: 0;">
                                                {{$t("lang.forgotyouraccount")}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed :text="true" color="primary" style="padding: 0;">
                                                {{$t("lang.createaccount")}}
                                            </v-btn>
                                            <v-btn depressed color="primary" @click="checkAccount">{{$t("lang.next")}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                                <div class="password" align="center" v-show="showPassword">
                                    <h1 class="signin_title">{{$t("lang.welcome")}}</h1>
                                    <v-btn rounded small class="ma-2" @click="toAccountPage">
                                        <v-icon left>mdi-account-circle</v-icon>
                                        {{ account }}
                                        <v-icon right>mdi-menu-down</v-icon>
                                    </v-btn>
                                    <v-text-field
                                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                            :label="this.$t('lang.enteryourpasswordorverificationcode')"
                                            name="password"
                                            :type="show ? 'text' : 'password'"
                                            @click:append="show = !show"
                                            :messages="passwordmsg"
                                            :error="passworderror"
                                            outlined
                                            v-model="password"
                                    />
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed @click="sendtheverificationcode">
                                                {{$t("lang.sendtheverificationcode")}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" class="d-flex justify-space-between mb-6">
                                            <v-btn depressed :text="true" color="primary" style="padding: 0;">
                                                {{$t("lang.forgetpassword")}}
                                            </v-btn>
                                            <v-btn depressed color="primary" @click="doSignIn">{{$t("lang.signin")}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                            </v-card-text>
                        </v-card>
                        <v-row>
                            <v-col class="d-flex justify-space-between" xs="3" sm="4" md="5" lg="4" xl="3">
                                <v-select style="font-size: 12px;"
                                          :dense="true"
                                          v-model="this.$i18n.locale"
                                          :items="lang_items"
                                          @change="lang_change"
                                ></v-select>
                            </v-col>
                            <v-col class="d-flex justify-space-between" xs="9" sm="8" md="7" lg="8" xl="9">
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import {checkAccount, signIn} from "../api/index";
    import encryption from "../libs/encryption";
    import {getStore, setStore} from '../libs/storage';
    import locale from '../libs/locale';


    export default {
        name: 'signin',
        props: {
            source: String,
        },
        data: () => ({
            lang_items: locale.list(),
            showAccount: true,
            showPassword: false,
            show: false,
            loading: false,
            account: "",
            accountmsg: "",
            password: "",
            passwordmsg: "",
            accounterror: false,
            passworderror: false,
            accountType: ""
        }),
        methods: {
            lang_change(any){
                locale.setLocale(any);
                this.$i18n.locale = this.getStore('locale');
            },
            checkAccount(){
                this.loading = true;
                this.accountmsg = "";
                this.accounterror = false;
                if (this.account === "") {
                    this.accountmsg = this.$t("lang.cantfindyouraccount");
                    this.accounterror = true;
                    this.loading = false;
                    return;
                }
                let params = {
                    account: this.account,
                    language: this.$i18n.locale
                };
                checkAccount(params).then(res => {
                    if (res.code == 200) {
                        this.accountType = res.message;
                        this.showAccount = false;
                        this.showPassword = true;
                    } else {
                        this.accountmsg = res.message;
                        this.accounterror = true;
                    }
                    this.loading = false;
                });
            },
            doSignIn(){
                this.loading = true;
                this.passwordmsg = "";
                this.passworderror = false;
                encryption.aesEncrypt(this.password).then(val => {
                    //登陆
                    let params = {
                        name: this.account,
                        password: val.content,
                        keyid: val.KeyId,
                        grant_type: "auto_password",
                        client_id: "Browser",
                        client_secret: "w4nHQGH8oBsj4HMrgcYVyZRFPFbMUuLK",
                        language: this.getStore('locale')
                    };
                    signIn(params).then(res => {
                        if (res.code == 200) {
                            this.$message(res.data, "info");
                            console.log(res.data);
                            setStore('accessToken',res.data.access_token);
                            //T
                            setStore('accessTokenExpires',res.data.expires_in);
                            setStore('refreshToken',res.data.refresh_token);
                            this.$router.push({name:'home'});
                        } else {
                            this.passwordmsg = res.message;
                            this.passworderror = true;
                        }
                        this.loading = false;
                    });
                });
            },
            sendtheverificationcode(){
                //发送验证码
                this.$message(this.$t("lang.sendtheverificationcodeoff"), "info");
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
